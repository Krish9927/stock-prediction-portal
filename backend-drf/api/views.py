from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import StockPredictionSerializer, FuturePredictionSerializer, TopStockSerializer
from rest_framework import status
from rest_framework.response import Response
from ai_engine import MultiDayForecaster, NewsSentimentAnalyzer
import yfinance as yf
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from datetime import datetime
import os
from django.conf import settings
from .utils import save_plot, get_currency_meta
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_squared_error,r2_score
import requests
# Create your views here.
class StockPredictionAPIView(APIView):
    def post(self,request):
        serializer = StockPredictionSerializer(data=request.data)
        if serializer.is_valid():
            ticker=serializer.validated_data['ticker']
            # fetch data from yfinanace
            now = datetime.now()
            start = datetime(now.year-10,now.month,now.day)
            end = now
            df=yf.download(ticker,start,end)
            
            print(df)
            if df.empty:
                return Response({'error':'No data found for the given tocker',
                                 'status':status.HTTP_404_NOT_FOUND
                                 })
            df=df.reset_index()
            # Generate basic plot
            plt.switch_backend('AGG')
            plt.figure(figsize=(12,5))
            plt.plot(df['Close'],label='Closing Price')
            plt.title(f'Closing Price of {ticker}')
            plt.xlabel('Days')
            plt.ylabel('Close Price')
            plt.legend()
            #Save Plot to a file
            plot_img_path=f'{ticker}_plot.png'
            plot_img=save_plot(plot_img_path)
            # image_path=os.path.join(settings.MEDIA_ROOT,plot_img_path)
            # plt.savefig(image_path)
            # plt.close()
            # plot_img=settings.MEDIA_URL + plot_img_path
            print(plot_img)
            # 100 days moving average
            ma100=df.Close.rolling(100).mean()
            plt.switch_backend('AGG')
            plt.figure(figsize=(12,5))
            plt.plot(df['Close'],label='Closing Price')
            plt.plot(ma100,'r',label='100 DMA')
            plt.title(f'100 Days Moving Average of {ticker}')
            plt.xlabel('Days')
            plt.ylabel('Close Price')
            plt.legend()
            plot_img_path=f'{ticker}_100dma.png'
            plot_100_dma=save_plot(plot_img_path)
            #200 days moving average
            ma200=df.Close.rolling(200).mean()
            plt.switch_backend('AGG')
            plt.figure(figsize=(12,5))
            plt.plot(df['Close'],label='Closing Price')
            plt.title(f'200 Days Moving Average of {ticker}')
            plt.plot(ma100,'r',label='100 DMA')
            plt.plot(ma200,'g',label='200 DMA')
            plt.xlabel('Days')
            plt.ylabel('Close Price')
            plt.legend()
            plot_img_path=f'{ticker}_200dma.png'
            plot_200_dma=save_plot(plot_img_path)
            #splitting data  into training and testing data set
            data_training=pd.DataFrame(df.Close[0:int(len(df)*0.7)])
            data_testing=pd.DataFrame(df.Close[int(len(df)*0.7):int(len(df))])
            #scaling data b\w 0 and 1
            scaler = MinMaxScaler(feature_range=(0,1))
            # fit scaler on training data only, then transform full input
            scaler.fit_transform(data_training)
            # load model
            from keras.models import load_model
            model = load_model('stock-prediction-model.keras')
            #prepare test data for model
            past_100_days=data_training.tail(100)
            final_df=pd.concat([past_100_days,data_testing],ignore_index=True)
            input_data=scaler.transform(final_df)

            x_test=[]
            y_test=[]
            for i in range(100,input_data.shape[0]):
               x_test.append(input_data[i-100:i])
               y_test.append(input_data[i,0])
            x_test,y_test=np.array(x_test),np.array(y_test)
            #making prediction
            y_predicted=model.predict(x_test)
            #revert scale price to orignlprice
            y_predicted=scaler.inverse_transform(y_predicted.reshape(-1,1)).flatten()
            y_test=scaler.inverse_transform(y_test.reshape(-1,1)).flatten() 
            #plot final prediciton
            
            # print('yPreidiciion',y_predicted)
            # print('ytest',y_test)
            ma200=df.Close.rolling(200).mean()
            plt.switch_backend('AGG')
            plt.figure(figsize=(12,5))
            plt.title(f'Final Prediciton of {ticker}')
            plt.plot(y_test,'b',label='Original Price')
            plt.plot(y_predicted,'r',label='Predicted Price')
            plt.xlabel('Days')
            plt.ylabel(' Price')
            plt.legend()
            plot_img_path=f'{ticker}_finalpredicition.png'
            plot_prediction=save_plot(plot_img_path)
            #model Evaluation
            #mean squared error(MSE)
            mse=mean_squared_error(y_test,y_predicted)
            # Root means Squared Error
            rmse=np.sqrt(mse)
            #R-squared
            r2=r2_score(y_test,y_predicted)
            # fetch information from yfinance
            ticker_obj = yf.Ticker(ticker)
            info = ticker_obj.info or {}
            curr_meta = get_currency_meta(ticker, info)

            company_data = {
                "name": info.get("longName") or ticker,
                "symbol": info.get("symbol") or ticker,
                "sector": info.get("sector"),
                "industry": info.get("industry"),
                "market_cap": info.get("marketCap"),
                "website": info.get("website"),
                "description": info.get("longBusinessSummary"),
                "currency_code": curr_meta["currency_code"],
                "currency_symbol": curr_meta["currency_symbol"],
                "country": curr_meta["country"],
                "exchange": curr_meta["exchange"],
            }

            print(company_data)
            return Response({'status':'success',
                             'plot_img':plot_img,
                             'plot_100_dma':plot_100_dma,
                             'plot_200_dma':plot_200_dma,
                             'plot_prediction':plot_prediction,
                             'mse':mse,
                             'rmse':rmse,
                             'r2':r2,
                             'company_data':company_data,
                             })


class Top10ActiveStocksAPIView(APIView):
    def post(self,request):
        serializer=TopStockSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        number=serializer.validated_data['number']
        return Response({
            'message':'Number recieved successfully',
            'number':number
        })
    def get(self, request):
        number=request.query_params.get('number')
        if not number:
            return Response({'error':'number is required'},status=400)
        try:
            number=int(number)
        except ValueError:
            return Response({'error':'number must br an integer'},status=400)
        headers = {"User-Agent": "Mozilla/5.0"}
        url = (
            f"https://query2.finance.yahoo.com/v1/finance/screener/predefined/saved?count={number}&scrIds=most_actives"
        )

        try:
          response = requests.get(url, headers=headers, timeout=10)
          response.raise_for_status()
        except requests.RequestException as e:
            print("Yahoo Global Error:", e)
            return Response(
               {"error": "Yahoo Finance service unavailable"},
               status=status.HTTP_503_SERVICE_UNAVAILABLE
                )

        data = response.json()
        quotes = (
            data.get("finance", {})
                .get("result", [{}])[0]
                .get("quotes", [])
        )

        stocksglobal = []
        for q in quotes:
            stocksglobal.append({
                "symbol": q.get("symbol"),
                "name": q.get("shortName", "No Name"),
                "price": q.get("regularMarketPrice"),
                "change_percent": q.get("regularMarketChangePercent"),
                "volume": q.get("regularMarketVolume"),
            })
        ourcountry_url = (
            f"https://query2.finance.yahoo.com/v1/finance/screener/predefined/saved?count={number}&scrIds=most_actives_in"
        )
        try:
           india_res = requests.get(ourcountry_url, headers=headers, timeout=10)
           india_res.raise_for_status()
        except requests.RequestException as e:
           print("Yahoo India Error:", e)
           return Response(
            {"error": "Yahoo India service unavailable"},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
             )   
        india_data=india_res.json()
        india_quotes=(
            india_data.get('finance',{})
                      .get('result',[{}])[0]
                      .get('quotes',[])    
        )
        india=[
             {
             'symbol':q.get('symbol'),
             'name':q.get('shortName','No Name'),
             'price':q.get('regularMarketPrice'),
             'change_percent':q.get('regularMarketChangePercent'),
             'volume':q.get('regularMarketVolume'),
             }
             for q in india_quotes
         ]   
        print(stocksglobal)  
        return Response(
            {"top100_worldwide": stocksglobal,
             'Indiatop20':india,
             },

            status=status.HTTP_200_OK
        )


class FuturePredictionAPIView(APIView):
    """
    API View to run multi-day autoregressive future price forecasting,
    FinBERT news sentiment analysis, and multimodal hybrid signal synthesis.
    """
    def post(self, request):
        serializer = FuturePredictionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        ticker = serializer.validated_data['ticker'].upper().strip()
        days_ahead = serializer.validated_data.get('days_ahead', 15)

        # 1. Fetch historical data
        now = datetime.now()
        start = datetime(now.year - 10, now.month, now.day)
        try:
            df = yf.download(ticker, start, now)
        except Exception as e:
            return Response({'error': f'Failed to fetch data for {ticker}: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

        if df.empty:
            return Response({'error': f'No data found for ticker {ticker}'}, status=status.HTTP_404_NOT_FOUND)

        df = df.reset_index()

        # 2. Run multi-day future forecasting
        try:
            forecaster = MultiDayForecaster()
            forecast_results = forecaster.predict_future(df, days_ahead=days_ahead)
        except Exception as e:
            return Response({'error': f'Forecasting failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


        # 3. Fetch company & currency origin metadata
        try:
            ticker_obj = yf.Ticker(ticker)
            info = ticker_obj.info or {}
            curr_meta = get_currency_meta(ticker, info)
            company_data = {
                "name": info.get("longName") or ticker,
                "symbol": info.get("symbol") or ticker,
                "sector": info.get("sector"),
                "industry": info.get("industry"),
                "market_cap": info.get("marketCap"),
                "website": info.get("website"),
                "description": info.get("longBusinessSummary"),
                "currency_code": curr_meta["currency_code"],
                "currency_symbol": curr_meta["currency_symbol"],
                "country": curr_meta["country"],
                "exchange": curr_meta["exchange"],
            }
        except Exception:
            curr_meta = get_currency_meta(ticker, {})
            company_data = {
                "name": ticker,
                "symbol": ticker,
                "currency_code": curr_meta["currency_code"],
                "currency_symbol": curr_meta["currency_symbol"],
                "country": curr_meta["country"],
                "exchange": "Unknown",
            }

        forecast_results["currency_symbol"] = curr_meta["currency_symbol"]
        forecast_results["currency_code"] = curr_meta["currency_code"]
        forecast_results["country"] = curr_meta["country"]

        # 4. Generate visual forecast plot with confidence interval cone
        try:
            plt.switch_backend('AGG')
            plt.figure(figsize=(12, 6))

            # Use last 60 days of historical data for clear visualization
            recent_hist = df.tail(60).copy()
            hist_prices = recent_hist['Close'].values.flatten()
            hist_days = np.arange(len(hist_prices))

            plt.plot(hist_days, hist_prices, label='Historical Close (Last 60 Days)', color='#38bdf8', linewidth=2)

            # Future forecast indices (connecting seamlessly from last historical point)
            last_hist_idx = hist_days[-1]
            last_hist_price = hist_prices[-1]
            future_indices = np.arange(last_hist_idx, last_hist_idx + days_ahead + 1)

            pred_prices_with_anchor = np.insert([item['predicted_price'] for item in forecast_results['forecast_series']], 0, last_hist_price)
            upper_bounds_with_anchor = np.insert([item['upper_bound_95'] for item in forecast_results['forecast_series']], 0, last_hist_price)
            lower_bounds_with_anchor = np.insert([item['lower_bound_95'] for item in forecast_results['forecast_series']], 0, last_hist_price)

            plt.plot(future_indices, pred_prices_with_anchor, label=f'LSTM Forecast (Next {days_ahead} Days)', color='#f59e0b', linestyle='--', linewidth=2.5)
            plt.fill_between(future_indices, lower_bounds_with_anchor, upper_bounds_with_anchor, color='#f59e0b', alpha=0.22, label='95% Confidence Interval')

            plt.axvline(x=last_hist_idx, color='#94a3b8', linestyle=':', label='Forecast Horizon Start')
            plt.title(f'{days_ahead}-Day Price Forecast with 95% Confidence Cone: {ticker} ({curr_meta["country"]})', fontsize=14, fontweight='bold')
            plt.xlabel('Trading Days Timeline', fontsize=11)
            plt.ylabel(f'Price ({curr_meta["currency_symbol"]} {curr_meta["currency_code"]})', fontsize=11)
            plt.legend(loc='upper left')
            plt.grid(True, linestyle='--', alpha=0.3)

            plot_future_filename = f'{ticker}_future_{days_ahead}d.png'
            plot_future_url = save_plot(plot_future_filename)
        except Exception as e:
            print(f"Error generating future plot: {e}")
            plot_future_url = None

        # 5. Run FinBERT news sentiment analysis
        sentiment_analyzer = NewsSentimentAnalyzer()
        sentiment_results = sentiment_analyzer.analyze_news(ticker, max_articles=8)

        # 6. Multimodal Hybrid Signal synthesis
        hybrid_signal = NewsSentimentAnalyzer.calculate_hybrid_signal(forecast_results, sentiment_results)

        return Response({
            "status": "success",
            "ticker": ticker,
            "days_ahead": days_ahead,
            "currency_symbol": curr_meta["currency_symbol"],
            "currency_code": curr_meta["currency_code"],
            "country": curr_meta["country"],
            "plot_future": plot_future_url,
            "forecast_data": forecast_results,
            "sentiment_data": sentiment_results,
            "hybrid_signal": hybrid_signal,
            "company_data": company_data,
        }, status=status.HTTP_200_OK)


class SentimentAnalysisAPIView(APIView):
    """
    Dedicated endpoint to fetch and analyze news sentiment for any ticker.
    """
    def get(self, request, ticker):
        ticker = ticker.upper().strip()
        analyzer = NewsSentimentAnalyzer()
        sentiment_data = analyzer.analyze_news(ticker)
        return Response({
            "status": "success",
            "sentiment_data": sentiment_data,
        }, status=status.HTTP_200_OK)




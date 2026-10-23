import os
import numpy as np
import pandas as pd
from datetime import timedelta
from sklearn.preprocessing import MinMaxScaler
import matplotlib.pyplot as plt

from .config import DEFAULT_MODEL_PATH, DEFAULT_LOOKBACK_DAYS, CONFIDENCE_LEVEL


class MultiDayForecaster:
    """
    Handles multi-day future price forecasting using trained LSTM models
    with recursive multi-step rollouts and uncertainty confidence bounds.
    """

    def __init__(self, model_path: str = DEFAULT_MODEL_PATH, lookback_days: int = DEFAULT_LOOKBACK_DAYS):
        self.lookback_days = lookback_days
        self.model_path = model_path
        self._model = None

    @property
    def model(self):
        if self._model is None:
            if not os.path.exists(self.model_path):
                raise FileNotFoundError(f"Model file not found at {self.model_path}")
            from keras.models import load_model
            self._model = load_model(self.model_path)
        return self._model

    def predict_future(self, df: pd.DataFrame, days_ahead: int = 15) -> dict:
        """
        Generates recursive future predictions for the next `days_ahead` trading days.

        Args:
            df: DataFrame containing historical prices with 'Close' and 'Date' index/column.
            days_ahead: Number of days to forecast into future (e.g. 7, 15, 30).

        Returns:
            Dictionary containing forecast timestamps, predicted prices, confidence bands,
            and expected directional change.
        """
        if "Close" not in df.columns:
            raise ValueError("Dataframe must contain 'Close' column.")

        close_series = df["Close"].values.reshape(-1, 1)
        if len(close_series) < self.lookback_days:
            raise ValueError(f"Need at least {self.lookback_days} historical data points, got {len(close_series)}")

        # Fit scaler on full historical series
        scaler = MinMaxScaler(feature_range=(0, 1))
        scaled_data = scaler.fit_transform(close_series)

        # Estimate daily price volatility (log returns std) for expanding uncertainty cone
        returns = np.diff(np.log(close_series.flatten()))
        daily_volatility = np.std(returns) if len(returns) > 0 else 0.02

        # Initialize rolling window with the last `lookback_days` scaled prices
        current_batch = scaled_data[-self.lookback_days:].reshape((1, self.lookback_days, 1))

        future_predictions_scaled = []

        # Autoregressive multi-step prediction loop
        for step in range(days_ahead):
            # Predict next day
            next_pred = self.model.predict(current_batch, verbose=0)
            future_predictions_scaled.append(next_pred[0, 0])

            # Update rolling window: drop oldest day, append new predicted day
            new_pred_reshaped = next_pred.reshape((1, 1, 1))
            current_batch = np.append(current_batch[:, 1:, :], new_pred_reshaped, axis=1)

        # Invert scaling back to original currency price
        future_predictions = scaler.inverse_transform(
            np.array(future_predictions_scaled).reshape(-1, 1)
        ).flatten()

        # Generate future dates (business days)
        last_date = df["Date"].iloc[-1] if "Date" in df.columns else pd.Timestamp.now()
        if isinstance(last_date, str):
            last_date = pd.to_datetime(last_date)

        future_dates = []
        curr_date = last_date
        while len(future_dates) < days_ahead:
            curr_date += timedelta(days=1)
            # Filter standard weekends (Monday=0 ... Sunday=6)
            if curr_date.weekday() < 5:
                future_dates.append(curr_date.strftime("%Y-%m-%d"))

        # Calculate expanding confidence intervals: CI = Price * (1 ± Z * sigma * sqrt(t))
        current_price = float(close_series[-1][0])
        forecast_items = []
        upper_bounds = []
        lower_bounds = []

        for t, (date_str, pred_price) in enumerate(zip(future_dates, future_predictions), start=1):
            uncertainty_margin = pred_price * (CONFIDENCE_LEVEL * daily_volatility * np.sqrt(t))
            upper_val = round(float(pred_price + uncertainty_margin), 2)
            lower_val = round(float(max(0.01, pred_price - uncertainty_margin)), 2)
            pred_val = round(float(pred_price), 2)

            upper_bounds.append(upper_val)
            lower_bounds.append(lower_val)

            forecast_items.append({
                "date": date_str,
                "day_index": t,
                "predicted_price": pred_val,
                "upper_bound_95": upper_val,
                "lower_bound_95": lower_val,
            })

        final_predicted_price = float(future_predictions[-1])
        pct_change = ((final_predicted_price - current_price) / current_price) * 100.0

        return {
            "current_price": round(current_price, 2),
            "forecast_horizon_days": days_ahead,
            "predicted_final_price": round(final_predicted_price, 2),
            "expected_change_percent": round(pct_change, 2),
            "directional_bias": "BULLISH" if pct_change > 0.5 else ("BEARISH" if pct_change < -0.5 else "NEUTRAL"),
            "forecast_series": forecast_items,
        }

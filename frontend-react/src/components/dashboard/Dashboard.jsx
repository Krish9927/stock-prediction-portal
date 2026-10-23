import React, { useEffect, useState } from 'react'
import axiosInstance from '../../axiosinstancs'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { MdSearch, MdShowChart, MdTrendingUp, MdTrendingDown, MdTrendingFlat, MdArticle, MdTimeline } from 'react-icons/md'
import { BsGlobe, BsLightningChargeFill, BsShieldCheck } from 'react-icons/bs'
import { HiOutlineExternalLink } from 'react-icons/hi'

const Dashboard = () => {
  const [ticker, setTicker] = useState('')
  const [daysAhead, setDaysAhead] = useState(15)
  const [activeTab, setActiveTab] = useState('future') // 'future' or 'historical'
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Future & AI engine state
  const [futurePlot, setFuturePlot] = useState(null)
  const [forecastData, setForecastData] = useState(null)
  const [sentimentData, setSentimentData] = useState(null)
  const [hybridSignal, setHybridSignal] = useState(null)
  const [companyData, setCompanyData] = useState(null)

  // Historical evaluation state
  const [histPlot, setHistPlot] = useState(null)
  const [ma100, setMA100] = useState(null)
  const [ma200, setMA200] = useState(null)
  const [pred, setPred] = useState(null)
  const [mse, setMse] = useState(null)
  const [rmse, setRMse] = useState(null)
  const [r2, setR2] = useState(null)

  useEffect(() => {
    const fetchProtectedData = async () => {
      try {
        await axiosInstance.get('/protected-view/')
      } catch (e) {
        console.error('Auth check failed', e)
      }
    }
    fetchProtectedData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!ticker.trim()) return
    setLoading(true)
    setError('')
    setFuturePlot(null)
    setForecastData(null)
    setSentimentData(null)
    setHybridSignal(null)
    setHistPlot(null)

    const backendRoot = import.meta.env.VITE_BACKEND_ROOT || 'http://127.0.0.1:8000'

    try {
      // 1. Fetch AI Future Prediction & FinBERT Sentiment
      const futureRes = await axiosInstance.post('/predict-future/', {
        ticker: ticker.trim().toUpperCase(),
        days_ahead: Number(daysAhead),
      })

      if (futureRes.data.status === 'success') {
        if (futureRes.data.plot_future) {
          setFuturePlot(`${backendRoot}${futureRes.data.plot_future}`)
        }
        setForecastData(futureRes.data.forecast_data)
        setSentimentData(futureRes.data.sentiment_data)
        setHybridSignal(futureRes.data.hybrid_signal)
        setCompanyData(futureRes.data.company_data)
      }

      // 2. Fetch Historical Model Evaluation for DMA & Test Comparison
      try {
        const histRes = await axiosInstance.post('/predict/', { ticker: ticker.trim().toUpperCase() })
        setHistPlot(`${backendRoot}${histRes.data.plot_img}`)
        setMA100(`${backendRoot}${histRes.data.plot_100_dma}`)
        setMA200(`${backendRoot}${histRes.data.plot_200_dma}`)
        setPred(`${backendRoot}${histRes.data.plot_prediction}`)
        setMse(histRes.data.mse)
        setRMse(histRes.data.rmse)
        setR2(histRes.data.r2)
      } catch (histErr) {
        console.warn('Historical evaluation endpoint warning:', histErr)
      }

    } catch (err) {
      console.error(err)
      setError(err?.response?.data?.error || 'Something went wrong. Please verify the stock ticker and try again.')
    } finally {
      setLoading(false)
    }
  }

  // Signal color helper
  const getSignalBadgeColor = (signal) => {
    switch (signal) {
      case 'STRONG BUY':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-emerald-500/20'
      case 'BUY':
        return 'bg-green-500/20 text-green-400 border-green-500/40'
      case 'SELL':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40'
      case 'STRONG SELL':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/50 shadow-rose-500/20'
      default:
        return 'bg-sky-500/20 text-sky-400 border-sky-500/40'
    }
  }

  const getSentimentBadge = (sentiment) => {
    if (sentiment === 'positive') return <span className="badge badge-success badge-sm">Bullish</span>
    if (sentiment === 'negative') return <span className="badge badge-error badge-sm">Bearish</span>
    return <span className="badge badge-ghost badge-sm text-base-content/60">Neutral</span>
  }

  // Helper to format market cap according to origin country/currency
  const formatMarketCap = (cap, currencyCode, currencySymbol) => {
    if (!cap) return '—'
    if (currencyCode === 'INR') {
      if (cap >= 1e7) {
        return `${currencySymbol}${(cap / 1e7).toFixed(2)} Cr`
      }
      return `${currencySymbol}${cap.toLocaleString('en-IN')}`
    }
    if (cap >= 1e12) {
      return `${currencySymbol}${(cap / 1e12).toFixed(2)} T`
    }
    if (cap >= 1e9) {
      return `${currencySymbol}${(cap / 1e9).toFixed(2)} B`
    }
    if (cap >= 1e6) {
      return `${currencySymbol}${(cap / 1e6).toFixed(2)} M`
    }
    return `${currencySymbol}${cap.toLocaleString()}`
  }

  const currSymbol = companyData?.currency_symbol || forecastData?.currency_symbol || '$'
  const currCode = companyData?.currency_code || forecastData?.currency_code || 'USD'
  const countryOrigin = companyData?.country || 'Global'

  return (
    <div className="w-full min-h-screen bg-base-100 px-4 py-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <BsLightningChargeFill /> AI-Powered Financial Intelligence
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-base-content tracking-tight">
            Stock <span className="grad-text">Forecast & Sentiment</span> Portal
          </h1>
          <p className="text-base-content/60 text-sm mt-2 max-w-xl mx-auto">
            Multi-step autoregressive LSTM forecasting with FinBERT news sentiment fusion.
          </p>
        </div>

        {/* Search & Horizon Form */}
        <div className="card bg-base-200 border border-base-content/10 shadow-lg mb-8">
          <div className="card-body p-5 sm:p-6">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4">
              {/* Ticker Input */}
              <div className="flex-1 w-full">
                <label className="input w-full flex items-center gap-2 bg-base-300 border border-base-content/15 focus-within:border-cyan-400">
                  <MdSearch className="text-base-content/50 text-xl flex-shrink-0" />
                  <input
                    type="text"
                    className="grow bg-transparent outline-none text-base-content placeholder:text-base-content/30 font-medium"
                    placeholder="Enter ticker (e.g. AAPL, TSLA, RELIANCE.NS, TATAELXSI.BO)"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value.toUpperCase())}
                  />
                </label>
              </div>

              {/* Horizon Selector */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-semibold text-base-content/50 uppercase">Horizon:</span>
                <div className="join bg-base-300 p-1 rounded-lg border border-base-content/10">
                  {[7, 15, 30].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setDaysAhead(days)}
                      className={`join-item btn btn-xs sm:btn-sm border-none ${
                        daysAhead === days
                          ? 'grad text-white font-bold'
                          : 'bg-transparent text-base-content/60 hover:text-base-content'
                      }`}
                    >
                      {days}D
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !ticker.trim()}
                className="btn text-white border-none hover:opacity-90 w-full sm:w-auto min-w-36 grad shadow-md"
              >
                {loading ? (
                  <AiOutlineLoading3Quarters className="animate-spin text-lg" />
                ) : (
                  <>
                    <MdShowChart className="text-lg" /> Analyze AI
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {error && (
          <div className="alert alert-error mb-8 shadow-md">
            <span>{error}</span>
          </div>
        )}

        {/* Company Overview Header */}
        {companyData && (
          <div className="card bg-base-200 border border-base-content/10 mb-8 overflow-hidden shadow-md">
            <div className="card-body p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-base-content">{companyData.name}</h2>
                    <span className="badge badge-primary font-mono font-semibold">{companyData.symbol}</span>
                    <span className="badge badge-outline text-xs text-cyan-400 border-cyan-400/40 font-semibold">
                      📍 {countryOrigin} ({currCode})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {companyData.sector && (
                      <span className="badge badge-outline text-xs text-base-content/60">{companyData.sector}</span>
                    )}
                    {companyData.industry && (
                      <span className="badge badge-outline text-xs text-base-content/60">{companyData.industry}</span>
                    )}
                    {companyData.market_cap && (
                      <span className="badge badge-outline text-xs text-emerald-400 border-emerald-400/30 font-semibold">
                        Cap: {formatMarketCap(companyData.market_cap, currCode, currSymbol)}
                      </span>
                    )}
                    {companyData.website && (
                      <a
                        href={companyData.website}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-cyan-400 hover:underline text-xs"
                      >
                        <BsGlobe className="text-xs" /> Website
                      </a>
                    )}
                  </div>
                </div>

                {forecastData && (
                  <div className="flex gap-6 bg-base-300/60 p-4 rounded-xl border border-base-content/5">
                    <div>
                      <p className="text-xs uppercase text-base-content/50 font-medium">Last Close</p>
                      <p className="text-xl font-bold text-base-content">{currSymbol}{forecastData.current_price}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-base-content/50 font-medium">{daysAhead}D Target</p>
                      <p className="text-xl font-bold text-cyan-400">{currSymbol}{forecastData.predicted_final_price}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-base-content/50 font-medium">Expected Move</p>
                      <p
                        className={`text-xl font-bold flex items-center gap-1 ${
                          forecastData.expected_change_percent >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {forecastData.expected_change_percent >= 0 ? <MdTrendingUp /> : <MdTrendingDown />}
                        {forecastData.expected_change_percent > 0 ? '+' : ''}
                        {forecastData.expected_change_percent}%
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Results Container with Tabs */}
        {(forecastData || histPlot) && (
          <div>
            {/* Tab navigation */}
            <div className="tabs tabs-boxed bg-base-200 border border-base-content/10 p-1 mb-6 max-w-md mx-auto">
              <button
                type="button"
                onClick={() => setActiveTab('future')}
                className={`tab flex-1 gap-2 font-medium ${activeTab === 'future' ? 'tab-active grad text-white' : 'text-base-content/60'}`}
              >
                  AI Forecast & News Sentiment
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('historical')}
                className={`tab flex-1 gap-2 font-medium ${activeTab === 'historical' ? 'tab-active grad text-white' : 'text-base-content/60'}`}
              >
                <MdTimeline /> Historical DMA & Metrics
              </button>
            </div>

            {/* TAB 1: AI Future Forecast & FinBERT Sentiment */}
            {activeTab === 'future' && (
              <div className="flex flex-col gap-6">

                {/* Multimodal Hybrid Decision Banner */}
                {hybridSignal && (
                  <div className="card bg-base-200 border border-base-content/10 shadow-lg overflow-hidden">
                    <div className="card-body p-6">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-base-content/50">
                              Multimodal AI Signal
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full border text-sm font-extrabold shadow-sm ${getSignalBadgeColor(
                                hybridSignal.signal
                              )}`}
                            >
                              {hybridSignal.signal}
                            </span>
                          </div>
                          <p className="text-sm text-base-content/80 mt-2 leading-relaxed">
                            {hybridSignal.rationale}
                          </p>
                        </div>

                        {/* Composite score metric */}
                        <div className="bg-base-300 px-5 py-3 rounded-xl border border-base-content/5 text-center min-w-36">
                          <p className="text-xs text-base-content/50 uppercase font-semibold">Composite Score</p>
                          <p
                            className={`text-2xl font-black ${
                              hybridSignal.composite_score > 0 ? 'text-emerald-400' : (hybridSignal.composite_score < 0 ? 'text-rose-400' : 'text-sky-400')
                            }`}
                          >
                            {hybridSignal.composite_score > 0 ? '+' : ''}
                            {hybridSignal.composite_score}
                          </p>
                          <p className="text-[10px] text-base-content/40 mt-1">65% Tech + 35% News</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Future Forecast Plot with 95% Confidence Cone */}
                {futurePlot && (
                  <div className="card bg-base-200 border border-base-content/10 shadow-md">
                    <div className="card-body p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-base-content flex items-center gap-2">
                          <MdShowChart className="text-cyan-400 text-lg" />
                          {daysAhead}-Day Future Price Projection & 95% Confidence Bounds
                        </h3>
                        <span className="badge badge-outline text-xs text-cyan-400">LSTM Recursive Rollout</span>
                      </div>
                      <img
                        src={futurePlot}
                        alt="Future Price Forecast"
                        className="w-full rounded-xl border border-base-content/10 invert"
                      />
                    </div>
                  </div>
                )}

                {/* Day-by-Day Forecast Projections Table */}
                {forecastData?.forecast_series && (
                  <div className="card bg-base-200 border border-base-content/10 shadow-md overflow-hidden">
                    <div className="card-body p-6">
                      <h3 className="font-bold text-base-content mb-4 flex items-center gap-2">
                        <BsShieldCheck className="text-emerald-400" />
                        Detailed Daily Target Bands
                      </h3>
                      <div className="overflow-x-auto max-h-60 overflow-y-auto">
                        <table className="table table-sm table-pin-rows">
                          <thead>
                            <tr className="text-base-content/60 text-xs uppercase">
                              <th>Trading Day</th>
                              <th>Date</th>
                              <th>Predicted Target</th>
                              <th>95% Lower Bound</th>
                              <th>95% Upper Bound</th>
                            </tr>
                          </thead>
                          <tbody>
                            {forecastData.forecast_series.map((item) => (
                              <tr key={item.day_index} className="hover:bg-base-300/40">
                                <td className="font-semibold">Day +{item.day_index}</td>
                                <td className="text-base-content/70">{item.date}</td>
                                <td className="font-bold text-cyan-400">{currSymbol}{item.predicted_price}</td>
                                <td className="text-rose-400/90 font-mono">{currSymbol}{item.lower_bound_95}</td>
                                <td className="text-emerald-400/90 font-mono">{currSymbol}{item.upper_bound_95}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* FinBERT Financial News Sentiment Section */}
                {sentimentData && (
                  <div className="card bg-base-200 border border-base-content/10 shadow-md">
                    <div className="card-body p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <h3 className="font-bold text-base-content flex items-center gap-2">
                          <MdArticle className="text-cyan-400 text-lg" />
                          FinBERT Market News Sentiment
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="badge badge-success badge-outline text-xs">
                            🟢 {sentimentData.breakdown?.positive || 0} Bullish
                          </span>
                          <span className="badge badge-ghost badge-outline text-xs">
                            ⚪ {sentimentData.breakdown?.neutral || 0} Neutral
                          </span>
                          <span className="badge badge-error badge-outline text-xs">
                            🔴 {sentimentData.breakdown?.negative || 0} Bearish
                          </span>
                        </div>
                      </div>

                      {sentimentData.articles && sentimentData.articles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {sentimentData.articles.map((art, idx) => (
                            <div
                              key={idx}
                              className="p-3 bg-base-300/70 rounded-xl border border-base-content/5 flex flex-col justify-between hover:border-cyan-400/30 transition-colors"
                            >
                              <div>
                                <div className="flex items-center justify-between gap-2 mb-1.5">
                                  <span className="text-[11px] text-base-content/40 font-medium">
                                    {art.publisher}
                                  </span>
                                  {getSentimentBadge(art.sentiment)}
                                </div>
                                <a
                                  href={art.link}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-sm font-semibold text-base-content hover:text-cyan-400 line-clamp-2 transition-colors flex items-start gap-1"
                                >
                                  {art.title}
                                  <HiOutlineExternalLink className="text-xs flex-shrink-0 mt-1 opacity-60" />
                                </a>
                              </div>
                              <div className="mt-2 text-[10px] text-base-content/40">
                                Confidence: {(art.confidence * 100).toFixed(1)}%
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-base-content/50 italic">No recent news articles found for this ticker.</p>
                      )}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* TAB 2: Historical Model DMA & Evaluation */}
            {activeTab === 'historical' && (
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    { src: histPlot, label: 'Historical Closing Price' },
                    { src: ma100, label: '100-Day Moving Average' },
                    { src: ma200, label: '200-Day Moving Average' },
                    { src: pred, label: 'Test Set: Predicted vs Actual' },
                  ].map(
                    ({ src, label }) =>
                      src && (
                        <div key={label} className="card bg-base-200 border border-base-content/10 overflow-hidden shadow-md">
                          <div className="px-4 pt-4 pb-2">
                            <p className="text-xs font-semibold text-base-content/50 uppercase tracking-wide">{label}</p>
                          </div>
                          <div className="px-4 pb-4">
                            <img src={src} alt={label} className="w-full rounded-lg invert" />
                          </div>
                        </div>
                      )
                  )}
                </div>

                {/* Model Evaluation Metrics */}
                {mse !== null && (
                  <div className="card bg-base-200 border border-base-content/10 shadow-md">
                    <div className="card-body p-6">
                      <h3 className="font-semibold text-base-content mb-4 flex items-center gap-2">
                        <MdShowChart className="text-cyan-400" />
                        Model Evaluation (Historical Test Data)
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                          { label: 'Mean Squared Error (MSE)', value: mse?.toFixed(4), color: 'text-yellow-400' },
                          { label: 'Root MSE (RMSE)', value: rmse?.toFixed(4), color: 'text-orange-400' },
                          { label: 'R² Score', value: r2?.toFixed(4), color: 'text-emerald-400' },
                        ].map(({ label, value, color }) => (
                          <div key={label} className="bg-base-300 rounded-xl p-4 text-center">
                            <p className={`text-2xl font-bold ${color}`}>{value}</p>
                            <p className="text-xs text-base-content/50 mt-1">{label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  )
}

export default Dashboard

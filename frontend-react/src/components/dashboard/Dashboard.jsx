import React, { useEffect, useState } from 'react'
import axiosInstance from '../../axiosinstancs'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { MdSearch, MdShowChart } from 'react-icons/md'
import { BsBuilding, BsGlobe } from 'react-icons/bs'

const Dashboard = () => {
  const [ticker, setTicker] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [plot, setPlot] = useState()
  const [ma100, setMA100] = useState()
  const [ma200, setMA200] = useState()
  const [pred, setPred] = useState()
  const [mse, setMse] = useState()
  const [rmse, setRMse] = useState()
  const [r2, setR2] = useState()
  const [company_data, setData] = useState()

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
    setData(null)
    setPred(null)
    try {
      const response = await axiosInstance.post('/predict/', { ticker })
      const backendRoot = import.meta.env.VITE_BACKEND_ROOT
      setPlot(`${backendRoot}${response.data.plot_img}`)
      setMA100(`${backendRoot}${response.data.plot_100_dma}`)
      setMA200(`${backendRoot}${response.data.plot_200_dma}`)
      setPred(`${backendRoot}${response.data.plot_prediction}`)
      setMse(response.data.mse)
      setRMse(response.data.rmse)
      setR2(response.data.r2)
      setData(response.data.company_data)
      if (response.data.error) setError(response.data.error)
    } catch {
      setError('Something went wrong. Please check the ticker and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen bg-base-100 px-4 py-10">
      <div className="max-w-4xl mx-auto">

        {/* Page title */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-base-content mb-2">
            Stock <span className="grad-text">Prediction</span> Dashboard
          </h1>
          <p className="text-base-content/50 text-sm">
            Enter any stock ticker to get an LSTM-powered price forecast.
          </p>
        </div>

        {/* Search form */}
        <form onSubmit={handleSubmit} className="flex gap-3 max-w-xl mx-auto mb-4">
          <label className="input flex-1 flex items-center gap-2 bg-base-200 border border-base-content/10 focus-within:border-cyan-400">
            <MdSearch className="text-base-content/40 text-lg flex-shrink-0" />
            <input
              type="text"
              className="grow bg-transparent outline-none text-base-content placeholder:text-base-content/30"
              placeholder="e.g. AAPL, TSLA, GOOG"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="btn text-white border-none hover:opacity-90 min-w-32 grad"
          >
            {loading
              ? <AiOutlineLoading3Quarters className="animate-spin text-lg" />
              : <><MdShowChart className="text-base" /> Predict</>
            }
          </button>
        </form>

        {error && (
          <div className="alert alert-error max-w-xl mx-auto mb-6 text-sm">
            <span>{error}</span>
          </div>
        )}

        {/* Company info */}
        {company_data && (
          <div className="card bg-base-200 border border-base-content/10 mb-8">
            <div className="card-body p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-base-content">{company_data.name}</h2>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="badge badge-outline text-cyan-400 border-cyan-400/40">
                      {company_data.symbol}
                    </span>
                    {company_data.sector && (
                      <span className="badge badge-outline text-base-content/50">
                        {company_data.sector}
                      </span>
                    )}
                    {company_data.industry && (
                      <span className="badge badge-outline text-base-content/50">
                        {company_data.industry}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-base-content/40 uppercase tracking-wide mb-1">Market Cap</p>
                  <p className="text-lg font-bold text-emerald-400">
                    {company_data.market_cap
                      ? `₹${(company_data.market_cap / 1e9).toFixed(2)}B`
                      : '—'}
                  </p>
                </div>
              </div>

              {company_data.website && (
                <a
                  href={company_data.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-sm mt-2 w-fit"
                >
                  <BsGlobe className="flex-shrink-0" />
                  {company_data.website}
                </a>
              )}

              {company_data.description && (
                <p className="text-sm text-base-content/50 leading-relaxed mt-4 max-h-32 overflow-y-auto">
                  {company_data.description}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Charts */}
        {pred && (
          <div className="flex flex-col gap-6">

            {/* Chart grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { src: plot, label: 'Closing Price' },
                { src: ma100, label: '100-Day Moving Average' },
                { src: ma200, label: '200-Day Moving Average' },
                { src: pred, label: 'Predicted vs Actual' },
              ].map(({ src, label }) => src && (
                <div key={label} className="card bg-base-200 border border-base-content/10 overflow-hidden">
                  <div className="px-4 pt-4 pb-2">
                    <p className="text-xs font-semibold text-base-content/50 uppercase tracking-wide">{label}</p>
                  </div>
                  <div className="px-4 pb-4">
                    <img
                      src={src}
                      alt={label}
                      className="w-full rounded-lg invert"
                      style={{ maxWidth: '100%' }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Metrics */}
            <div className="card bg-base-200 border border-base-content/10">
              <div className="card-body p-6">
                <h3 className="font-semibold text-base-content mb-4 flex items-center gap-2">
                  <MdShowChart className="text-cyan-400" />
                  Model Evaluation
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

          </div>
        )}

      </div>
    </div>
  )
}

export default Dashboard

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axiosInstance from '../axiosinstancs'
import { RiStockLine } from 'react-icons/ri'
import { MdTrendingUp, MdBarChart, MdInsights, MdSecurity } from 'react-icons/md'
import { FaGlobe, FaIndianRupeeSign } from 'react-icons/fa6'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { BsGraphUpArrow } from 'react-icons/bs'

const features = [
  {
    icon: <MdInsights className="text-3xl text-cyan-400" />,
    title: 'LSTM Predictions',
    desc: 'Deep learning model trained on 10 years of historical data for accurate price forecasting.',
  },
  {
    icon: <MdBarChart className="text-3xl text-indigo-400" />,
    title: 'Moving Averages',
    desc: '100-day and 200-day moving average charts generated instantly for any ticker.',
  },
  {
    icon: <MdTrendingUp className="text-3xl text-emerald-400" />,
    title: 'Model Metrics',
    desc: 'MSE, RMSE and R² scores so you can evaluate prediction confidence at a glance.',
  },
  {
    icon: <MdSecurity className="text-3xl text-violet-400" />,
    title: 'Secure Access',
    desc: 'JWT authentication with silent token refresh keeps your session safe.',
  },
]

const stats = [
  { value: '10+', label: 'Years of Data' },
  { value: 'LSTM', label: 'Deep Learning' },
  { value: 'MSE / R²', label: 'Model Metrics' },
  { value: '200+', label: 'Stocks Supported' },
]

const Main = () => {
  const [topstock, setTopStock] = useState([])
  const [indtopstock, setIndTopStock] = useState([])
  const [number, setNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [fetched, setFetched] = useState(false)

  const fetchtopStock = async (e) => {
    e.preventDefault()
    if (!number) { setError('Please enter a number'); return }
    try {
      setLoading(true)
      setError(null)
      const res = await axiosInstance.get('/top-stocks/', { params: { number } })
      setTopStock(res.data.top100_worldwide)
      setIndTopStock(res.data.Indiatop20)
      setFetched(true)
    } catch {
      setError('Failed to load — server error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full bg-base-100">

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="w-full py-24 px-4 text-center bg-base-100 overflow-hidden relative">
        {/* decorative blobs — clipped inside section */}
        <div
          className="pointer-events-none absolute rounded-full"
          style={{
            width: 500, height: 500,
            background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)',
            top: -100, left: -150,
          }}
        />
        <div
          className="pointer-events-none absolute rounded-full"
          style={{
            width: 400, height: 400,
            background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
            bottom: -100, right: -100,
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-400/30 text-cyan-400 text-sm font-medium mb-8">
            <RiStockLine className="text-base" />
            AI-Powered Stock Analysis
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-base-content leading-tight mb-6">
            Predict Stocks with{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #06b6d4, #6366f1)' }}
            >
              Machine Learning
            </span>
          </h1>

          <p className="text-base-content/60 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            StockForecast uses LSTM neural networks to analyse 10 years of market data
            and deliver accurate price predictions — for any stock, anywhere in the world.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/dashboard"
              className="btn btn-lg gap-2 text-white border-none shadow-lg hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #06b6d4, #6366f1)' }}
            >
              <BsGraphUpArrow />
              Start Predicting
            </Link>
            <a
              href="#top-stocks"
              className="btn btn-lg btn-outline border-base-content/20 text-base-content hover:border-cyan-400 hover:text-cyan-400 hover:bg-transparent"
            >
              View Live Stocks
            </a>
          </div>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────── */}
      <section className="w-full border-y border-base-content/10 bg-base-200">
        <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-bold text-cyan-400">{s.value}</p>
              <p className="text-sm text-base-content/50 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────── */}
      <section className="w-full py-20 px-4 bg-base-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-base-content mb-2">
            Everything you need
          </h2>
          <p className="text-center text-base-content/50 mb-12 text-sm">
            Powerful tools wrapped in a clean, fast interface.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="card bg-base-200 border border-base-content/10 hover:border-cyan-400/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="card-body gap-3 p-5">
                  <div className="w-12 h-12 rounded-xl bg-base-300 flex items-center justify-center">
                    {f.icon}
                  </div>
                  <h3 className="font-semibold text-base-content text-sm">{f.title}</h3>
                  <p className="text-xs text-base-content/50 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Top Stocks ───────────────────────────────── */}
      <section id="top-stocks" className="w-full py-20 px-4 bg-base-200">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-base-content mb-2">
            Live Active Stocks
          </h2>
          <p className="text-center text-base-content/50 mb-10 text-sm">
            Fetch the most traded stocks right now — globally and in India.
          </p>

          {/* Form */}
          <form
            onSubmit={fetchtopStock}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-12"
          >
            <input
              type="number"
              min="1"
              max="200"
              className="input input-bordered flex-1 bg-base-100 focus:border-cyan-400 focus:outline-none"
              placeholder="How many stocks? (max 200)"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="btn text-white border-none hover:opacity-90 min-w-24"
              style={{ background: 'linear-gradient(135deg, #06b6d4, #6366f1)' }}
            >
              {loading
                ? <AiOutlineLoading3Quarters className="animate-spin text-lg" />
                : 'Fetch'}
            </button>
          </form>

          {error && (
            <div className="alert alert-error max-w-md mx-auto mb-8 text-sm">
              <span>{error}</span>
            </div>
          )}

          {/* Tables */}
          {fetched && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Global */}
              <div className="card bg-base-100 border border-base-content/10 shadow-md overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-4 border-b border-base-content/10 bg-base-200">
                  <FaGlobe className="text-cyan-400" />
                  <h3 className="font-semibold text-base-content text-sm">
                    Top {number} — Global
                  </h3>
                </div>
                <div className="overflow-y-auto max-h-80">
                  <table className="table table-zebra table-sm w-full">
                    <thead className="sticky top-0 bg-base-200 z-10">
                      <tr className="text-base-content/50 text-xs uppercase">
                        <th>#</th>
                        <th>Symbol</th>
                        <th>Price</th>
                        <th>Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topstock.map((s, i) => (
                        <tr key={i} className="hover">
                          <td className="text-base-content/30 text-xs w-8">{i + 1}</td>
                          <td>
                            <div className="font-semibold text-cyan-400 text-xs">{s.symbol}</div>
                            <div className="text-xs text-base-content/40 truncate max-w-[120px]">{s.name}</div>
                          </td>
                          <td className="text-xs font-medium">${s.price}</td>
                          <td>
                            <span className={`badge badge-xs ${s.change_percent >= 0 ? 'badge-success' : 'badge-error'}`}>
                              {s.change_percent >= 0 ? '+' : ''}{s.change_percent?.toFixed(2)}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* India */}
              <div className="card bg-base-100 border border-base-content/10 shadow-md overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-4 border-b border-base-content/10 bg-base-200">
                  <FaIndianRupeeSign className="text-indigo-400" />
                  <h3 className="font-semibold text-base-content text-sm">
                    Top {number} — India
                  </h3>
                </div>
                <div className="overflow-y-auto max-h-80">
                  <table className="table table-zebra table-sm w-full">
                    <thead className="sticky top-0 bg-base-200 z-10">
                      <tr className="text-base-content/50 text-xs uppercase">
                        <th>#</th>
                        <th>Symbol</th>
                        <th>Price</th>
                        <th>Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      {indtopstock.map((s, i) => (
                        <tr key={i} className="hover">
                          <td className="text-base-content/30 text-xs w-8">{i + 1}</td>
                          <td>
                            <div className="font-semibold text-indigo-400 text-xs">{s.symbol}</div>
                            <div className="text-xs text-base-content/40 truncate max-w-[120px]">{s.name}</div>
                          </td>
                          <td className="text-xs font-medium">₹{s.price}</td>
                          <td>
                            <span className={`badge badge-xs ${s.change_percent >= 0 ? 'badge-success' : 'badge-error'}`}>
                              {s.change_percent >= 0 ? '+' : ''}{s.change_percent?.toFixed(2)}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      <section className="w-full py-20 px-4 bg-base-100 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-base-content mb-4">
            Ready to forecast your next trade?
          </h2>
          <p className="text-base-content/50 mb-8 text-sm">
            Sign up for free and run your first prediction in under a minute.
          </p>
          <Link
            to="/register"
            className="btn btn-lg text-white border-none hover:opacity-90 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #06b6d4, #6366f1)' }}
          >
            Get Started — It's Free
          </Link>
        </div>
      </section>

    </div>
  )
}

export default Main

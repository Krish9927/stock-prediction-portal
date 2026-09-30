import React from 'react'
import { Link } from 'react-router-dom'
import { RiStockLine } from 'react-icons/ri'
import { MdEmail, MdPhone } from 'react-icons/md'
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="w-full bg-base-200 border-t border-base-content/10">
      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-base"
              style={{ background: 'linear-gradient(135deg, #06b6d4, #6366f1)' }}
            >
              <RiStockLine />
            </div>
            <span className="text-base font-bold">
              Stock<span className="text-cyan-400">Forecast</span>
            </span>
          </div>
          <p className="text-sm text-base-content/50 leading-relaxed max-w-xs">
            AI-powered stock analysis and prediction platform. Built with LSTM
            deep learning for smarter investment decisions.
          </p>
          <div className="flex gap-4 mt-5">
            {[FaGithub, FaLinkedin, FaTwitter].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="text-base-content/40 hover:text-cyan-400 transition-colors text-xl"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* Features */}
        <div>
          <h3 className="font-semibold text-base-content mb-4 text-sm uppercase tracking-wide">
            Features
          </h3>
          <ul className="space-y-2 text-sm text-base-content/50">
            {[
              'Stock Prediction',
              '100 / 200 Day Moving Averages',
              'Model Evaluation Metrics',
              'Live Active Stocks Feed',
              'Global & India Markets',
            ].map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold text-base-content mb-4 text-sm uppercase tracking-wide">
            Contact
          </h3>
          <ul className="space-y-3 text-sm text-base-content/50">
            <li className="flex items-center gap-2">
              <MdEmail className="text-cyan-400 flex-shrink-0" />
              Krishna9927@gmail.com
            </li>
            <li className="flex items-center gap-2">
              <MdPhone className="text-cyan-400 flex-shrink-0" />
              +91 9927202281
            </li>
          </ul>
          <div className="flex gap-3 mt-6">
            <Link
              to="/login"
              className="btn btn-sm btn-ghost border border-base-content/20 hover:border-cyan-400 hover:text-cyan-400 hover:bg-transparent"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="btn btn-sm text-white border-none hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #06b6d4, #6366f1)' }}
            >
              Register
            </Link>
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="border-t border-base-content/10 py-5 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-base-content/30">
          <p>© 2025 StockForecast. All rights reserved.</p>
          <p>Analysing market trends for accurate, reliable stock forecasts.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

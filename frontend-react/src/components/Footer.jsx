import React from 'react'
import logoimg from '../assets/images/logo1.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAddressBook, faPhone, faPhoneAlt, faPodcast } from '@fortawesome/free-solid-svg-icons'

const Footer = () => {
  return (
    <>
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-10">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand */}
          <div>
             <img src={logoimg} className='h-20 w-auto object-contain' alt="" srcset="" />
            <h2 className="text-2xl font-bold text-white">StockForecast</h2>
            <p className="mt-3 text-sm text-gray-400">
              AI-powered stock analysis & prediction platform for smarter
              investment decisions.
            </p>
          </div>
          
          {/* Contact */}
          <div>
            <div className="flex flex-col md:flex-row gap-0">
            <FontAwesomeIcon icon={faAddressBook}   />
            <h3 className="text-lg font-semibold text-white mb-3">Contact</h3>
            </div>
            <p className="text-sm">Email: Krishna9927@gmail.com</p>
            <p className="text-sm mt-1">Phone: +91 9927202281</p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Features</h3>
            <ul className="space-y-2 text-sm">
              <li>Stock Prediction</li>
              <li>Graphical Representation</li>
              <li>Evaluating Errors Model</li>
              <li>News Stock</li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-6"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
          <p>
           StockForecast. All rights reserved.</p>
          <p className="mt-2 md:mt-0">
            &copy;2025-StockForecast analyzes market trends to deliver accurate, reliable stock forecasts
          </p>
        </div>
      </div>
    </footer>
    </>
  )
}

export default Footer
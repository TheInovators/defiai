import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Menu, X } from 'lucide-react';

const Header = ({
  walletConnected,
  account,
  connectWallet,
  disconnectWallet,
  tickerItems,
  tickerError,
  handleStartTrading,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header>
      <div className="bg-gray-900 text-white py-2 overflow-hidden">
        <div className="animate-scroll flex space-x-8 whitespace-nowrap">
          {tickerItems.length > 0 ? (
            tickerItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 cursor-pointer hover:text-green-400 transition-colors"
                onClick={handleStartTrading}
              >
                <span className="font-medium">{item.symbol.toUpperCase()}</span>
                <span className="text-gray-300">
                  ${item.current_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className={`flex items-center space-x-1 ${item.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {item.price_change_percentage_24h >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  <span>{Math.abs(item.price_change_percentage_24h).toFixed(2)}%</span>
                </span>
              </div>
            ))
          ) : (
            <div className="text-gray-400">{tickerError || 'Loading market data...'}</div>
          )}
        </div>
      </div>
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg"></div>
              <h1 className="text-xl font-bold text-gray-900">DeFiAI</h1>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">How It Works</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">Testimonials</a>
              <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">About</a>
            </div>
            <div className="flex items-center space-x-4">
              {walletConnected ? (
                <div className="flex items-center space-x-3">
                  <div className="hidden sm:block text-sm text-gray-600">
                    {account.substring(0, 6)}...{account.substring(38)}
                  </div>
                  <button
                    onClick={disconnectWallet}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
                >
                  Connect Wallet
                </button>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-2 space-y-2">
              <a href="#features" className="block py-2 text-gray-600">Features</a>
              <a href="#how-it-works" className="block py-2 text-gray-600">How It Works</a>
              <a href="#testimonials" className="block py-2 text-gray-600">Testimonials</a>
              <a href="#about" className="block py-2 text-gray-600">About</a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
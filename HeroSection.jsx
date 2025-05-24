import React from 'react';
import { Zap, ExternalLink } from 'lucide-react';

const HeroSection = ({ handleStartTrading }) => {
  return (
    <section className="bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          The Future of
          <span className="block bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
            AI-Powered Trading on BSC
          </span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-100 max-w-3xl mx-auto">
          Let our intelligent algorithms manage your crypto portfolio on BNB Smart Chain with precision and adapt to market conditions in real-time.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleStartTrading}
            className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
          >
            <span>Start Trading</span>
            <Zap size={20} />
          </button>
          <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors flex items-center justify-center space-x-2">
            <span>Watch Demo</span>
            <ExternalLink size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
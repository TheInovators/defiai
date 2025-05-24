import React from 'react';

const CtaSection = ({ handleStartTrading }) => {
  return (
    <section className="py-20 bg-gradient-to-r from-green-500 to-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Revolutionize Your Trading?
        </h2>
        <p className="text-xl mb-8 text-gray-100">
          Join over 32,000 users already leveraging AI for their crypto investments on BNB Smart Chain.
        </p>
        <button
          onClick={handleStartTrading}
          className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg"
        >
          Start Trading Now
        </button>
      </div>
    </section>
  );
};

export default CtaSection;
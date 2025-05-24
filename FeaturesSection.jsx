import React from 'react';
import { Play } from 'lucide-react';

const FeaturesSection = ({ features, setSelectedFeature, setIsFeatureModalOpen }) => {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Powerful AI Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform combines advanced AI algorithms with BSC DeFi protocols to maximize your returns while minimizing risk.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-green-500 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <button
                onClick={() => {
                  setSelectedFeature(feature);
                  setIsFeatureModalOpen(true);
                }}
                className="flex items-center space-x-2 text-green-500 hover:text-green-600"
              >
                <Play size={16} />
                <span>Try It Now</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
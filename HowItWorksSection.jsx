import React from 'react';
import { Shield, Target, DollarSign, Brain } from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      number: '1',
      title: 'Connect Your Wallet',
      description: 'Link your Web3 wallet to our platform securely. We support MetaMask, WalletConnect, and more on BSC.',
      icon: <Shield size={24} />,
    },
    {
      number: '2',
      title: 'Set Your Strategy',
      description: 'Choose from pre-built AI strategies or customize your own based on your risk tolerance.',
      icon: <Target size={24} />,
    },
    {
      number: '3',
      title: 'Deposit Funds',
      description: 'Deposit your crypto assets into our BSC smart contracts. Your funds remain under your control.',
      icon: <DollarSign size={24} />,
    },
    {
      number: '4',
      title: 'Let AI Work',
      description: 'Our AI algorithms continuously monitor BSC markets and execute trades for optimal returns.',
      icon: <Brain size={24} />,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600">
            Get started with DeFiAI on BNB Smart Chain in just a few simple steps
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  {step.number}
                </div>
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-green-500">
                  {step.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
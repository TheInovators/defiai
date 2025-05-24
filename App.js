import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import StatsSection from './components/StatsSection';
import FeaturesSection from './components/FeaturesSection';
import CtaSection from './components/CtaSection';
import HowItWorksSection from './components/HowItWorksSection';
import TestimonialsSection from './components/TestimonialsSection';
import AboutSection from './components/AboutSection';
import Footer from './components/Footer';
import StockAnalyzer from './components/StockAnalyzer';
import FeatureModal from './components/FeatureModal';
import ErrorToast from './components/ErrorToast';
import './App.css';
import { Brain, Target, MessageSquare, Lock, BarChart2, Leaf } from 'lucide-react';

// BNB Smart Chain network configuration
const BSC_MAINNET = {
  chainId: '0x38', // Chain ID 56 in hex
  chainName: 'BNB Smart Chain',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
  rpcUrls: ['https://bsc-dataseed.binance.org/'],
  blockExplorerUrls: ['https://bscscan.com'],
};

function App() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [networkId, setNetworkId] = useState(null);
  const [connectionError, setConnectionError] = useState('');
  const [provider, setProvider] = useState(null);
  const [tickerItems, setTickerItems] = useState([]);
  const [tickerError, setTickerError] = useState('');
  const [isAnalyzerOpen, setIsAnalyzerOpen] = useState(false);
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);

  useEffect(() => {
    const fetchTickerData = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=binancecoin,pancakeswap-token,chainlink,cardano,ripple,polkadot,busd,weth&order=market_cap_desc&per_page=8&page=1&sparkline=false&price_change_percentage=24h'
        );
        if (!response.ok) throw new Error('Failed to fetch market data');
        const data = await response.json();
        setTickerItems(data);
        setTickerError('');
      } catch (error) {
        console.error('Error fetching ticker data:', error);
        setTickerError('Failed to load market data.');
        setTickerItems([
          { id: 'binancecoin', symbol: 'bnb', name: 'BNB', current_price: 623.45, price_change_percentage_24h: 1.5, market_cap: 90000000000, total_volume: 2000000000 },
          { id: 'pancakeswap-token', symbol: 'cake', name: 'PancakeSwap', current_price: 2.50, price_change_percentage_24h: 2.3, market_cap: 6000000000, total_volume: 300000000 },
          { id: 'chainlink', symbol: 'link', name: 'Chainlink', current_price: 15.23, price_change_percentage_24h: 0.8, market_cap: 15000000000, total_volume: 1000000000 },
          { id: 'cardano', symbol: 'ada', name: 'Cardano', current_price: 0.45, price_change_percentage_24h: -0.3, market_cap: 16000000000, total_volume: 800000000 },
          { id: 'ripple', symbol: 'xrp', name: 'XRP', current_price: 0.52, price_change_percentage_24h: 0.4, market_cap: 28000000000, total_volume: 1200000000 },
          { id: 'polkadot', symbol: 'dot', name: 'Polkadot', current_price: 7.12, price_change_percentage_24h: 1.2, market_cap: 10000000000, total_volume: 500000000 },
          { id: 'busd', symbol: 'busd', name: 'BUSD', current_price: 1.00, price_change_percentage_24h: 0.0, market_cap: 7000000000, total_volume: 4000000000 },
          { id: 'weth', symbol: 'weth', name: 'Wrapped BNB', current_price: 600.00, price_change_percentage_24h: 1.4, market_cap: 5000000000, total_volume: 1000000000 },
        ]);
      }
    };

    fetchTickerData();
    const interval = setInterval(fetchTickerData, 60000);
    return () => clearInterval(interval);
  }, []);

  const connectWallet = async () => {
    setConnectionError('');
    if (!window.ethereum) {
      setConnectionError('MetaMask or a compatible wallet not detected. Please install it.');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      const currentChainId = Number(network.chainId);

      if (currentChainId !== 56) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: BSC_MAINNET.chainId }],
          });
        } catch (switchError) {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [BSC_MAINNET],
            });
          } else {
            throw switchError;
          }
        }
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      setWalletConnected(true);
      setProvider(provider);
      setNetworkId(56);
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    } catch (error) {
      setConnectionError(error.code === 4001 ? 'Wallet connection rejected.' : `Error: ${error.message}`);
      setWalletConnected(false);
      setAccount('');
      setNetworkId(null);
      setProvider(null);
    }
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
    setAccount('');
    setNetworkId(null);
    setConnectionError('');
    setProvider(null);
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      setAccount(accounts[0]);
    }
  };

  const handleChainChanged = (chainId) => {
    const newChainId = parseInt(chainId, 16);
    if (newChainId !== 56) {
      setConnectionError('Please switch to BNB Smart Chain');
      disconnectWallet();
    } else {
      setNetworkId(newChainId);
    }
  };

  useEffect(() => {
    const checkInitialConnection = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          const network = await provider.getNetwork();
          if (accounts.length > 0 && Number(network.chainId) === 56) {
            setAccount(accounts[0]);
            setWalletConnected(true);
            setProvider(provider);
            setNetworkId(56);
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      }
    };
    checkInitialConnection();
  }, []);

  const handleStartTrading = () => {
    if (walletConnected && networkId === 56) {
      setIsAnalyzerOpen(true);
    } else {
      connectWallet();
    }
  };

  const features = [
    {
      icon: <Brain size={32} />,
      title: 'AI Smart Trading Bots',
      description: 'Our reinforcement learning algorithms continuously adapt to market conditions on BNB Smart Chain, recognizing patterns and making trades with precision timing.',
      action: () => setIsFeatureModalOpen(true),
    },
    {
      icon: <Target size={32} />,
      title: 'AI Investment Advisor',
      description: 'Get personalized portfolio recommendations based on your risk tolerance, investment goals, and BSC market conditions - all powered by neural networks.',
      action: () => setIsFeatureModalOpen(true),
    },
    {
      icon: <MessageSquare size={32} />,
      title: 'Real-time Sentiment Analytics',
      description: 'Our NLP models analyze thousands of social media posts, news articles, and forums to gauge market sentiment and predict price movements.',
      action: () => setIsFeatureModalOpen(true),
    },
    {
      icon: <Lock size={32} />,
      title: 'Advanced Security',
      description: 'Institutional-grade security with multi-signature wallets, encrypted communications, and AI-powered fraud detection systems on BSC.',
      action: () => setIsFeatureModalOpen(true),
    },
    {
      icon: <BarChart2 size={32} />,
      title: 'Predictive Analytics',
      description: 'Our proprietary ML models analyze historical data and BSC market indicators to forecast potential price movements with high accuracy.',
      action: () => setIsFeatureModalOpen(true),
    },
    {
      icon: <Leaf size={32} />,
      title: 'Automated Yield Farming',
      description: 'Our algorithm automatically allocates assets to the highest-yielding BSC DeFi protocols like PancakeSwap and Venus while managing risk and gas costs.',
      action: () => setIsFeatureModalOpen(true),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        walletConnected={walletConnected}
        account={account}
        connectWallet={connectWallet}
        disconnectWallet={disconnectWallet}
        tickerItems={tickerItems}
        tickerError={tickerError}
        handleStartTrading={handleStartTrading}
      />
      <main>
        <HeroSection handleStartTrading={handleStartTrading} />
        <StatsSection />
        <FeaturesSection
          features={features}
          setSelectedFeature={setSelectedFeature}
          setIsFeatureModalOpen={setIsFeatureModalOpen}
        />
        <CtaSection handleStartTrading={handleStartTrading} />
        <HowItWorksSection />
        <TestimonialsSection />
        <AboutSection />
      </main>
      <Footer />
      <StockAnalyzer
        isOpen={isAnalyzerOpen}
        onClose={() => setIsAnalyzerOpen(false)}
        availableCoins={tickerItems}
        account={account}
        provider={provider}
      />
      <FeatureModal
        isOpen={isFeatureModalOpen}
        onClose={() => {
          setIsFeatureModalOpen(false);
          setSelectedFeature(null);
        }}
        feature={selectedFeature || {}}
        availableCoins={tickerItems}
        account={account}
        provider={provider}
      />
      <ErrorToast connectionError={connectionError} />
    </div>
  );
}

export default App;
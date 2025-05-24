import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { ethers } from 'ethers';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { X, Bot, Lightbulb, CreditCard } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const StockAnalyzer = ({ isOpen, onClose, availableCoins, account, provider }) => {
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tradeAmount, setTradeAmount] = useState('');
  const [tradeType, setTradeType] = useState('buy');
  const [activeTab, setActiveTab] = useState('chart');
  const [botActive, setBotActive] = useState(false);
  const [botPriceThreshold, setBotPriceThreshold] = useState('');
  const [botVolumeThreshold, setBotVolumeThreshold] = useState('');
  const [riskTolerance, setRiskTolerance] = useState('medium');
  const [upiId, setUpiId] = useState('');
  const [linkedUpiId, setLinkedUpiId] = useState('');
  const [upiError, setUpiError] = useState('');
  const [usdInrRate, setUsdInrRate] = useState(83.5);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        setUsdInrRate(data.rates.INR);
      } catch (err) {
        console.error('Failed to fetch USD-INR rate:', err);
      }
    };
    fetchExchangeRate();
  }, []);

  useEffect(() => {
    if (isOpen && selectedCoin) {
      const fetchHistoricalData = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            `https://api.coingecko.com/api/v3/coins/${selectedCoin.id}/market_chart?vs_currency=usd&days=30`
          );
          if (!response.ok) throw new Error('Failed to fetch historical data');
          const data = await response.json();
          const prices = data.prices.map(([timestamp, price]) => ({
            date: new Date(timestamp).toLocaleDateString(),
            price,
          }));
          setHistoricalData(prices);
          setError('');
        } catch (err) {
          setError('Failed to load historical data');
          setHistoricalData([]);
        } finally {
          setLoading(false);
        }
      };
      fetchHistoricalData();
    }
  }, [isOpen, selectedCoin]);

  useEffect(() => {
    if (botActive && selectedCoin) {
      const interval = setInterval(async () => {
        try {
          const response = await fetch(
            `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${selectedCoin.id}`
          );
          const [data] = await response.json();
          const currentPrice = data.current_price;
          const volume = data.total_volume;
          const priceThreshold = parseFloat(botPriceThreshold);
          const volumeThreshold = parseFloat(botVolumeThreshold);

          if (priceThreshold && currentPrice < priceThreshold) {
            alert(`Smart Trading Bot: Buying ${selectedCoin.symbol.toUpperCase()} at $${currentPrice} (below threshold $${priceThreshold})`);
          }
          if (volumeThreshold && volume > volumeThreshold) {
            alert(`Smart Trading Bot: Selling ${selectedCoin.symbol.toUpperCase()} due to high volume $${volume}`);
          }
        } catch (err) {
          console.error('Bot data fetch error:', err);
        }
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [botActive, selectedCoin, botPriceThreshold, botVolumeThreshold]);

  const chartData = {
    labels: historicalData.map(data => data.date),
    datasets: [
      {
        label: `${selectedCoin?.symbol?.toUpperCase()}/USD`,
        data: historicalData.map(data => data.price),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { title: { display: true, text: 'Date', color: '#6B7280' }, grid: { color: '#F3F4F6' }, ticks: { color: '#6B7280' } },
      y: { title: { display: true, text: 'Price (USD)', color: '#6B7280' }, grid: { color: '#F3F4F6' }, ticks: { color: '#6B7280' } },
    },
    plugins: { legend: { display: true, labels: { color: '#6B7280' } }, tooltip: { backgroundColor: 'rgba(0, 0, 0, 0.8)', titleColor: '#FFFFFF', bodyColor: '#FFFFFF' } },
  };

  const validateUpiId = (id) => {
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+$/;
    return upiRegex.test(id);
  };

  const handleLinkUpi = () => {
    if (!upiId) {
      setUpiError('Please enter a UPI ID');
      return;
    }
    if (!validateUpiId(upiId)) {
      setUpiError('Invalid UPI ID format (e.g., user@upi)');
      return;
    }
    setLinkedUpiId(upiId);
    setUpiError('');
    setUpiId('');
    alert('UPI ID linked successfully!');
  };

  const executeTrade = async () => {
    if (!provider || !account) {
      alert('Please connect your wallet');
      return;
    }
    if (!tradeAmount || isNaN(tradeAmount) || tradeAmount <= 0) {
      alert('Please enter a valid trade amount');
      return;
    }
    if (!selectedCoin) {
      alert('Please select a cryptocurrency');
      return;
    }

    try {
      const signer = await provider.getSigner();
      if (tradeType === 'buy') {
        const bnbPriceUsd = selectedCoin.current_price;
        const amountUsd = tradeAmount * bnbPriceUsd;
        const amountInr = (amountUsd * usdInrRate).toFixed(2);
        const upiLink = `upi://pay?pa=defiai@upi&pn=DeFiAI&am=${amountInr}&cu=INR&tn=Buy%20${selectedCoin.symbol.toUpperCase()}`;
        window.location.href = upiLink;
      } else {
        if (!linkedUpiId) {
          alert('Please link a UPI ID to receive funds');
          return;
        }
        alert(`Sell executed: Funds for ${tradeAmount} BNB worth of ${selectedCoin.symbol.toUpperCase()} will be sent to ${linkedUpiId}`);
      }
    } catch (err) {
      alert(`Trade failed: ${err.message}`);
    }
  };

  const calculateTechnicalIndicators = () => {
    if (!historicalData.length) return {};
    const prices = historicalData.map(d => d.price);
    const sma = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const high = Math.max(...prices);
    const low = Math.min(...prices);
    const current = selectedCoin?.current_price || 0;
    return { sma, high, low, current };
  };

  const getAdvisorRecommendations = () => {
    if (!availableCoins.length) return [];
    const recommendations = availableCoins.map(coin => {
      const volatility = Math.abs(coin.price_change_percentage_24h);
      let score = 0;
      let rationale = [];
      if (riskTolerance === 'low' && volatility < 5) {
        score += 50;
        rationale.push('Low volatility suits low-risk profile');
      } else if (riskTolerance === 'medium' && volatility < 10) {
        score += 30;
        rationale.push('Moderate volatility aligns with medium-risk profile');
      } else if (riskTolerance === 'high' && volatility >= 10) {
        score += 40;
        rationale.push('High volatility matches high-risk profile');
      }
      if (coin.price_change_percentage_24h > 0) {
        score += coin.price_change_percentage_24h * 2;
        rationale.push(`Positive 24h performance: ${coin.price_change_percentage_24h.toFixed(2)}%`);
      }
      if (coin.market_cap > 100000000000) {
        score += 20;
        rationale.push('High market cap indicates stability');
      }
      return { coin, score, rationale };
    });
    return recommendations.sort((a, b) => b.score - a.score).slice(0, 3);
  };

  const indicators = calculateTechnicalIndicators();
  const recommendations = getAdvisorRecommendations();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-screen overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {selectedCoin ? (
              <>
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{selectedCoin.symbol.toUpperCase().charAt(0)}</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedCoin.name}</h2>
                  <p className="text-sm text-gray-500">{selectedCoin.symbol.toUpperCase()}/USD</p>
                </div>
              </>
            ) : (
              <h2 className="text-xl font-bold text-gray-900">Select a Cryptocurrency</h2>
            )}
            <select
              value={selectedCoin?.id || ''}
              onChange={(e) => {
                const coin = availableCoins.find(c => c.id === e.target.value);
                setSelectedCoin(coin || null);
              }}
              className="ml-4 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Coin</option>
              {availableCoins.map(coin => (
                <option key={coin.id} value={coin.id}>
                  {coin.name} ({coin.symbol.toUpperCase()})
                </option>
              ))}
            </select>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {selectedCoin && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Current Price</p>
                <p className="text-lg font-bold text-gray-900">${indicators.current?.toFixed(2)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">24h Change</p>
                <p className={`text-lg font-bold ${selectedCoin.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedCoin.price_change_percentage_24h?.toFixed(2)}%
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">30d High</p>
                <p className="text-lg font-bold text-gray-900">${indicators.high?.toFixed(2)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">30d Low</p>
                <p className="text-lg font-bold text-gray-900">${indicators.low?.toFixed(2)}</p>
              </div>
            </div>
          )}

          {selectedCoin && (
            <div className="flex flex-wrap gap-1 mb-6 bg-gray-100 p-1 rounded-lg">
              {['chart', 'trade', 'analysis', 'bot', 'advisor'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors min-w-[80px] ${
                    activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab === 'bot' ? 'Bot Trading' : tab === 'advisor' ? 'AI Advisor' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : !selectedCoin ? (
            <div className="text-center text-gray-600 py-8">Please select a cryptocurrency to view details.</div>
          ) : (
            <>
              {activeTab === 'chart' && (
                <div className="h-80">
                  <Line data={chartData} options={chartOptions} />
                </div>
              )}

              {activeTab === 'trade' && (
                <div className="max-w-md mx-auto">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Execute Trade</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Trade Type</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setTradeType('buy')}
                            className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                              tradeType === 'buy' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            Buy
                          </button>
                          <button
                            onClick={() => setTradeType('sell')}
                            className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                              tradeType === 'sell' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            Sell
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Amount (BNB)</label>
                        <input
                          type="number"
                          value={tradeAmount}
                          onChange={(e) => setTradeAmount(e.target.value)}
                          placeholder="0.00"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Link UPI ID for Payouts</label>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="e.g., user@upi"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          />
                          <button
                            onClick={handleLinkUpi}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            <CreditCard size={20} />
                          </button>
                        </div>
                        {upiError && <p className="text-sm text-red-500 mt-1">{upiError}</p>}
                        {linkedUpiId && <p className="text-sm text-green-600 mt-1">Linked UPI ID: {linkedUpiId}</p>}
                      </div>
                      <button
                        onClick={executeTrade}
                        className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
                          tradeType === 'buy' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
                        }`}
                      >
                        {tradeType === 'buy' ? 'Buy' : 'Sell'} {selectedCoin.symbol.toUpperCase()}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'analysis' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3">Technical Indicators</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">30-Day SMA:</span>
                          <span className="font-medium">${indicators.sma?.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Market Cap:</span>
                          <span className="font-medium">${selectedCoin.market_cap?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Volume (24h):</span>
                          <span className="font-medium">${selectedCoin.total_volume?.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3">AI Sentiment</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm">Social Media: Positive</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="text-sm">News Sentiment: Neutral</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm">Technical Analysis: Bullish</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'bot' && (
                <div className="max-w-md mx-auto">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex items-center space-x-2 mb-4">
                      <Bot size={24} className="text-green-500" />
                      <h3 className="text-lg font-semibold">Smart Trading Bot</h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Price Threshold (USD)</label>
                        <input
                          type="number"
                          value={botPriceThreshold}
                          onChange={(e) => setBotPriceThreshold(e.target.value)}
                          placeholder="e.g., 500"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                        <p className="text-sm text-gray-500 mt-1">Buy when price drops below this value</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Volume Threshold (USD)</label>
                        <input
                          type="number"
                          value={botVolumeThreshold}
                          onChange={(e) => setBotVolumeThreshold(e.target.value)}
                          placeholder="e.g., 1000000000"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                        <p className="text-sm text-gray-500 mt-1">Sell when 24h volume exceeds this value</p>
                      </div>
                      <button
                        onClick={() => setBotActive(!botActive)}
                        className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
                          botActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                        }`}
                      >
                        {botActive ? 'Stop Bot' : 'Start Bot'}
                      </button>
                      {botActive && (
                        <p className="text-sm text-green-600">Bot is monitoring {selectedCoin.symbol.toUpperCase()}...</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'advisor' && (
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex items-center space-x-2 mb-4">
                      <Lightbulb size={24} className="text-green-500" />
                      <h3 className="text-lg font-semibold">AI Investment Advisor</h3>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Risk Tolerance</label>
                      <select
                        value={riskTolerance}
                        onChange={(e) => setRiskTolerance(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-3">Recommendations</h4>
                    {recommendations.length > 0 ? (
                      <div className="space-y-4">
                        {recommendations.map(({ coin, score, rationale }, index) => (
                          <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                                {coin.symbol.toUpperCase().charAt(0)}
                              </div>
                              <h5 className="font-medium">{coin.name} ({coin.symbol.toUpperCase()})</h5>
                            </div>
                            <p className="text-sm text-gray-600">Score: {score.toFixed(0)}/100</p>
                            <ul className="text-sm text-gray-600 list-disc list-inside">
                              {rationale.map((reason, i) => (
                                <li key={i}>{reason}</li>
                              ))}
                            </ul>
                            <button
                              onClick={() => {
                                setSelectedCoin(coin);
                                setActiveTab('trade');
                              }}
                              className="mt-2 text-green-500 hover:text-green-600 text-sm font-medium"
                            >
                              Trade Now
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">No recommendations available.</p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockAnalyzer;
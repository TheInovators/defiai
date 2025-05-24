// import React, { useState, useEffect, useCallback } from 'react';
// import { ethers } from 'ethers';
// import { X, TrendingUp, AlertTriangle, BarChart2, Bot, DollarSign, Globe, Brain, Newspaper, Zap, Clock, Network } from 'lucide-react';

// const FeatureModal = ({ isOpen, onClose, feature, availableCoins, account, provider }) => {
//   const [selectedCoin, setSelectedCoin] = useState(null);
//   const [priceThreshold, setPriceThreshold] = useState('');
//   const [currentPrice, setCurrentPrice] = useState(null);
//   const [riskTolerance, setRiskTolerance] = useState('medium');
//   const [sentimentScore, setSentimentScore] = useState(null);
//   const [prediction, setPrediction] = useState(null);
//   const [scanResult, setScanResult] = useState('');
//   const [yieldProtocol, setYieldProtocol] = useState('');
//   const [technicalIndicators, setTechnicalIndicators] = useState(null);
//   const [tradeRecommendation, setTradeRecommendation] = useState(null);
//   const [backtestResult, setBacktestResult] = useState(null);
//   const [stopLossTakeProfit, setStopLossTakeProfit] = useState(null);
//   const [portfolioImpact, setPortfolioImpact] = useState(null);
//   const [correlationData, setCorrelationData] = useState(null);
//   const [macroImpact, setMacroImpact] = useState(null);
//   const [sentimentHeatmap, setSentimentHeatmap] = useState(null);
//   const [userBehavior, setUserBehavior] = useState(null);
//   const [tradeSimulation, setTradeSimulation] = useState(null);
//   const [learningStats, setLearningStats] = useState({ successRate: 50, tradesAnalyzed: 0 });
//   const [newsSentiment, setNewsSentiment] = useState(null);
//   const [volumeBreakout, setVolumeBreakout] = useState(null);
//   const [seasonalityData, setSeasonalityData] = useState(null);
//   const [orderRouting, setOrderRouting] = useState(null);
//   const [portfolioRebalance, setPortfolioRebalance] = useState(null);
//   const [confidenceTrend, setConfidenceTrend] = useState([]);
//   const [hypeIndex, setHypeIndex] = useState(null);
//   const [customStrategy, setCustomStrategy] = useState({
//     rsiOverbought: 70,
//     rsiOversold: 30,
//     sentimentWeight: 0.3,
//     macroWeight: 0.2,
//   });
//   const [question, setQuestion] = useState('');
//   const [botAnswer, setBotAnswer] = useState('');
//   const [isLoadingBot, setIsLoadingBot] = useState(false);

//   // Simulated user trading history
//   const [userTradeHistory, setUserTradeHistory] = useState([]);

//   // Helper to fetch price data
//   const fetchPrice = useCallback(async (coinId) => {
//     try {
//       const response = await fetch(
//         `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinId}`
//       );
//       const [data] = await response.json();
//       setCurrentPrice(data.current_price);
//       return data.current_price;
//     } catch (err) {
//       console.error('Failed to fetch price:', err);
//       return null;
//     }
//   }, []);

//   // Helper to fetch historical data (price and volume)
//   const fetchHistoricalData = useCallback(async (coinId, days = 90) => {
//     try {
//       const response = await fetch(
//         `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
//       );
//       const data = await response.json();
//       return {
//         prices: data.prices.map(([, price]) => price),
//         volumes: data.total_volumes.map(([, volume]) => volume),
//       };
//     } catch (err) {
//       console.error('Failed to fetch historical data:', err);
//       return { prices: [], volumes: [] };
//     }
//   }, []);

//   // AI Smart Trading Bots: Enhanced with New Features
//   useEffect(() => {
//     if (isOpen && selectedCoin && feature.title === 'AI Smart Trading Bots') {
//       const fetchBotData = async () => {
//         try {
//           const currentPrice = await fetchPrice(selectedCoin.id);
//           if (!currentPrice) return;

//           // Fetch historical data
//           const { prices, volumes } = await fetchHistoricalData(selectedCoin.id, 90);
//           if (prices.length < 90 || volumes.length < 90) return;

//           // Technical Indicators
//           const smaPeriod = 14;
//           const sma = prices.slice(-smaPeriod).reduce((sum, p) => sum + p, 0) / smaPeriod;

//           const gains = [];
//           const losses = [];
//           for (let i = 1; i < prices.length; i++) {
//             const diff = prices[i] - prices[i - 1];
//             if (diff >= 0) {
//               gains.push(diff);
//               losses.push(0);
//             } else {
//               gains.push(0);
//               losses.push(-diff);
//             }
//           }
//           const avgGain = gains.reduce((sum, g) => sum + g, 0) / smaPeriod;
//           const avgLoss = losses.reduce((sum, l) => sum + l, 0) / smaPeriod;
//           const rs = avgGain / (avgLoss || 1);
//           const rsi = 100 - (100 / (1 + rs));

//           // MACD
//           const ema12 = prices.slice(-26).reduce((acc, p, i) => {
//             if (i === 0) return p;
//             return p * (2 / (12 + 1)) + acc * (1 - 2 / (12 + 1));
//           }, prices[prices.length - 26]);
//           const ema26 = prices.slice(-26).reduce((acc, p, i) => {
//             if (i === 0) return p;
//             return p * (2 / (26 + 1)) + acc * (1 - 2 / (26 + 1));
//           }, prices[prices.length - 26]);
//           const macd = ema12 - ema26;

//           // Volatility
//           const mean = prices.reduce((sum, p) => sum + p, 0) / prices.length;
//           const variance = prices.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / prices.length;
//           const volatility = Math.sqrt(variance);

//           // Trend Analysis
//           const x = prices.map((_, i) => i);
//           const y = prices;
//           const n = prices.length;
//           const sumX = x.reduce((sum, val) => sum + val, 0);
//           const sumY = y.reduce((sum, val) => sum + val, 0);
//           const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
//           const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
//           const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
//           const trend = slope > 0 ? 'Uptrend' : slope < 0 ? 'Downtrend' : 'Sideways';

//           // Liquidity
//           const volumeToMarketCap = selectedCoin.total_volume / selectedCoin.market_cap;
//           const liquidityScore = volumeToMarketCap > 0.05 ? 'High' : volumeToMarketCap > 0.02 ? 'Medium' : 'Low';

//           // Sentiment
//           const priceChange = selectedCoin.price_change_percentage_24h || 0;
//           let sentiment = priceChange > 0
//             ? 75 + Math.min(priceChange * 5, 25)
//             : 25 + Math.max(priceChange * 5, -25);
//           const socialSentiment = Math.random() * 20 - 10;
//           sentiment = Math.min(100, Math.max(0, sentiment + socialSentiment));

//           // Volume Breakout Detection
//           const avgVolume = volumes.slice(-30).reduce((sum, v) => sum + v, 0) / 30;
//           const recentVolume = volumes[volumes.length - 1];
//           const volumeSpike = recentVolume / avgVolume;
//           const breakoutSignal = volumeSpike > 2 && slope > 0 ? 'Bullish Breakout' : volumeSpike > 2 && slope < 0 ? 'Bearish Breakout' : 'No Breakout';
//           setVolumeBreakout({
//             spike: volumeSpike.toFixed(2),
//             signal: breakoutSignal,
//           });

//           // Market Correlation Analysis
//           const btcPrices = (await fetchHistoricalData('bitcoin', 90)).prices;
//           if (btcPrices.length === prices.length) {
//             const btcMean = btcPrices.reduce((sum, p) => sum + p, 0) / btcPrices.length;
//             const coinMean = mean;
//             const covariance = prices.reduce((sum, p, i) => sum + (p - coinMean) * (btcPrices[i] - btcMean), 0) / prices.length;
//             const btcStdDev = Math.sqrt(btcPrices.reduce((sum, p) => sum + Math.pow(p - btcMean, 2), 0) / btcPrices.length);
//             const coinStdDev = volatility;
//             const correlation = covariance / (btcStdDev * coinStdDev);
//             setCorrelationData({
//               btcCorrelation: correlation.toFixed(2),
//               interpretation: correlation > 0.7 ? 'Strongly Correlated with BTC' : correlation < -0.7 ? 'Inversely Correlated with BTC' : 'Low Correlation with BTC',
//             });
//           }

//           // Macroeconomic Impact
//           const date = new Date('2025-05-24T17:27:00+05:30');
//           const isWeekend = date.getDay() === 6 || date.getDay() === 0;
//           const simulatedInterestRate = 5.0;
//           const simulatedInflation = 3.2;
//           let macroScore = 0;
//           let macroRationale = [];
//           if (simulatedInterestRate > 5) {
//             macroScore -= 20;
//             macroRationale.push('High interest rates may reduce crypto demand');
//           }
//           if (simulatedInflation > 3) {
//             macroScore += 15;
//             macroRationale.push('High inflation may drive crypto adoption');
//           }
//           if (isWeekend) {
//             macroScore -= 10;
//             macroRationale.push('Weekend trading may have lower volume and higher volatility');
//           }
//           setMacroImpact({ score: macroScore, rationale: macroRationale });

//           // News Sentiment (Simulated)
//           const simulatedNews = [
//             { headline: 'Bitcoin ETF Approval Likely', sentiment: 0.8 },
//             { headline: 'Regulatory Crackdown on Crypto', sentiment: -0.6 },
//           ];
//           const newsImpact = simulatedNews.reduce((sum, news) => sum + news.sentiment, 0) / simulatedNews.length;
//           setNewsSentiment({
//             score: (newsImpact * 50 + 50).toFixed(0),
//             headlines: simulatedNews.map(n => n.headline),
//           });

//           // Seasonality and Time-Based Patterns
//           const monthPerformance = prices.length > 60 ? ((prices[prices.length - 1] - prices[prices.length - 30]) / prices[prices.length - 30] * 100).toFixed(2) : 0;
//           const dayPerformance = prices.length > 2 ? ((prices[prices.length - 1] - prices[prices.length - 2]) / prices[prices.length - 2] * 100).toFixed(2) : 0;
//           const hour = date.getHours();
//           const timePerformance = hour >= 9 && hour <= 17 ? 'Normal Trading Hours' : 'After-Hours (Higher Volatility)';
//           setSeasonalityData({
//             monthPerformance,
//             dayPerformance,
//             timePerformance,
//             note: isWeekend ? `${selectedCoin.symbol.toUpperCase()} has historically dipped on weekends` : 'No significant weekend pattern',
//           });

//           // Social Media Hype Index (Simulated)
//           const mentions = Math.floor(Math.random() * 1000) + 500;
//           const hypeScore = Math.min(100, mentions / 10);
//           setHypeIndex({
//             score: hypeScore.toFixed(0),
//             mentions,
//           });

//           // Trade Recommendation Logic
//           let recommendation = '';
//           let confidence = 50;
//           let rationale = [];

//           // Base Recommendation with Custom Strategy
//           const rsiOverbought = customStrategy.rsiOverbought;
//           const rsiOversold = customStrategy.rsiOversold;
//           if (rsi > rsiOverbought && trend === 'Downtrend' && macd < 0) {
//             recommendation = 'Sell';
//             confidence = 85;
//             rationale.push(`RSI (${rsi.toFixed(2)}) indicates overbought (threshold: ${rsiOverbought})`, 'Downtrend with bearish MACD');
//           } else if (rsi < rsiOversold && trend === 'Uptrend' && macd > 0) {
//             recommendation = 'Buy';
//             confidence = 85;
//             rationale.push(`RSI (${rsi.toFixed(2)}) indicates oversold (threshold: ${rsiOversold})`, 'Uptrend with bullish MACD');
//           } else if (sentiment > 70 && trend === 'Uptrend' && liquidityScore !== 'Low') {
//             recommendation = 'Buy';
//             confidence = 70;
//             rationale.push('Positive sentiment', 'Uptrend with good liquidity');
//           } else if (sentiment < 30 && trend === 'Downtrend') {
//             recommendation = 'Sell';
//             confidence = 70;
//             rationale.push('Negative sentiment', 'Downtrend detected');
//           } else {
//             recommendation = 'Hold';
//             confidence = 60;
//             rationale.push('No clear signal');
//           }

//           // Adjust for Additional Factors
//           const volatilityFactor = volatility / mean;
//           confidence = Math.max(40, confidence - volatilityFactor * 100);
//           if (riskTolerance === 'low' && volatilityFactor > 0.1) {
//             confidence -= 15;
//             rationale.push('High volatility may not suit low risk tolerance');
//           } else if (riskTolerance === 'high') {
//             confidence += 10;
//             rationale.push('High risk tolerance aligns with market conditions');
//           }

//           // Macroeconomic Adjustment
//           confidence = Math.max(40, confidence + macroImpact.score * customStrategy.macroWeight);
//           rationale.push(...macroImpact.rationale);

//           // News Sentiment Adjustment
//           const newsAdjustment = (newsSentiment.score - 50) * 0.2;
//           confidence = Math.max(40, confidence + newsAdjustment);
//           rationale.push(`News sentiment adjustment: ${newsAdjustment.toFixed(0)}%`);

//           // Volume Breakout Adjustment
//           if (volumeBreakout.signal === 'Bullish Breakout') {
//             confidence += 10;
//             rationale.push('Bullish volume breakout detected');
//           } else if (volumeBreakout.signal === 'Bearish Breakout') {
//             confidence -= 10;
//             rationale.push('Bearish volume breakout detected');
//           }

//           // Seasonality Adjustment
//           if (seasonalityData.monthPerformance < 0) {
//             confidence -= 5;
//             rationale.push(`Negative performance this month: ${seasonalityData.monthPerformance}%`);
//           }
//           if (seasonalityData.timePerformance === 'After-Hours (Higher Volatility)') {
//             confidence -= 5;
//             rationale.push('After-hours trading may increase volatility');
//           }

//           // Hype Index Adjustment
//           if (hypeIndex.score > 80) {
//             confidence += 5;
//             rationale.push('High social media hype may drive price movement');
//           } else if (hypeIndex.score < 20) {
//             confidence -= 5;
//             rationale.push('Low social media hype may indicate lack of interest');
//           }

//           // User Behavior Adjustment
//           const simulatedBehavior = userTradeHistory.length > 0 ? userTradeHistory[userTradeHistory.length - 1] : null;
//           let behaviorAdjustment = 0;
//           let behaviorRationale = [];
//           if (simulatedBehavior) {
//             if (simulatedBehavior.action === 'Buy' && recommendation === 'Sell') {
//               behaviorAdjustment -= 5;
//               behaviorRationale.push('Recent buy may indicate hesitation to sell');
//             } else if (simulatedBehavior.action === 'Sell' && recommendation === 'Buy') {
//               behaviorAdjustment -= 5;
//               behaviorRationale.push('Recent sell may indicate hesitation to buy');
//             }
//           }
//           confidence = Math.max(40, confidence + behaviorAdjustment);
//           setUserBehavior({ adjustment: behaviorAdjustment, rationale: behaviorRationale });

//           // Learning Mode Adjustment
//           if (learningStats.tradesAnalyzed > 0) {
//             const successAdjustment = learningStats.successRate > 60 ? 5 : learningStats.successRate < 40 ? -5 : 0;
//             confidence = Math.max(40, confidence + successAdjustment);
//             rationale.push(`Bot confidence adjusted by past performance (${learningStats.successRate}% success rate)`);
//           }

//           // Sentiment Weight Adjustment
//           const sentimentAdjustment = (sentiment - 50) * customStrategy.sentimentWeight;
//           confidence = Math.max(40, confidence + sentimentAdjustment);
//           rationale.push(`Sentiment adjustment: ${sentimentAdjustment.toFixed(0)}%`);

//           // Update Confidence Trend
//           setConfidenceTrend(prev => {
//             const newTrend = [...prev, { timestamp: new Date().toISOString(), confidence }].slice(-24); // Last 24 updates
//             return newTrend;
//           });

//           setTechnicalIndicators({
//             sma: sma.toFixed(2),
//             rsi: rsi.toFixed(2),
//             macd: macd.toFixed(2),
//             volatility: volatility.toFixed(2),
//             trend,
//             liquidityScore,
//           });

//           setTradeRecommendation({
//             action: recommendation,
//             confidence: confidence.toFixed(0),
//             rationale,
//           });

//           // Backtesting
//           const backtestPrices = prices.slice(-30);
//           let balance = 10000;
//           let position = 0;
//           let trades = 0;
//           for (let i = 1; i < backtestPrices.length; i++) {
//             const prevPrice = backtestPrices[i - 1];
//             const currPrice = backtestPrices[i];
//             const miniPrices = backtestPrices.slice(Math.max(0, i - 14), i);
//             const miniGains = [];
//             const miniLosses = [];
//             for (let j = 1; j < miniPrices.length; j++) {
//               const diff = miniPrices[j] - miniPrices[j - 1];
//               if (diff >= 0) miniGains.push(diff);
//               else miniLosses.push(-diff);
//             }
//             const miniAvgGain = miniGains.reduce((sum, g) => sum + g, 0) / 14;
//             const miniAvgLoss = miniLosses.reduce((sum, l) => sum + l, 0) / 14;
//             const miniRs = miniAvgGain / (miniAvgLoss || 1);
//             const miniRsi = 100 - (100 / (1 + miniRs));

//             if (miniRsi < customStrategy.rsiOversold && position === 0) {
//               position = balance / prevPrice;
//               balance = 0;
//               trades++;
//             } else if (miniRsi > customStrategy.rsiOverbought && position > 0) {
//               balance = position * currPrice;
//               position = 0;
//               trades++;
//             }
//           }
//           const finalValue = balance + (position * currentPrice);
//           const returns = ((finalValue - 10000) / 10000 * 100).toFixed(2);
//           setBacktestResult({
//             returns,
//             trades,
//             finalValue: finalValue.toFixed(2),
//           });

//           // Dynamic Stop-Loss and Take-Profit
//           const atrPeriod = 14;
//           const priceRanges = [];
//           for (let i = 1; i < prices.length; i++) {
//             const highLow = Math.abs(prices[i] - prices[i - 1]);
//             priceRanges.push(highLow);
//           }
//           const atr = priceRanges.slice(-atrPeriod).reduce((sum, r) => sum + r, 0) / atrPeriod;
//           const multiplier = riskTolerance === 'low' ? 1.5 : riskTolerance === 'medium' ? 2 : 3;
//           const stopLoss = recommendation === 'Buy'
//             ? (currentPrice - atr * multiplier).toFixed(2)
//             : (currentPrice + atr * multiplier).toFixed(2);
//           const takeProfit = recommendation === 'Buy'
//             ? (currentPrice + atr * multiplier * 1.5).toFixed(2)
//             : (currentPrice - atr * multiplier * 1.5).toFixed(2);
//           setStopLossTakeProfit({
//             stopLoss,
//             takeProfit,
//             atr: atr.toFixed(2),
//           });

//           // Position Sizing
//           const walletBalance = await provider.getBalance(account);
//           const formattedBalance = parseFloat(ethers.formatEther(walletBalance));
//           const portfolioValue = formattedBalance * currentPrice;
//           const riskPercentage = riskTolerance === 'low' ? 0.01 : riskTolerance === 'medium' ? 0.02 : 0.05;
//           const riskAmount = portfolioValue * riskPercentage;
//           const stopLossDistance = recommendation === 'Buy'
//             ? currentPrice - parseFloat(stopLoss)
//             : parseFloat(stopLoss) - currentPrice;
//           const positionSize = (riskAmount / stopLossDistance).toFixed(2);

//           // Trade Execution Simulation with Smart Order Routing
//           const tradingFee = 0.001;
//           const slippage = volatilityFactor > 0.1 ? 0.005 : 0.002;
//           const dexOptions = [
//             { name: 'PancakeSwap', fee: 0.0025, priceImpact: 0.003 },
//             { name: 'SushiSwap', fee: 0.003, priceImpact: 0.002 },
//             { name: 'UniSwap', fee: 0.003, priceImpact: 0.004 },
//           ];
//           const bestDex = dexOptions.reduce((best, dex) => {
//             const totalCost = positionSize * currentPrice * (1 + dex.fee + dex.priceImpact);
//             return totalCost < (best.totalCost || Infinity) ? { ...dex, totalCost } : best;
//           }, {});
//           const costWithFees = positionSize * currentPrice * (1 + bestDex.fee + bestDex.priceImpact);
//           const potentialGain = recommendation === 'Buy'
//             ? (parseFloat(takeProfit) - currentPrice) * positionSize * (1 - bestDex.fee - bestDex.priceImpact)
//             : (currentPrice - parseFloat(takeProfit)) * positionSize * (1 - bestDex.fee - bestDex.priceImpact);
//           const potentialLoss = recommendation === 'Buy'
//             ? (currentPrice - parseFloat(stopLoss)) * positionSize * (1 + bestDex.fee + bestDex.priceImpact)
//             : (parseFloat(stopLoss) - currentPrice) * positionSize * (1 + bestDex.fee + bestDex.priceImpact);
//           setOrderRouting({
//             bestDex: bestDex.name,
//             savings: ((positionSize * currentPrice * (dexOptions[0].fee + dexOptions[0].priceImpact) - bestDex.totalCost) / currentPrice).toFixed(2),
//           });
//           setTradeSimulation({
//             positionSize,
//             costWithFees: costWithFees.toFixed(2),
//             potentialGain: potentialGain.toFixed(2),
//             potentialLoss: potentialLoss.toFixed(2),
//             riskRewardRatio: (potentialGain / (potentialLoss || 1)).toFixed(2),
//           });

//           // Portfolio Impact
//           const tradeAmount = positionSize * currentPrice;
//           setPortfolioImpact({
//             tradeAmount: tradeAmount.toFixed(2),
//             potentialLoss: potentialLoss.toFixed(2),
//             potentialGain: potentialGain.toFixed(2),
//             portfolioPercentage: ((tradeAmount / portfolioValue) * 100).toFixed(2),
//           });

//           // Portfolio Rebalancing Suggestion
//           const targetAllocation = riskTolerance === 'low' ? 0.05 : riskTolerance === 'medium' ? 0.1 : 0.2;
//           const currentAllocation = tradeAmount / portfolioValue;
//           const rebalanceAction = currentAllocation > targetAllocation
//             ? `Reduce ${selectedCoin.symbol.toUpperCase()} allocation by ${((currentAllocation - targetAllocation) * 100).toFixed(2)}%`
//             : currentAllocation < targetAllocation
//             ? `Increase ${selectedCoin.symbol.toUpperCase()} allocation by ${((targetAllocation - currentAllocation) * 100).toFixed(2)}%`
//             : 'Allocation within target range';
//           setPortfolioRebalance({
//             currentAllocation: (currentAllocation * 100).toFixed(2),
//             targetAllocation: (targetAllocation * 100).toFixed(2),
//             action: rebalanceAction,
//           });

//           // Sentiment Heatmap
//           const heatmapData = await Promise.all(
//             availableCoins.slice(0, 5).map(async (coin) => {
//               const coinPrices = (await fetchHistoricalData(coin.id, 90)).prices;
//               if (coinPrices.length < 90) return { id: coin.id, sentiment: 50 };
//               const coinPriceChange = coin.price_change_percentage_24h || 0;
//               let coinSentiment = coinPriceChange > 0
//                 ? 75 + Math.min(coinPriceChange * 5, 25)
//                 : 25 + Math.max(coinPriceChange * 5, -25);
//               coinSentiment = Math.min(100, Math.max(0, coinSentiment + (Math.random() * 20 - 10)));
//               return { id: coin.id, symbol: coin.symbol, sentiment: coinSentiment };
//             })
//           );
//           setSentimentHeatmap(heatmapData);

//           // Update Learning Stats
//           if (userTradeHistory.length > 0) {
//             const successfulTrades = userTradeHistory.filter(trade => trade.outcome === 'Profit').length;
//             setLearningStats({
//               successRate: (successfulTrades / userTradeHistory.length * 100).toFixed(2),
//               tradesAnalyzed: userTradeHistory.length,
//             });
//           }

//           // Price Threshold Alert
//           if (priceThreshold && currentPrice < parseFloat(priceThreshold)) {
//             alert(`Bot Signal: Buy ${selectedCoin.symbol.toUpperCase()} at $${currentPrice.toFixed(2)} (below $${priceThreshold})`);
//             setUserTradeHistory(prev => [
//               ...prev,
//               { action: 'Buy', price: currentPrice, timestamp: new Date().toISOString(), outcome: 'Pending' }
//             ]);
//           }
//         } catch (err) {
//           console.error('AI Smart Trading Bot error:', err);
//         }
//       };

//       fetchBotData();
//       const interval = setInterval(fetchBotData, 60000);
//       return () => clearInterval(interval);
//     }
//   }, [isOpen, selectedCoin, priceThreshold, feature, riskTolerance, account, provider, fetchPrice, fetchHistoricalData, userTradeHistory, customStrategy]);

//   // Real-time Sentiment Analytics
//   useEffect(() => {
//     if (isOpen && selectedCoin && feature.title === 'Real-time Sentiment Analytics') {
//       const calculateSentiment = () => {
//         const priceChange = selectedCoin.price_change_percentage_24h || 0;
//         let score = priceChange > 0
//           ? 75 + Math.min(priceChange * 5, 25)
//           : 25 + Math.max(priceChange * 5, -25);
//         const socialSentiment = Math.random() * 20 - 10;
//         score = Math.min(100, Math.max(0, score + socialSentiment));
//         setSentimentScore(score.toFixed(0));
//       };
//       calculateSentiment();
//     }
//   }, [isOpen, selectedCoin, feature]);

//   // Predictive Analytics
//   useEffect(() => {
//     if (isOpen && selectedCoin && feature.title === 'Predictive Analytics') {
//       const generatePrediction = async () => {
//         try {
//           const { prices } = await fetchHistoricalData(selectedCoin.id, 30);
//           if (prices.length < 30) {
//             setPrediction('Insufficient data for prediction');
//             return;
//           }
//           const avg = prices.reduce((sum, p) => sum + p, 0) / prices.length;
//           const trend = prices[prices.length - 1] > avg ? 'rise' : 'fall';
//           const change = Math.abs((prices[prices.length - 1] - avg) / avg * 100).toFixed(2);
//           const mean = prices.reduce((sum, p) => sum + p, 0) / prices.length;
//           const variance = prices.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / prices.length;
//           const volatility = Math.sqrt(variance).toFixed(2);
//           const confidence = Math.max(50, 100 - volatility / mean * 100).toFixed(0);
//           setPrediction(
//             `${selectedCoin.symbol.toUpperCase()} likely to ${trend} ${change}% in 7 days (Confidence: ${confidence}%, Volatility: $${volatility})`
//           );
//         } catch (err) {
//           setPrediction('Unable to generate prediction');
//         }
//       };
//       generatePrediction();
//     }
//   }, [isOpen, selectedCoin, feature, fetchHistoricalData]);

//   // Advanced Security
//   useEffect(() => {
//     if (isOpen && feature.title === 'Advanced Security' && account && provider) {
//       const scanWallet = async () => {
//         try {
//           const balance = await provider.getBalance(account);
//           const formattedBalance = ethers.formatEther(balance);
//           const blockNumber = await provider.getBlockNumber();
//           const transactions = [];
//           for (let i = 0; i < 5 && blockNumber - i >= 0; i++) {
//             const block = await provider.getBlock(blockNumber - i, true);
//             const txs = block.transactions.filter(tx => 
//               tx.from.toLowerCase() === account.toLowerCase() || 
//               (tx.to && tx.to.toLowerCase() === account.toLowerCase())
//             );
//             transactions.push(...txs);
//           }
//           const transactionSummary = transactions.length > 0
//             ? `Recent Transactions: ${transactions.length} in last 5 blocks`
//             : 'No recent transactions found';
//           setScanResult(`Wallet Balance: ${formattedBalance} BNB\n${transactionSummary}`);
//         } catch (err) {
//           setScanResult(`Scan failed: ${err.message}`);
//         }
//       };
//       scanWallet();
//     }
//   }, [isOpen, feature, account, provider]);

//   // Automated Yield Farming
//   useEffect(() => {
//     if (isOpen && selectedCoin && feature.title === 'Automated Yield Farming') {
//       const protocols = [
//         { name: 'PancakeSwap', baseApy: 15, risk: 'Low' },
//         { name: 'Venus', baseApy: 20, risk: 'Medium' },
//         { name: 'BakerySwap', baseApy: 25, risk: 'High' },
//       ];
//       const optimalProtocol = protocols.reduce((best, protocol) => {
//         let apy = protocol.baseApy + Math.random() * 5;
//         if (riskTolerance === 'low' && protocol.risk === 'Low') apy += 5;
//         if (riskTolerance === 'medium' && protocol.risk === 'Medium') apy += 5;
//         if (riskTolerance === 'high' && protocol.risk === 'High') apy += 5;
//         return apy > (best.apy || 0) ? { ...protocol, apy } : best;
//       }, {});
//       setYieldProtocol(
//         `Optimal Protocol: ${optimalProtocol.name} (Estimated APY: ${optimalProtocol.apy.toFixed(2)}%, Risk: ${optimalProtocol.risk})`
//       );
//     }
//   }, [isOpen, selectedCoin, feature, riskTolerance]);

//   // Trading Q&A Bot
//   const handleAskBot = async () => {
//     if (!question.trim()) return;
//     setIsLoadingBot(true);
//     setBotAnswer('');

//     try {
//       const lowerQuestion = question.toLowerCase();
//       let answer = '';

//       if (lowerQuestion.includes('what is a stop-loss')) {
//         answer = 'A stop-loss is an order to sell a security when it reaches a certain price to limit losses. For example, if you buy a stock at $100 and set a stop-loss at $90, it will sell automatically if the price drops to $90, capping your loss at 10%.';
//       } else if (lowerQuestion.includes('how to read candlestick charts')) {
//         answer = 'Candlestick charts show price movements over time. Each candlestick represents the open, close, high, and low prices for a period. Green candles indicate the close was higher than the open (bullish), while red candles show the close was lower (bearish). Wicks show the high and low. Patterns like Doji or Engulfing can signal reversals.';
//       } else if (lowerQuestion.includes('what is rsi')) {
//         answer = 'The Relative Strength Index (RSI) measures momentum on a scale of 0 to 100. Above 70 indicates overbought conditions (potential sell), below 30 indicates oversold (potential buy). It’s calculated as RSI = 100 - (100 / (1 + RS)), where RS is the average gain divided by average loss over 14 periods.';
//       } else if (lowerQuestion.includes('should i invest in bitcoin')) {
//         answer = `Investing in Bitcoin depends on your risk tolerance. As of May 24, 2025, its price is $${currentPrice || 'unknown'}. Bitcoin is volatile but has growth potential. Pros: decentralized, growing adoption. Cons: regulatory risks, price swings. With ${riskTolerance} risk tolerance, consider allocating 5-10% of your portfolio and diversifying.`;
//       } else if (lowerQuestion.includes('what is diversification')) {
//         answer = 'Diversification spreads investments across assets to reduce risk. For example, invest in stocks, crypto, bonds, and real estate across sectors. This minimizes losses if one asset underperforms. Aim for assets with low correlation.';
//       } else if (lowerQuestion.includes('what is a pe ratio')) {
//         answer = 'The Price-to-Earnings (P/E) ratio is a stock valuation metric: stock price divided by earnings per share (EPS). A high P/E (e.g., 30) may indicate overvaluation or high growth expectations, while a low P/E (e.g., 10) may suggest undervaluation. Compare to the industry average.';
//       } else if (lowerQuestion.includes('what is yield farming')) {
//         answer = 'Yield farming involves staking crypto in DeFi protocols to earn rewards, like interest or tokens. For example, staking in PancakeSwap liquidity pools can yield 5-100% APY. Risks include impermanent loss, smart contract bugs, and volatility. Research protocols thoroughly.';
//       } else {
//         answer = 'I’m not sure how to answer that. Could you rephrase or ask another trading-related question?';
//       }

//       setBotAnswer(answer);
//     } catch (err) {
//       setBotAnswer('Error: Unable to generate a response. Please try again.');
//     } finally {
//       setIsLoadingBot(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="flex items-center justify-between p-6 border-b">
//           <div className="flex items-center space-x-3">
//             <div className="text-green-500">{feature.icon}</div>
//             <h2 className="text-xl font-bold text-gray-900">{feature.title}</h2>
//           </div>
//           <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
//             <X size={20} className="text-gray-500" />
//           </button>
//         </div>
//         <div className="p-6">
//           <p className="text-gray-600 mb-6">{feature.description}</p>

//           {/* Coin Selection */}
//           {(feature.title === 'AI Smart Trading Bots' ||
//             feature.title === 'Real-time Sentiment Analytics' ||
//             feature.title === 'Predictive Analytics' ||
//             feature.title === 'Automated Yield Farming') && (
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">Select Cryptocurrency</label>
//               <select
//                 value={selectedCoin?.id || ''}
//                 onChange={(e) => {
//                   const coin = availableCoins.find(c => c.id === e.target.value);
//                   setSelectedCoin(coin || null);
//                 }}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
//               >
//                 <option value="">Select Coin</option>
//                 {availableCoins.map(coin => (
//                   <option key={coin.id} value={coin.id}>
//                     {coin.name} ({coin.symbol.toUpperCase()})
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}

//           {/* Risk Tolerance Selection */}
//           {feature.title === 'AI Smart Trading Bots' && (
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">Risk Tolerance</label>
//               <select
//                 value={riskTolerance}
//                 onChange={(e) => setRiskTolerance(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
//               >
//                 <option value="low">Low</option>
//                 <option value="medium">Medium</option>
//                 <option value="high">High</option>
//               </select>
//             </div>
//           )}

//           {/* Custom Strategy Builder */}
//           {feature.title === 'AI Smart Trading Bots' && (
//             <div className="mb-6 bg-gray-50 p-4 rounded-lg">
//               <div className="flex items-center space-x-2 mb-2">
//                 <Zap size={20} className="text-green-500" />
//                 <p className="text-sm font-bold text-gray-600">Custom Strategy Builder</p>
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm text-gray-700">RSI Overbought Threshold</label>
//                   <input
//                     type="number"
//                     value={customStrategy.rsiOverbought}
//                     onChange={(e) => setCustomStrategy({ ...customStrategy, rsiOverbought: parseFloat(e.target.value) })}
//                     className="w-full px-2 py-1 border border-gray-300 rounded-lg"
//                     min="50"
//                     max="100"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm text-gray-700">RSI Oversold Threshold</label>
//                   <input
//                     type="number"
//                     value={customStrategy.rsiOversold}
//                     onChange={(e) => setCustomStrategy({ ...customStrategy, rsiOversold: parseFloat(e.target.value) })}
//                     className="w-full px-2 py-1 border border-gray-300 rounded-lg"
//                     min="0"
//                     max="50"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm text-gray-700">Sentiment Weight</label>
//                   <input
//                     type="number"
//                     value={customStrategy.sentimentWeight}
//                     onChange={(e) => setCustomStrategy({ ...customStrategy, sentimentWeight: parseFloat(e.target.value) })}
//                     className="w-full px-2 py-1 border border-gray-300 rounded-lg"
//                     min="0"
//                     max="1"
//                     step="0.1"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm text-gray-700">Macro Weight</label>
//                   <input
//                     type="number"
//                     value={customStrategy.macroWeight}
//                     onChange={(e) => setCustomStrategy({ ...customStrategy, macroWeight: parseFloat(e.target.value) })}
//                     className="w-full px-2 py-1 border border-gray-300 rounded-lg"
//                     min="0"
//                     max="1"
//                     step="0.1"
//                   />
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* AI Smart Trading Bots */}
//           {feature.title === 'AI Smart Trading Bots' && selectedCoin && (
//             <div className="space-y-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Price Threshold (USD)</label>
//                 <input
//                   type="number"
//                   value={priceThreshold}
//                   onChange={(e) => setPriceThreshold(e.target.value)}
//                   placeholder="e.g., 500"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
//                 />
//                 <p className="text-sm text-gray-500 mt-1">Bot will buy when price drops below this value</p>
//               </div>

//               {currentPrice && (
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <p className="text-sm text-gray-600">Current Price</p>
//                   <p className="text-lg font-bold text-gray-900">${currentPrice.toFixed(2)}</p>
//                 </div>
//               )}

//               {technicalIndicators && (
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <div className="flex items-center space-x-2 mb-2">
//                     <BarChart2 size={20} className="text-green-500" />
//                     <p className="text-sm font-bold text-gray-600">Technical Indicators</p>
//                   </div>
//                   <p className="text-sm text-gray-900">14-Day SMA: ${technicalIndicators.sma}</p>
//                   <p className="text-sm text-gray-900">RSI: {technicalIndicators.rsi}</p>
//                   <p className="text-sm text-gray-900">MACD: {technicalIndicators.macd}</p>
//                   <p className="text-sm text-gray-900">Volatility: ${technicalIndicators.volatility}</p>
//                   <p className="text-sm text-gray-900">Trend: {technicalIndicators.trend}</p>
//                   <p className="text-sm text-gray-900">Liquidity: {technicalIndicators.liquidityScore}</p>
//                 </div>
//               )}

//               {volumeBreakout && (
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <div className="flex items-center space-x-2 mb-2">
//                     <Zap size={20} className="text-green-500" />
//                     <p className="text-sm font-bold text-gray-600">Volume Breakout Detection</p>
//                   </div>
//                   <p className="text-sm text-gray-900">Volume Spike: {volumeBreakout.spike}x average</p>
//                   <p className="text-sm text-gray-900">Signal: {volumeBreakout.signal}</p>
//                 </div>
//               )}

//               {correlationData && (
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <div className="flex items-center space-x-2 mb-2">
//                     <Globe size={20} className="text-green-500" />
//                     <p className="text-sm font-bold text-gray-600">Market Correlation</p>
//                   </div>
//                   <p className="text-sm text-gray-900">BTC Correlation: {correlationData.btcCorrelation}</p>
//                   <p className="text-sm text-gray-600">{correlationData.interpretation}</p>
//                 </div>
//               )}

//               {macroImpact && (
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <div className="flex items-center space-x-2 mb-2">
//                     <Globe size={20} className="text-green-500" />
//                     <p className="text-sm font-bold text-gray-600">Macroeconomic Impact</p>
//                   </div>
//                   <p className="text-sm text-gray-900">Macro Score Adjustment: {macroImpact.score}</p>
//                   <ul className="text-sm text-gray-600 list-disc list-inside">
//                     {macroImpact.rationale.map((reason, i) => (
//                       <li key={i}>{reason}</li>
//                     ))}
//                   </ul>
//                 </div>
//               )}

//               {newsSentiment && (
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <div className="flex items-center space-x-2 mb-2">
//                     <Newspaper size={20} className="text-green-500" />
//                     <p className="text-sm font-bold text-gray-600">News Sentiment</p>
//                   </div>
//                   <p className="text-sm text-gray-900">News Sentiment Score: {newsSentiment.score}/100</p>
//                   <p className="text-sm text-gray-600">Recent Headlines:</p>
//                   <ul className="text-sm text-gray-600 list-disc list-inside">
//                     {newsSentiment.headlines.map((headline, i) => (
//                       <li key={i}>{headline}</li>
//                     ))}
//                   </ul>
//                 </div>
//               )}

//               {seasonalityData && (
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <div className="flex items-center space-x-2 mb-2">
//                     <Clock size={20} className="text-green-500" />
//                     <p className="text-sm font-bold text-gray-600">Seasonality & Time Patterns</p>
//                   </div>
//                   <p className="text-sm text-gray-900">Month Performance: {seasonalityData.monthPerformance}%</p>
//                   <p className="text-sm text-gray-900">Day Performance: {seasonalityData.dayPerformance}%</p>
//                   <p className="text-sm text-gray-900">Time: {seasonalityData.timePerformance}</p>
//                   <p className="text-sm text-gray-600">{seasonalityData.note}</p>
//                 </div>
//               )}

//               {hypeIndex && (
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <div className="flex items-center space-x-2 mb-2">
//                     <Zap size={20} className="text-green-500" />
//                     <p className="text-sm font-bold text-gray-600">Social Media Hype Index</p>
//                   </div>
//                   <p className="text-sm text-gray-900">Hype Score: {hypeIndex.score}/100</p>
//                   <p className="text-sm text-gray-900">Mentions: {hypeIndex.mentions}</p>
//                 </div>
//               )}

//               {tradeRecommendation && (
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <div className="flex items-center space-x-2 mb-2">
//                     <TrendingUp size={20} className="text-green-500" />
//                     <p className="text-sm font-bold text-gray-600">Trade Recommendation</p>
//                   </div>
//                   <p className={`text-lg font-bold ${tradeRecommendation.action === 'Buy' ? 'text-green-600' : tradeRecommendation.action === 'Sell' ? 'text-red-600' : 'text-gray-600'}`}>
//                     Action: {tradeRecommendation.action}
//                   </p>
//                   <p className="text-sm text-gray-900">Confidence: {tradeRecommendation.confidence}%</p>
//                   <p className="text-sm text-gray-600 mt-2">Rationale:</p>
//                   <ul className="text-sm text-gray-600 list-disc list-inside">
//                     {tradeRecommendation.rationale.map((reason, i) => (
//                       <li key={i}>{reason}</li>
//                     ))}
//                   </ul>
//                 </div>
//               )}

//               {confidenceTrend.length > 1 && (
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <div className="flex items-center space-x-2 mb-2">
//                     <TrendingUp size={20} className="text-green-500" />
//                     <p className="text-sm font-bold text-gray-600">Confidence Trend (Last 24 Hours)</p>
//                   </div>
//                   <p className="text-sm text-gray-900">
//                     Trend: {confidenceTrend[confidenceTrend.length - 1].confidence > confidenceTrend[0].confidence ? 'Increasing' : 'Decreasing'}
//                   </p>
//                   <p className="text-sm text-gray-900">
//                     Change: {(confidenceTrend[confidenceTrend.length - 1].confidence - confidenceTrend[0].confidence).toFixed(0)}%
//                   </p>
//                 </div>
//               )}

//               {userBehavior && (
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <div className="flex items-center space-x-2 mb-2">
//                     <Brain size={20} className="text-green-500" />
//                     <p className="text-sm font-bold text-gray-600">User Behavior Analysis</p>
//                   </div>
//                   <p className="text-sm text-gray-900">Confidence Adjustment: {userBehavior.adjustment}</p>
//                   <ul className="text-sm text-gray-600 list-disc list-inside">
//                     {userBehavior.rationale.map((reason, i) => (
//                       <li key={i}>{reason}</li>
//                     ))}
//                   </ul>
//                 </div>
//               )}

//               {learningStats.tradesAnalyzed > 0 && (
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <div className="flex items-center space-x-2 mb-2">
//                     <Brain size={20} className="text-green-500" />
//                     <p className="text-sm font-bold text-gray-600">Bot Learning Stats</p>
//                   </div>
//                   <p className="text-sm text-gray-900">Success Rate: {learningStats.successRate}%</p>
//                   <p className="text-sm text-gray-900">Trades Analyzed: {learningStats.tradesAnalyzed}</p>
//                 </div>
//               )}

//               {backtestResult && (
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <div className="flex items-center space-x-2 mb-2">
//                     <BarChart2 size={20} className="text-green-500" />
//                     <p className="text-sm font-bold text-gray-600">Backtest Results (Last 30 Days)</p>
//                   </div>
//                   <p className="text-sm text-gray-900">Returns: {backtestResult.returns}%</p>
//                   <p className="text-sm text-gray-900">Number of Trades: {backtestResult.trades}</p>
//                   <p className="text-sm text-gray-900">Final Portfolio Value: ${backtestResult.finalValue}</p>
//                 </div>
//               )}

//               {stopLossTakeProfit && (
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <div className="flex items-center space-x-2 mb-2">
//                     <AlertTriangle size={20} className="text-green-500" />
//                     <p className="text-sm font-bold text-gray-600">Risk Management</p>
//                   </div>
//                   <p className="text-sm text-gray-900">Stop-Loss: ${stopLossTakeProfit.stopLoss}</p>
//                   <p className="text-sm text-gray-900">Take-Profit: ${stopLossTakeProfit.takeProfit}</p>
//                   <p className="text-sm text-gray-900">ATR (14): ${stopLossTakeProfit.atr}</p>
//                 </div>
//               )}

//               {tradeSimulation && (
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <div className="flex items-center space-x-2 mb-2">
//                     <DollarSign size={20} className="text-green-500" />
//                     <p className="text-sm font-bold text-gray-600">Trade Execution Simulation</p>
//                   </div>
//                   <p className="text-sm text-gray-900">Position Size: {tradeSimulation.positionSize} {selectedCoin.symbol.toUpperCase()}</p>
//                   <p className="text-sm text-gray-900">Cost with Fees & Slippage: ${tradeSimulation.costWithFees}</p>
//                   <p className="text-sm text-gray-900">Potential Gain: ${tradeSimulation.potentialGain}</p>
//                   <p className="text-sm text-gray-900">Potential Loss: ${tradeSimulation.potentialLoss}</p>
//                   <p className="text-sm text-gray-900">Risk/Reward Ratio: {tradeSimulation.riskRewardRatio}</p>
//                 </div>
//               )}

//               {orderRouting && (
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <div className="flex items-center space-x-2 mb-2">
//                     <Network size={20} className="text-green-500" />
//                     <p className="text-sm font-bold text-gray-600">Smart Order Routing</p>
//                   </div>
//                   <p className="text-sm text-gray-900">Best DEX: {orderRouting.bestDex}</p>
//                   <p className="text-sm text-gray-900">Savings: ${orderRouting.savings}</p>
//                 </div>
//               )}

//               {portfolioImpact && (
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <div className="flex items-center space-x-2 mb-2">
//                     <DollarSign size={20} className="text-green-500" />
//                     <p className="text-sm font-bold text-gray-600">Portfolio Impact</p>
//                   </div>
//                   <p className="text-sm text-gray-900">Trade Amount: ${portfolioImpact.tradeAmount}</p>
//                   <p className="text-sm text-gray-900">Potential Gain: ${portfolioImpact.potentialGain}</p>
//                   <p className="text-sm text-gray-900">Potential Loss: ${portfolioImpact.potentialLoss}</p>
//                   <p className="text-sm text-gray-900">Portfolio Percentage: {portfolioImpact.portfolioPercentage}%</p>
//                 </div>
//               )}

//               {portfolioRebalance && (
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <div className="flex items-center space-x-2 mb-2">
//                     <DollarSign size={20} className="text-green-500" />
//                     <p className="text-sm font-bold text-gray-600">Portfolio Rebalancing</p>
//                   </div>
//                   <p className="text-sm text-gray-900">Current Allocation: {portfolioRebalance.currentAllocation}%</p>
//                   <p className="text-sm text-gray-900">Target Allocation: {portfolioRebalance.targetAllocation}%</p>
//                   <p className="text-sm text-gray-900">Action: {portfolioRebalance.action}</p>
//                 </div>
//               )}

//               {sentimentHeatmap && (
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <div className="flex items-center space-x-2 mb-2">
//                     <BarChart2 size={20} className="text-green-500" />
//                     <p className="text-sm font-bold text-gray-600">Sentiment Heatmap (Top 5 Coins)</p>
//                   </div>
//                   <div className="grid grid-cols-2 gap-2">
//                     {sentimentHeatmap.map(coin => (
//                       <div
//                         key={coin.id}
//                         className={`p-2 rounded-lg text-sm text-center ${
//                           coin.sentiment >= 70 ? 'bg-green-100 text-green-800' :
//                           coin.sentiment >= 40 ? 'bg-yellow-100 text-yellow-800' :
//                           'bg-red-100 text-red-800'
//                         }`}
//                       >
//                         {coin.symbol.toUpperCase()}: {coin.sentiment.toFixed(0)}/100
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Real-time Sentiment Analytics */}
//           {feature.title === 'Real-time Sentiment Analytics' && selectedCoin && (
//             <div className="space-y-4">
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <p className="text-sm text-gray-600">Sentiment Score</p>
//                 <p className="text-lg font-bold text-gray-900">{sentimentScore}/100</p>
//                 <p className="text-sm text-gray-600 mt-2">
//                   {sentimentScore >= 70 ? 'Positive market sentiment' : sentimentScore >= 40 ? 'Neutral market sentiment' : 'Negative market sentiment'}
//                 </p>
//               </div>
//             </div>
//           )}

//           {/* Predictive Analytics */}
//           {feature.title === 'Predictive Analytics' && selectedCoin && (
//             <div className="space-y-4">
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <p className="text-sm text-gray-600">Price Prediction (7 Days)</p>
//                 <p className="text-lg font-bold text-gray-900">{prediction || 'Generating prediction...'}</p>
//               </div>
//             </div>
//           )}

//           {/* Advanced Security */}
//           {feature.title === 'Advanced Security' && (
//             <div className="space-y-4">
//               <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-line">
//                 <p className="text-sm text-gray-600">Wallet Security Scan</p>
//                 <p className="text-lg font-bold text-gray-900">{scanResult || 'Scanning...'}</p>
//               </div>
//             </div>
//           )}

//           {/* Automated Yield Farming */}
//           {feature.title === 'Automated Yield Farming' && selectedCoin && (
//             <div className="space-y-4">
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <p className="text-sm text-gray-600">Yield Farming Strategy</p>
//                 <p className="text-lg font-bold text-gray-900">{yieldProtocol || 'Calculating optimal protocol...'}</p>
//                 <p className="text-sm text-gray-600 mt-2">
//                   Assets will be allocated to maximize returns on BSC DeFi protocols based on your risk tolerance.
//                 </p>
//               </div>
//             </div>
//           )}

//           {/* Trading Q&A Bot */}
//           {feature.title === 'Trading Q&A Bot' && (
//             <div className="space-y-4">
//               <div className="flex items-center space-x-2 mb-4">
//                 <Bot size={20} className="text-green-500" />
//                 <h3 className="text-lg font-semibold text-gray-900">Ask the Trading Bot</h3>
//               </div>
//               <div className="flex space-x-2">
//                 <input
//                   type="text"
//                   value={question}
//                   onChange={(e) => setQuestion(e.target.value)}
//                   placeholder="e.g., What is a stop-loss?"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
//                 />
//                 <button
//                   onClick={handleAskBot}
//                   disabled={isLoadingBot}
//                   className={`bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 ${
//                     isLoadingBot ? 'opacity-50 cursor-not-allowed' : ''
//                   }`}
//                 >
//                   {isLoadingBot ? 'Processing...' : 'Ask'}
//                 </button>
//               </div>
//               {botAnswer && (
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <p className="text-sm text-gray-600">Bot Response:</p>
//                   <p className="text-sm text-gray-900">{botAnswer}</p>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FeatureModal;

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ethers, formatEther } from 'ethers';
import { X, TrendingUp, AlertTriangle, BarChart2, Bot, DollarSign, Globe, Brain, Newspaper, Zap, Clock, Network, Briefcase } from 'lucide-react';
import CryptoLiveAI from './CryptoLiveAI';

// Import Chart.js via CDN (will be loaded dynamically)
const loadChartJs = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js';
    script.onload = () => resolve(window.Chart);
    document.head.appendChild(script);
  });
};

const FeatureModal = ({ isOpen, onClose, feature, availableCoins, account, provider }) => {
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [priceThreshold, setPriceThreshold] = useState('');
  const [currentPrice, setCurrentPrice] = useState(null);
  const [riskTolerance, setRiskTolerance] = useState('medium');
  const [sentimentScore, setSentimentScore] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [scanResult, setScanResult] = useState('');
  const [yieldProtocol, setYieldProtocol] = useState('');
  const [technicalIndicators, setTechnicalIndicators] = useState(null);
  const [tradeRecommendation, setTradeRecommendation] = useState(null);
  const [backtestResult, setBacktestResult] = useState(null);
  const [stopLossTakeProfit, setStopLossTakeProfit] = useState(null);
  const [portfolioImpact, setPortfolioImpact] = useState(null);
  const [correlationData, setCorrelationData] = useState(null);
  const [macroImpact, setMacroImpact] = useState(null);
  const [sentimentHeatmap, setSentimentHeatmap] = useState(null);
  const [userBehavior, setUserBehavior] = useState(null);
  const [tradeSimulation, setTradeSimulation] = useState(null);
  const [learningStats, setLearningStats] = useState({ successRate: 50, tradesAnalyzed: 0 });
  const [newsSentiment, setNewsSentiment] = useState(null);
  const [volumeBreakout, setVolumeBreakout] = useState(null);
  const [seasonalityData, setSeasonalityData] = useState(null);
  const [orderRouting, setOrderRouting] = useState(null);
  const [portfolioRebalance, setPortfolioRebalance] = useState(null);
  const [confidenceTrend, setConfidenceTrend] = useState([]);
  const [hypeIndex, setHypeIndex] = useState(null);
  const [customStrategy, setCustomStrategy] = useState({
    rsiOverbought: 70,
    rsiOversold: 30,
    sentimentWeight: 0.3,
    macroWeight: 0.2,
  });
  const [question, setQuestion] = useState('');
  const [botAnswer, setBotAnswer] = useState('');
  const [isLoadingBot, setIsLoadingBot] = useState(false);

  // AI Investment Advisor States
  const [investmentGoal, setInvestmentGoal] = useState('Wealth Growth');
  const [timeHorizon, setTimeHorizon] = useState(5);
  const [portfolioAllocation, setPortfolioAllocation] = useState(null);
  const [expectedReturns, setExpectedReturns] = useState(null);
  const [diversificationTip, setDiversificationTip] = useState('');
  const [nextSteps, setNextSteps] = useState([]);

  // User trading history
  const [userTradeHistory, setUserTradeHistory] = useState([]);

  // Chart.js reference
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // Helper to fetch price data
  const fetchPrice = useCallback(async (coinId) => {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinId}`
      );
      const [data] = await response.json();
      setCurrentPrice(data.current_price);
      return data.current_price;
    } catch (err) {
      console.error('Failed to fetch price:', err);
      return null;
    }
  }, []);

  // Helper to fetch historical data
  const fetchHistoricalData = useCallback(async (coinId, days = 90) => {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
      );
      const data = await response.json();
      return {
        prices: data.prices.map(([, price]) => price),
        volumes: data.total_volumes.map(([, volume]) => volume),
      };
    } catch (err) {
      console.error('Failed to fetch historical data:', err);
      return { prices: [], volumes: [] };
    }
  }, []);

  // AI Smart Trading Bots
  useEffect(() => {
    if (isOpen && selectedCoin && feature.title === 'AI Smart Trading Bots') {
      const fetchBotData = async () => {
        try {
          const currentPrice = await fetchPrice(selectedCoin.id);
          if (!currentPrice) return;

          const { prices, volumes } = await fetchHistoricalData(selectedCoin.id, 90);
          if (prices.length < 90 || volumes.length < 90) return;

          const smaPeriod = 14;
          const sma = prices.slice(-smaPeriod).reduce((sum, p) => sum + p, 0) / smaPeriod;

          const gains = [];
          const losses = [];
          for (let i = 1; i < prices.length; i++) {
            const diff = prices[i] - prices[i - 1];
            if (diff >= 0) {
              gains.push(diff);
              losses.push(0);
            } else {
              gains.push(0);
              losses.push(-diff);
            }
          }
          const avgGain = gains.reduce((sum, g) => sum + g, 0) / smaPeriod;
          const avgLoss = losses.reduce((sum, l) => sum + l, 0) / smaPeriod;
          const rs = avgGain / (avgLoss || 1);
          const rsi = 100 - (100 / (1 + rs));

          const ema12 = prices.slice(-26).reduce((acc, p, i) => {
            if (i === 0) return p;
            return p * (2 / (12 + 1)) + acc * (1 - 2 / (12 + 1));
          }, prices[prices.length - 26]);
          const ema26 = prices.slice(-26).reduce((acc, p, i) => {
            if (i === 0) return p;
            return p * (2 / (26 + 1)) + acc * (1 - 2 / (26 + 1));
          }, prices[prices.length - 26]);
          const macd = ema12 - ema26;

          const mean = prices.reduce((sum, p) => sum + p, 0) / prices.length;
          const variance = prices.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / prices.length;
          const volatility = Math.sqrt(variance);

          const x = prices.map((_, i) => i);
          const y = prices;
          const n = prices.length;
          const sumX = x.reduce((sum, val) => sum + val, 0);
          const sumY = y.reduce((sum, val) => sum + val, 0);
          const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
          const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
          const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
          const trend = slope > 0 ? 'Uptrend' : slope < 0 ? 'Downtrend' : 'Sideways';

          const volumeToMarketCap = selectedCoin.total_volume / selectedCoin.market_cap;
          const liquidityScore = volumeToMarketCap > 0.05 ? 'High' : volumeToMarketCap > 0.02 ? 'Medium' : 'Low';

          const priceChange = selectedCoin.price_change_percentage_24h || 0;
          let sentiment = priceChange > 0
            ? 75 + Math.min(priceChange * 5, 25)
            : 25 + Math.max(priceChange * 5, -25);
          const socialSentiment = Math.random() * 20 - 10;
          sentiment = Math.min(100, Math.max(0, sentiment + socialSentiment));

          const avgVolume = volumes.slice(-30).reduce((sum, v) => sum + v, 0) / 30;
          const recentVolume = volumes[volumes.length - 1];
          const volumeSpike = recentVolume / avgVolume;
          const breakoutSignal = volumeSpike > 2 && slope > 0 ? 'Bullish Breakout' : volumeSpike > 2 && slope < 0 ? 'Bearish Breakout' : 'No Breakout';
          setVolumeBreakout({
            spike: volumeSpike.toFixed(2),
            signal: breakoutSignal,
          });

          const btcPrices = (await fetchHistoricalData('bitcoin', 90)).prices;
          if (btcPrices.length === prices.length) {
            const btcMean = btcPrices.reduce((sum, p) => sum + p, 0) / btcPrices.length;
            const coinMean = mean;
            const covariance = prices.reduce((sum, p, i) => sum + (p - coinMean) * (btcPrices[i] - btcMean), 0) / prices.length;
            const btcStdDev = Math.sqrt(btcPrices.reduce((sum, p) => sum + Math.pow(p - btcMean, 2), 0) / btcPrices.length);
            const coinStdDev = volatility;
            const correlation = covariance / (btcStdDev * coinStdDev);
            setCorrelationData({
              btcCorrelation: correlation.toFixed(2),
              interpretation: correlation > 0.7 ? 'Strongly Correlated with BTC' : correlation < -0.7 ? 'Inversely Correlated with BTC' : 'Low Correlation with BTC',
            });
          }

          const date = new Date('2025-05-25T00:47:00+05:30'); // Updated to 12:47 AM IST
          const isWeekend = date.getDay() === 6 || date.getDay() === 0;
          const simulatedInterestRate = 5.0;
          const simulatedInflation = 3.2;
          let macroScore = 0;
          let macroRationale = [];
          if (simulatedInterestRate > 5) {
            macroScore -= 20;
            macroRationale.push('High interest rates may reduce crypto demand');
          }
          if (simulatedInflation > 3) {
            macroScore += 15;
            macroRationale.push('High inflation may drive crypto adoption');
          }
          if (isWeekend) {
            macroScore -= 10;
            macroRationale.push('Weekend trading may have lower volume and higher volatility');
          }
          setMacroImpact({ score: macroScore, rationale: macroRationale });

          const simulatedNews = [
            { headline: 'Bitcoin ETF Approval Likely', sentiment: 0.8 },
            { headline: 'Regulatory Crackdown on Crypto', sentiment: -0.6 },
          ];
          const newsImpact = simulatedNews.reduce((sum, news) => sum + news.sentiment, 0) / simulatedNews.length;
          setNewsSentiment({
            score: (newsImpact * 50 + 50).toFixed(0),
            headlines: simulatedNews.map(n => n.headline),
          });

          const monthPerformance = prices.length > 60 ? ((prices[prices.length - 1] - prices[prices.length - 30]) / prices[prices.length - 30] * 100).toFixed(2) : 0;
          const dayPerformance = prices.length > 2 ? ((prices[prices.length - 1] - prices[prices.length - 2]) / prices[prices.length - 2] * 100).toFixed(2) : 0;
          const hour = date.getHours();
          const timePerformance = hour >= 9 && hour <= 17 ? 'Normal Trading Hours' : 'After-Hours (Higher Volatility)';
          setSeasonalityData({
            monthPerformance,
            dayPerformance,
            timePerformance,
            note: isWeekend ? `${selectedCoin.symbol.toUpperCase()} has historically dipped on weekends` : 'No significant weekend pattern',
          });

          const mentions = Math.floor(Math.random() * 1000) + 500;
          const hypeScore = Math.min(100, mentions / 10);
          setHypeIndex({
            score: hypeScore.toFixed(0),
            mentions,
          });

          let recommendation = '';
          let confidence = 50;
          let rationale = [];

          const rsiOverbought = customStrategy.rsiOverbought;
          const rsiOversold = customStrategy.rsiOversold;
          if (rsi > rsiOverbought && trend === 'Downtrend' && macd < 0) {
            recommendation = 'Sell';
            confidence = 85;
            rationale.push(`RSI (${rsi.toFixed(2)}) indicates overbought (threshold: ${rsiOverbought})`, 'Downtrend with bearish MACD');
          } else if (rsi < rsiOversold && trend === 'Uptrend' && macd > 0) {
            recommendation = 'Buy';
            confidence = 85;
            rationale.push(`RSI (${rsi.toFixed(2)}) indicates oversold (threshold: ${rsiOversold})`, 'Uptrend with bullish MACD');
          } else if (sentiment > 70 && trend === 'Uptrend' && liquidityScore !== 'Low') {
            recommendation = 'Buy';
            confidence = 70;
            rationale.push('Positive sentiment', 'Uptrend with good liquidity');
          } else if (sentiment < 30 && trend === 'Downtrend') {
            recommendation = 'Sell';
            confidence = 70;
            rationale.push('Negative sentiment', 'Downtrend detected');
          } else {
            recommendation = 'Hold';
            confidence = 60;
            rationale.push('No clear signal');
          }

          const volatilityFactor = volatility / mean;
          confidence = Math.max(40, confidence - volatilityFactor * 100);
          if (riskTolerance === 'low' && volatilityFactor > 0.1) {
            confidence -= 15;
            rationale.push('High volatility may not suit low risk tolerance');
          } else if (riskTolerance === 'high') {
            confidence += 10;
            rationale.push('High risk tolerance aligns with market conditions');
          }

          confidence = Math.max(40, confidence + macroImpact.score * customStrategy.macroWeight);
          rationale.push(...macroImpact.rationale);

          const newsAdjustment = (newsSentiment.score - 50) * 0.2;
          confidence = Math.max(40, confidence + newsAdjustment);
          rationale.push(`News sentiment adjustment: ${newsAdjustment.toFixed(0)}%`);

          if (volumeBreakout.signal === 'Bullish Breakout') {
            confidence += 10;
            rationale.push('Bullish volume breakout detected');
          } else if (volumeBreakout.signal === 'Bearish Breakout') {
            confidence -= 10;
            rationale.push('Bearish volume breakout detected');
          }

          if (seasonalityData.monthPerformance < 0) {
            confidence -= 5;
            rationale.push(`Negative performance this month: ${seasonalityData.monthPerformance}%`);
          }
          if (seasonalityData.timePerformance === 'After-Hours (Higher Volatility)') {
            confidence -= 5;
            rationale.push('After-hours trading may increase volatility');
          }

          if (hypeIndex.score > 80) {
            confidence += 5;
            rationale.push('High social media hype may drive price movement');
          } else if (hypeIndex.score < 20) {
            confidence -= 5;
            rationale.push('Low social media hype may indicate lack of interest');
          }

          const simulatedBehavior = userTradeHistory.length > 0 ? userTradeHistory[userTradeHistory.length - 1] : null;
          let behaviorAdjustment = 0;
          let behaviorRationale = [];
          if (simulatedBehavior) {
            if (simulatedBehavior.action === 'Buy' && recommendation === 'Sell') {
              behaviorAdjustment -= 5;
              behaviorRationale.push('Recent buy may indicate hesitation to sell');
            } else if (simulatedBehavior.action === 'Sell' && recommendation === 'Buy') {
              behaviorAdjustment -= 5;
              behaviorRationale.push('Recent sell may indicate hesitation to buy');
            }
          }
          confidence = Math.max(40, confidence + behaviorAdjustment);
          setUserBehavior({ adjustment: behaviorAdjustment, rationale: behaviorRationale });

          if (learningStats.tradesAnalyzed > 0) {
            const successAdjustment = learningStats.successRate > 60 ? 5 : learningStats.successRate < 40 ? -5 : 0;
            confidence = Math.max(40, confidence + successAdjustment);
            rationale.push(`Bot confidence adjusted by past performance (${learningStats.successRate}% success rate)`);
          }

          const sentimentAdjustment = (sentiment - 50) * customStrategy.sentimentWeight;
          confidence = Math.max(40, confidence + sentimentAdjustment);
          rationale.push(`Sentiment adjustment: ${sentimentAdjustment.toFixed(0)}%`);

          setConfidenceTrend(prev => {
            const newTrend = [...prev, { timestamp: new Date().toISOString(), confidence }].slice(-24);
            return newTrend;
          });

          setTechnicalIndicators({
            sma: sma.toFixed(2),
            rsi: rsi.toFixed(2),
            macd: macd.toFixed(2),
            volatility: volatility.toFixed(2),
            trend,
            liquidityScore,
          });

          setTradeRecommendation({
            action: recommendation,
            confidence: confidence.toFixed(0),
            rationale,
          });

          const backtestPrices = prices.slice(-30);
          let balance = 10000;
          let position = 0;
          let trades = 0;
          for (let i = 1; i < backtestPrices.length; i++) {
            const prevPrice = backtestPrices[i - 1];
            const currPrice = backtestPrices[i];
            const miniPrices = backtestPrices.slice(Math.max(0, i - 14), i);
            const miniGains = [];
            const miniLosses = [];
            for (let j = 1; j < miniPrices.length; j++) {
              const diff = miniPrices[j] - miniPrices[j - 1];
              if (diff >= 0) miniGains.push(diff);
              else miniLosses.push(-diff);
            }
            const miniAvgGain = miniGains.reduce((sum, g) => sum + g, 0) / 14;
            const miniAvgLoss = miniLosses.reduce((sum, l) => sum + l, 0) / 14;
            const miniRs = miniAvgGain / (miniAvgLoss || 1);
            const miniRsi = 100 - (100 / (1 + miniRs));

            if (miniRsi < customStrategy.rsiOversold && position === 0) {
              position = balance / prevPrice;
              balance = 0;
              trades++;
            } else if (miniRsi > customStrategy.rsiOverbought && position > 0) {
              balance = position * currPrice;
              position = 0;
              trades++;
            }
          }
          const finalValue = balance + (position * currentPrice);
          const returns = ((finalValue - 10000) / 10000 * 100).toFixed(2);
          setBacktestResult({
            returns,
            trades,
            finalValue: finalValue.toFixed(2),
          });

          const atrPeriod = 14;
          const priceRanges = [];
          for (let i = 1; i < prices.length; i++) {
            const highLow = Math.abs(prices[i] - prices[i - 1]);
            priceRanges.push(highLow);
          }
          const atr = priceRanges.slice(-atrPeriod).reduce((sum, r) => sum + r, 0) / atrPeriod;
          const multiplier = riskTolerance === 'low' ? 1.5 : riskTolerance === 'medium' ? 2 : 3;
          const stopLoss = recommendation === 'Buy'
            ? (currentPrice - atr * multiplier).toFixed(2)
            : (currentPrice + atr * multiplier).toFixed(2);
          const takeProfit = recommendation === 'Buy'
            ? (currentPrice + atr * multiplier * 1.5).toFixed(2)
            : (currentPrice - atr * multiplier * 1.5).toFixed(2);
          setStopLossTakeProfit({
            stopLoss,
            takeProfit,
            atr: atr.toFixed(2),
          });

          const walletBalance = await provider.getBalance(account);
          const formattedBalance = parseFloat(formatEther(walletBalance));
          const portfolioValue = formattedBalance * currentPrice;
          const riskPercentage = riskTolerance === 'low' ? 0.01 : riskTolerance === 'medium' ? 0.02 : 0.05;
          const riskAmount = portfolioValue * riskPercentage;
          const stopLossDistance = recommendation === 'Buy'
            ? currentPrice - parseFloat(stopLoss)
            : parseFloat(stopLoss) - currentPrice;
          const positionSize = (riskAmount / stopLossDistance).toFixed(2);

          const tradingFee = 0.001;
          const slippage = volatilityFactor > 0.1 ? 0.005 : 0.002;
          const dexOptions = [
            { name: 'PancakeSwap', fee: 0.0025, priceImpact: 0.003 },
            { name: 'SushiSwap', fee: 0.003, priceImpact: 0.002 },
            { name: 'UniSwap', fee: 0.003, priceImpact: 0.004 },
          ];
          const bestDex = dexOptions.reduce((best, dex) => {
            const totalCost = positionSize * currentPrice * (1 + dex.fee + dex.priceImpact);
            return totalCost < (best.totalCost || Infinity) ? { ...dex, totalCost } : best;
          }, {});
          const costWithFees = positionSize * currentPrice * (1 + bestDex.fee + bestDex.priceImpact);
          const potentialGain = recommendation === 'Buy'
            ? (parseFloat(takeProfit) - currentPrice) * positionSize * (1 - bestDex.fee - bestDex.priceImpact)
            : (currentPrice - parseFloat(takeProfit)) * positionSize * (1 - bestDex.fee - bestDex.priceImpact);
          const potentialLoss = recommendation === 'Buy'
            ? (currentPrice - parseFloat(stopLoss)) * positionSize * (1 + bestDex.fee + bestDex.priceImpact)
            : (parseFloat(stopLoss) - currentPrice) * positionSize * (1 + bestDex.fee + bestDex.priceImpact);
          setOrderRouting({
            bestDex: bestDex.name,
            savings: ((positionSize * currentPrice * (dexOptions[0].fee + dexOptions[0].priceImpact) - bestDex.totalCost) / currentPrice).toFixed(2),
          });
          setTradeSimulation({
            positionSize,
            costWithFees: costWithFees.toFixed(2),
            potentialGain: potentialGain.toFixed(2),
            potentialLoss: potentialLoss.toFixed(2),
            riskRewardRatio: (potentialGain / (potentialLoss || 1)).toFixed(2),
          });

          const tradeAmount = positionSize * currentPrice;
          setPortfolioImpact({
            tradeAmount: tradeAmount.toFixed(2),
            potentialLoss: potentialLoss.toFixed(2),
            potentialGain: potentialGain.toFixed(2),
            portfolioPercentage: ((tradeAmount / portfolioValue) * 100).toFixed(2),
          });

          const targetAllocation = riskTolerance === 'low' ? 0.05 : riskTolerance === 'medium' ? 0.1 : 0.2;
          const currentAllocation = tradeAmount / portfolioValue;
          const rebalanceAction = currentAllocation > targetAllocation
            ? `Reduce ${selectedCoin.symbol.toUpperCase()} allocation by ${((currentAllocation - targetAllocation) * 100).toFixed(2)}%`
            : currentAllocation < targetAllocation
            ? `Increase ${selectedCoin.symbol.toUpperCase()} allocation by ${((targetAllocation - currentAllocation) * 100).toFixed(2)}%`
            : 'Allocation within target range';
          setPortfolioRebalance({
            currentAllocation: (currentAllocation * 100).toFixed(2),
            targetAllocation: (targetAllocation * 100).toFixed(2),
            action: rebalanceAction,
          });

          const heatmapData = await Promise.all(
            availableCoins.slice(0, 5).map(async (coin) => {
              const coinPrices = (await fetchHistoricalData(coin.id, 90)).prices;
              if (coinPrices.length < 90) return { id: coin.id, sentiment: 50 };
              const coinPriceChange = coin.price_change_percentage_24h || 0;
              let coinSentiment = coinPriceChange > 0
                ? 75 + Math.min(coinPriceChange * 5, 25)
                : 25 + Math.max(coinPriceChange * 5, -25);
              coinSentiment = Math.min(100, Math.max(0, coinSentiment + (Math.random() * 20 - 10)));
              return { id: coin.id, symbol: coin.symbol, sentiment: coinSentiment };
            })
          );
          setSentimentHeatmap(heatmapData);

          if (userTradeHistory.length > 0) {
            const successfulTrades = userTradeHistory.filter(trade => trade.outcome === 'Profit').length;
            setLearningStats({
              successRate: (successfulTrades / userTradeHistory.length * 100).toFixed(2),
              tradesAnalyzed: userTradeHistory.length,
            });
          }

          if (priceThreshold && currentPrice < parseFloat(priceThreshold)) {
            alert(`Bot Signal: Buy ${selectedCoin.symbol.toUpperCase()} at $${currentPrice.toFixed(2)} (below $${priceThreshold})`);
            setUserTradeHistory(prev => [
              ...prev,
              { action: 'Buy', price: currentPrice, timestamp: new Date().toISOString(), outcome: 'Pending' }
            ]);
          }
        } catch (err) {
          console.error('AI Smart Trading Bot error:', err);
        }
      };

      fetchBotData();
      const interval = setInterval(fetchBotData, 60000);
      return () => clearInterval(interval);
    }
  }, [isOpen, selectedCoin, priceThreshold, feature, riskTolerance, account, provider, fetchPrice, fetchHistoricalData, userTradeHistory, customStrategy]);

  // Confidence Trend Graph
  useEffect(() => {
    if (isOpen && feature.title === 'AI Smart Trading Bots' && confidenceTrend.length > 1) {
      const initChart = async () => {
        const Chart = await loadChartJs();
        const ctx = chartRef.current?.getContext('2d');
        if (!ctx) return;

        // Destroy previous chart instance if it exists
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }

        // Prepare data for the chart
        const labels = confidenceTrend.map(item => {
          const date = new Date(item.timestamp);
          return `${date.getHours()}:${date.getMinutes()}`;
        });
        const data = confidenceTrend.map(item => item.confidence);

        chartInstanceRef.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels,
            datasets: [{
              label: 'Confidence Trend (%)',
              data,
              borderColor: '#10B981', // Green to match theme
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              fill: true,
              tension: 0.3,
              pointRadius: 3,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Time (Last 24 Hours)',
                },
              },
              y: {
                min: 0,
                max: 100,
                title: {
                  display: true,
                  text: 'Confidence (%)',
                },
              },
            },
            plugins: {
              legend: {
                display: true,
                position: 'top',
              },
            },
          },
        });
      };

      initChart();

      // Cleanup on unmount
      return () => {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
          chartInstanceRef.current = null;
        }
      };
    }
  }, [isOpen, feature, confidenceTrend]);

  // Real-time Sentiment Analytics
  useEffect(() => {
    if (isOpen && selectedCoin && feature.title === 'Real-time Sentiment Analytics') {
      const calculateSentiment = () => {
        const priceChange = selectedCoin.price_change_percentage_24h || 0;
        let score = priceChange > 0
          ? 75 + Math.min(priceChange * 5, 25)
          : 25 + Math.max(priceChange * 5, -25);
        const socialSentiment = Math.random() * 20 - 10;
        score = Math.min(100, Math.max(0, score + socialSentiment));
        setSentimentScore(score.toFixed(0));
      };
      calculateSentiment();
    }
  }, [isOpen, selectedCoin, feature]);

  // Predictive Analytics
  useEffect(() => {
    if (isOpen && selectedCoin && feature.title === 'Predictive Analytics') {
      const generatePrediction = async () => {
        try {
          const { prices } = await fetchHistoricalData(selectedCoin.id, 30);
          if (prices.length < 30) {
            setPrediction('Insufficient data for prediction');
            return;
          }
          const avg = prices.reduce((sum, p) => sum + p, 0) / prices.length;
          const trend = prices[prices.length - 1] > avg ? 'rise' : 'fall';
          const change = Math.abs((prices[prices.length - 1] - avg) / avg * 100).toFixed(2);
          const mean = prices.reduce((sum, p) => sum + p, 0) / prices.length;
          const variance = prices.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / prices.length;
          const volatility = Math.sqrt(variance).toFixed(2);
          const confidence = Math.max(50, 100 - volatility / mean * 100).toFixed(0);
          setPrediction(
            `${selectedCoin.symbol.toUpperCase()} likely to ${trend} ${change}% in 7 days (Confidence: ${confidence}%, Volatility: $${volatility})`
          );
        } catch (err) {
          setPrediction('Unable to generate prediction');
        }
      };
      generatePrediction();
    }
  }, [isOpen, selectedCoin, feature, fetchHistoricalData]);

  // Advanced Security
  useEffect(() => {
    if (isOpen && feature.title === 'Advanced Security' && account && provider) {
      const scanWallet = async () => {
        try {
          const balance = await provider.getBalance(account);
          const formattedBalance = formatEther(balance);
          const blockNumber = await provider.getBlockNumber();
          const transactions = [];
          for (let i = 0; i < 5 && blockNumber - i >= 0; i++) {
            const block = await provider.getBlock(blockNumber - i, true);
            const txs = block.transactions.filter(tx => 
              tx.from.toLowerCase() === account.toLowerCase() || 
              (tx.to && tx.to.toLowerCase() === account.toLowerCase())
            );
            transactions.push(...txs);
          }
          const transactionSummary = transactions.length > 0
            ? `Recent Transactions: ${transactions.length} in last 5 blocks`
            : 'No recent transactions found';
          setScanResult(`Wallet Balance: ${formattedBalance} BNB\n${transactionSummary}`);
        } catch (err) {
          setScanResult(`Scan failed: ${err.message}`);
        }
      };
      scanWallet();
    }
  }, [isOpen, feature, account, provider]);

  // Automated Yield Farming
  useEffect(() => {
    if (isOpen && selectedCoin && feature.title === 'Automated Yield Farming') {
      const protocols = [
        { name: 'PancakeSwap', baseApy: 15, risk: 'Low' },
        { name: 'Venus', baseApy: 20, risk: 'Medium' },
        { name: 'BakerySwap', baseApy: 25, risk: 'High' },
      ];
      const optimalProtocol = protocols.reduce((best, protocol) => {
        let apy = protocol.baseApy + Math.random() * 5;
        if (riskTolerance === 'low' && protocol.risk === 'Low') apy += 5;
        if (riskTolerance === 'medium' && protocol.risk === 'Medium') apy += 5;
        if (riskTolerance === 'high' && protocol.risk === 'High') apy += 5;
        return apy > (best.apy || 0) ? { ...protocol, apy } : best;
      }, {});
      setYieldProtocol(
        `Optimal Protocol: ${optimalProtocol.name} (Estimated APY: ${optimalProtocol.apy.toFixed(2)}%, Risk: ${optimalProtocol.risk})`
      );
    }
  }, [isOpen, selectedCoin, feature, riskTolerance]);

  // AI Investment Advisor
  useEffect(() => {
    if (isOpen && feature.title === 'AI Investment Advisor') {
      const calculatePortfolio = () => {
        let allocation = { crypto: 0, stocks: 0, bonds: 0 };
        let annualReturn = 0;
        let riskLevel = '';
        let diversificationTip = '';
        let steps = [];

        // Determine allocation based on inputs
        if (investmentGoal === 'Retirement') {
          if (timeHorizon >= 10) {
            allocation = riskTolerance === 'low'
              ? { crypto: 10, stocks: 40, bonds: 50 }
              : riskTolerance === 'medium'
              ? { crypto: 20, stocks: 50, bonds: 30 }
              : { crypto: 30, stocks: 50, bonds: 20 };
          } else {
            allocation = riskTolerance === 'low'
              ? { crypto: 5, stocks: 35, bonds: 60 }
              : riskTolerance === 'medium'
              ? { crypto: 15, stocks: 45, bonds: 40 }
              : { crypto: 25, stocks: 45, bonds: 30 };
          }
        } else if (investmentGoal === 'Wealth Growth') {
          allocation = riskTolerance === 'low'
            ? { crypto: 20, stocks: 50, bonds: 30 }
            : riskTolerance === 'medium'
            ? { crypto: 30, stocks: 50, bonds: 20 }
            : { crypto: 40, stocks: 50, bonds: 10 };
        } else if (investmentGoal === 'Short-term Gains') {
          allocation = riskTolerance === 'low'
            ? { crypto: 30, stocks: 50, bonds: 20 }
            : riskTolerance === 'medium'
            ? { crypto: 40, stocks: 50, bonds: 10 }
            : { crypto: 60, stocks: 30, bonds: 10 };
        }

        // Calculate expected returns and risk
        if (riskTolerance === 'low') {
          annualReturn = allocation.crypto * 0.08 + allocation.stocks * 0.06 + allocation.bonds * 0.03;
          riskLevel = 'Low (Volatility: ~5%)';
        } else if (riskTolerance === 'medium') {
          annualReturn = allocation.crypto * 0.12 + allocation.stocks * 0.08 + allocation.bonds * 0.03;
          riskLevel = 'Medium (Volatility: ~10%)';
        } else {
          annualReturn = allocation.crypto * 0.15 + allocation.stocks * 0.10 + allocation.bonds * 0.03;
          riskLevel = 'High (Volatility: ~15%)';
        }

        // Diversification tip
        if (selectedCoin) {
          const cryptoAllocation = allocation.crypto;
          diversificationTip = cryptoAllocation > 50
            ? `Your portfolio is heavily weighted towards crypto (${selectedCoin.symbol.toUpperCase()}). Consider diversifying into stable assets like bonds or ETFs to reduce risk.`
            : `Your allocation to ${selectedCoin.symbol.toUpperCase()} (${cryptoAllocation}%) is balanced. Consider adding uncorrelated assets like real estate or commodities for further diversification.`;
        } else {
          diversificationTip = 'Select a cryptocurrency to get a tailored diversification tip.';
        }

        // Actionable steps
        if (allocation.crypto > 0) {
          steps.push(`Allocate ${allocation.crypto}% to crypto. Consider staking in low-risk protocols like Aave or Compound for steady returns.`);
        }
        if (allocation.stocks > 0) {
          steps.push(`Allocate ${allocation.stocks}% to stocks. Invest in a diversified ETF like S&P 500 for broad market exposure.`);
        }
        if (allocation.bonds > 0) {
          steps.push(`Allocate ${allocation.bonds}% to bonds. Look into government bonds or bond ETFs for stability.`);
        }
        if (timeHorizon < 5) {
          steps.push('Short time horizon: Prioritize liquidity. Keep some funds in stablecoins or cash equivalents.');
        }

        setPortfolioAllocation(allocation);
        setExpectedReturns({
          annualReturn: annualReturn.toFixed(2),
          riskLevel,
        });
        setDiversificationTip(diversificationTip);
        setNextSteps(steps);
      };

      calculatePortfolio();
    }
  }, [isOpen, feature, investmentGoal, timeHorizon, riskTolerance, selectedCoin]);

  // Trading Q&A Bot
  const handleAskBot = async () => {
    if (!question.trim()) return;
    setIsLoadingBot(true);
    setBotAnswer('');

    try {
      const lowerQuestion = question.toLowerCase();
      let answer = '';

      if (lowerQuestion.includes('what is a stop-loss')) {
        answer = 'A stop-loss is an order to sell a security when it reaches a certain price to limit losses. For example, if you buy a stock at $100 and set a stop-loss at $90, it will sell automatically if the price drops to $90, capping your loss at 10%.';
      } else if (lowerQuestion.includes('how to read candlestick charts')) {
        answer = 'Candlestick charts show price movements over time. Each candlestick represents the open, close, high, and low prices for a period. Green candles indicate the close was higher than the open (bullish), while red candles show the close was lower (bearish). Wicks show the high and low. Patterns like Doji or Engulfing can signal reversals.';
      } else if (lowerQuestion.includes('what is rsi')) {
        answer = 'The Relative Strength Index (RSI) measures momentum on a scale of 0 to 100. Above 70 indicates overbought conditions (potential sell), below 30 indicates oversold (potential buy). It’s calculated as RSI = 100 - (100 / (1 + RS)), where RS is the average gain divided by average loss over 14 periods.';
      } else if (lowerQuestion.includes('should i invest in bitcoin')) {
        answer = `Investing in Bitcoin depends on your risk tolerance. As of May 25, 2025, its price is $${currentPrice || 'unknown'}. Bitcoin is volatile but has growth potential. Pros: decentralized, growing adoption. Cons: regulatory risks, price swings. With ${riskTolerance} risk tolerance, consider allocating 5-10% of your portfolio and diversifying.`;
      } else if (lowerQuestion.includes('what is diversification')) {
        answer = 'Diversification spreads investments across assets to reduce risk. For example, invest in stocks, crypto, bonds, and real estate across sectors. This minimizes losses if one asset underperforms. Aim for assets with low correlation.';
      } else if (lowerQuestion.includes('what is a pe ratio')) {
        answer = 'The Price-to-Earnings (P/E) ratio is a stock valuation metric: stock price divided by earnings per share (EPS). A high P/E (e.g., 30) may indicate overvaluation or high growth expectations, while a low P/E (e.g., 10) may suggest undervaluation. Compare to the industry average.';
      } else if (lowerQuestion.includes('what is yield farming')) {
        answer = 'Yield farming involves staking crypto in DeFi protocols to earn rewards, like interest or tokens. For example, staking in PancakeSwap liquidity pools can yield 5-100% APY. Risks include impermanent loss, smart contract bugs, and volatility. Research protocols thoroughly.';
      } else {
        answer = 'I’m not sure how to answer that. Could you rephrase or ask another trading-related question?';
      }

      setBotAnswer(answer);
    } catch (err) {
      setBotAnswer('Error: Unable to generate a response. Please try again.');
    } finally {
      setIsLoadingBot(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="text-green-500">{feature.icon}</div>
            <h2 className="text-xl font-bold text-gray-900">{feature.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        <div className="p-6">
          <p className="text-gray-600 mb-6">{feature.description}</p>

          {/* Real-Time Market Insights */}
          {feature.title === 'Real-Time Market Insights' && (
            <div className="w-full h-[600px] overflow-auto">
              <CryptoLiveAI availableCoins={availableCoins} />
            </div>
          )}

          {/* Coin Selection */}
          {(feature.title === 'AI Smart Trading Bots' ||
            feature.title === 'Real-time Sentiment Analytics' ||
            feature.title === 'Predictive Analytics' ||
            feature.title === 'Automated Yield Farming' ||
            feature.title === 'AI Investment Advisor') && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Cryptocurrency</label>
              <select
                value={selectedCoin?.id || ''}
                onChange={(e) => {
                  const coin = availableCoins.find(c => c.id === e.target.value);
                  setSelectedCoin(coin || null);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select Coin</option>
                {availableCoins.map(coin => (
                  <option key={coin.id} value={coin.id}>
                    {coin.name} ({coin.symbol.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Risk Tolerance Selection */}
          {(feature.title === 'AI Smart Trading Bots' || feature.title === 'AI Investment Advisor') && (
            <div className="mb-6">
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
          )}

          {/* Custom Strategy Builder */}
          {feature.title === 'AI Smart Trading Bots' && (
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Zap size={20} className="text-green-500" />
                <p className="text-sm font-bold text-gray-600">Custom Strategy Builder</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700">RSI Overbought Threshold</label>
                  <input
                    type="number"
                    value={customStrategy.rsiOverbought}
                    onChange={(e) => setCustomStrategy({ ...customStrategy, rsiOverbought: parseFloat(e.target.value) })}
                    className="w-full px-2 py-1 border border-gray-300 rounded-lg"
                    min="50"
                    max="100"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">RSI Oversold Threshold</label>
                  <input
                    type="number"
                    value={customStrategy.rsiOversold}
                    onChange={(e) => setCustomStrategy({ ...customStrategy, rsiOversold: parseFloat(e.target.value) })}
                    className="w-full px-2 py-1 border border-gray-300 rounded-lg"
                    min="0"
                    max="50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">Sentiment Weight</label>
                  <input
                    type="number"
                    value={customStrategy.sentimentWeight}
                    onChange={(e) => setCustomStrategy({ ...customStrategy, sentimentWeight: parseFloat(e.target.value) })}
                    className="w-full px-2 py-1 border border-gray-300 rounded-lg"
                    min="0"
                    max="1"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">Macro Weight</label>
                  <input
                    type="number"
                    value={customStrategy.macroWeight}
                    onChange={(e) => setCustomStrategy({ ...customStrategy, macroWeight: parseFloat(e.target.value) })}
                    className="w-full px-2 py-1 border border-gray-300 rounded-lg"
                    min="0"
                    max="1"
                    step="0.1"
                  />
                </div>
              </div>
            </div>
          )}

          {/* AI Smart Trading Bots */}
          {feature.title === 'AI Smart Trading Bots' && selectedCoin && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Threshold (USD)</label>
                <input
                  type="number"
                  value={priceThreshold}
                  onChange={(e) => setPriceThreshold(e.target.value)}
                  placeholder="e.g., 500"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
                <p className="text-sm text-gray-500 mt-1">Bot will buy when price drops below this value</p>
              </div>

              {currentPrice && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Current Price</p>
                  <p className="text-lg font-bold text-gray-900">${currentPrice.toFixed(2)}</p>
                </div>
              )}

              {technicalIndicators && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <BarChart2 size={20} className="text-green-500" />
                    <p className="text-sm font-bold text-gray-600">Technical Indicators</p>
                  </div>
                  <p className="text-sm text-gray-900">14-Day SMA: ${technicalIndicators.sma}</p>
                  <p className="text-sm text-gray-900">RSI: ${technicalIndicators.rsi}</p>
                  <p className="text-sm text-gray-900">MACD: ${technicalIndicators.macd}</p>
                  <p className="text-sm text-gray-900">Volatility: $${technicalIndicators.volatility}</p>
                  <p className="text-sm text-gray-900">Trend: ${technicalIndicators.trend}</p>
                  <p className="text-sm text-gray-900">Liquidity: ${technicalIndicators.liquidityScore}</p>
                </div>
              )}

              {volumeBreakout && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap size={20} className="text-green-500" />
                    <p className="text-sm font-bold text-gray-600">Volume Breakout Detection</p>
                  </div>
                  <p className="text-sm text-gray-900">Volume Spike: ${volumeBreakout.spike}x average</p>
                  <p className="text-sm text-gray-900">Signal: ${volumeBreakout.signal}</p>
                </div>
              )}

              {correlationData && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Globe size={20} className="text-green-500" />
                    <p className="text-sm font-bold text-gray-600">Market Correlation</p>
                  </div>
                  <p className="text-sm text-gray-900">BTC Correlation: ${correlationData.btcCorrelation}</p>
                  <p className="text-sm text-gray-600">${correlationData.interpretation}</p>
                </div>
              )}

              {macroImpact && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Globe size={20} className="text-green-500" />
                    <p className="text-sm font-bold text-gray-600">Macroeconomic Impact</p>
                  </div>
                  <p className="text-sm text-gray-900">Macro Score Adjustment: ${macroImpact.score}</p>
                  <ul className="text-sm text-gray-600 list-disc list-inside">
                    {macroImpact.rationale.map((reason, i) => (
                      <li key={i}>{reason}</li>
                    ))}
                  </ul>
                </div>
              )}

              {newsSentiment && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Newspaper size={20} className="text-green-500" />
                    <p className="text-sm font-bold text-gray-600">News Sentiment</p>
                  </div>
                  <p className="text-sm text-gray-900">News Sentiment Score: ${newsSentiment.score}/100</p>
                  <p className="text-sm text-gray-600">Recent Headlines:</p>
                  <ul className="text-sm text-gray-600 list-disc list-inside">
                    {newsSentiment.headlines.map((headline, i) => (
                      <li key={i}>{headline}</li>
                    ))}
                  </ul>
                </div>
              )}

              {seasonalityData && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock size={20} className="text-green-500" />
                    <p className="text-sm font-bold text-gray-600">Seasonality & Time Patterns</p>
                  </div>
                  <p className="text-sm text-gray-900">Month Performance: ${seasonalityData.monthPerformance}%</p>
                  <p className="text-sm text-gray-900">Day Performance: ${seasonalityData.dayPerformance}%</p>
                  <p className="text-sm text-gray-900">Time: ${seasonalityData.timePerformance}</p>
                  <p className="text-sm text-gray-600">${seasonalityData.note}</p>
                </div>
              )}

              {hypeIndex && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap size={20} className="text-green-500" />
                    <p className="text-sm font-bold text-gray-600">Social Media Hype Index</p>
                  </div>
                  <p className="text-sm text-gray-900">Hype Score: ${hypeIndex.score}/100</p>
                  <p className="text-sm text-gray-900">Mentions: ${hypeIndex.mentions}</p>
                </div>
              )}

              {tradeRecommendation && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp size={20} className="text-green-500" />
                    <p className="text-sm font-bold text-gray-600">Trade Recommendation</p>
                  </div>
                  <p className={`text-lg font-bold ${tradeRecommendation.action === 'Buy' ? 'text-green-600' : tradeRecommendation.action === 'Sell' ? 'text-red-600' : 'text-gray-600'}`}>
                    Action: ${tradeRecommendation.action}
                  </p>
                  <p className="text-sm text-gray-900">Confidence: ${tradeRecommendation.confidence}%</p>
                  <p className="text-sm text-gray-600 mt-2">Rationale:</p>
                  <ul className="text-sm text-gray-600 list-disc list-inside">
                    {tradeRecommendation.rationale.map((reason, i) => (
                      <li key={i}>{reason}</li>
                    ))}
                  </ul>
                </div>
              )}

              {confidenceTrend.length > 1 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp size={20} className="text-green-500" />
                    <p className="text-sm font-bold text-gray-600">Confidence Trend (Last 24 Hours)</p>
                  </div>
                  <p className="text-sm text-gray-900">
                    Trend: ${confidenceTrend[confidenceTrend.length - 1].confidence > confidenceTrend[0].confidence ? 'Increasing' : 'Decreasing'}
                  </p>
                  <p className="text-sm text-gray-900">
                    Change: ${(confidenceTrend[confidenceTrend.length - 1].confidence - confidenceTrend[0].confidence).toFixed(0)}%
                  </p>
                  <div className="mt-4 w-full h-64">
                    <canvas ref={chartRef}></canvas>
                  </div>
                </div>
              )}

              {userBehavior && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Brain size={20} className="text-green-500" />
                    <p className="text-sm font-bold text-gray-600">User Behavior Analysis</p>
                  </div>
                  <p className="text-sm text-gray-900">Confidence Adjustment: ${userBehavior.adjustment}</p>
                  <ul className="text-sm text-gray-600 list-disc list-inside">
                    {userBehavior.rationale.map((reason, i) => (
                      <li key={i}>{reason}</li>
                    ))}
                  </ul>
                </div>
              )}

              {learningStats.tradesAnalyzed > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Brain size={20} className="text-green-500" />
                    <p className="text-sm font-bold text-gray-600">Bot Learning Stats</p>
                  </div>
                  <p className="text-sm text-gray-900">Success Rate: ${learningStats.successRate}%</p>
                  <p className="text-sm text-gray-900">Trades Analyzed: ${learningStats.tradesAnalyzed}</p>
                </div>
              )}

              {backtestResult && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <BarChart2 size={20} className="text-green-500" />
                    <p className="text-sm font-bold text-gray-600">Backtest Results (Last 30 Days)</p>
                  </div>
                  <p className="text-sm text-gray-900">Returns: ${backtestResult.returns}%</p>
                  <p className="text-sm text-gray-900">Number of Trades: ${backtestResult.trades}</p>
                  <p className="text-sm text-gray-900">Final Portfolio Value: $${backtestResult.finalValue}</p>
                </div>
              )}

              {stopLossTakeProfit && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle size={20} className="text-green-500" />
                    <p className="text-sm font-bold text-gray-600">Risk Management</p>
                  </div>
                  <p className="text-sm text-gray-900">Stop-Loss: $${stopLossTakeProfit.stopLoss}</p>
                  <p className="text-sm text-gray-900">Take-Profit: $${stopLossTakeProfit.takeProfit}</p>
                  <p className="text-sm text-gray-900">ATR (14): $${stopLossTakeProfit.atr}</p>
                </div>
              )}

              {tradeSimulation && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign size={20} className="text-green-500" />
                    <p className="text-sm font-bold text-gray-600">Trade Execution Simulation</p>
                  </div>
                  <p className="text-sm text-gray-900">Position Size: ${tradeSimulation.positionSize} ${selectedCoin.symbol.toUpperCase()}</p>
                  <p className="text-sm text-gray-900">Cost with Fees & Slippage: $${tradeSimulation.costWithFees}</p>
                  <p className="text-sm text-gray-900">Potential Gain: $${tradeSimulation.potentialGain}</p>
                  <p className="text-sm text-gray-900">Potential Loss: $${tradeSimulation.potentialLoss}</p>
                  <p className="text-sm text-gray-900">Risk/Reward Ratio: ${tradeSimulation.riskRewardRatio}</p>
                </div>
              )}

              {orderRouting && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Network size={20} className="text-green-500" />
                    <p className="text-sm font-bold text-gray-600">Smart Order Routing</p>
                  </div>
                  <p className="text-sm text-gray-900">Best DEX: ${orderRouting.bestDex}</p>
                  <p className="text-sm text-gray-900">Savings: $${orderRouting.savings}</p>
                </div>
              )}

              {portfolioImpact && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign size={20} className="text-green-500" />
                    <p className="text-sm font-bold text-gray-600">Portfolio Impact</p>
                  </div>
                  <p className="text-sm text-gray-900">Trade Amount: $${portfolioImpact.tradeAmount}</p>
                  <p className="text-sm text-gray-900">Potential Gain: $${portfolioImpact.potentialGain}</p>
                  <p className="text-sm text-gray-900">Potential Loss: $${portfolioImpact.potentialLoss}</p>
                  <p className="text-sm text-gray-900">Portfolio Percentage: $${portfolioImpact.portfolioPercentage}%</p>
                </div>
              )}

              {portfolioRebalance && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign size={20} className="text-green-500" />
                    <p className="text-sm font-bold text-gray-600">Portfolio Rebalancing</p>
                  </div>
                  <p className="text-sm text-gray-900">Current Allocation: $${portfolioRebalance.currentAllocation}%</p>
                  <p className="text-sm text-gray-900">Target Allocation: $${portfolioRebalance.targetAllocation}%</p>
                  <p className="text-sm text-gray-900">Action: $${portfolioRebalance.action}</p>
                </div>
              )}

              {sentimentHeatmap && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <BarChart2 size={20} className="text-green-500" />
                    <p className="text-sm font-bold text-gray-600">Sentiment Heatmap (Top 5 Coins)</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {sentimentHeatmap.map(coin => (
                      <div
                        key={coin.id}
                        className={`p-2 rounded-lg text-sm text-center ${
                          coin.sentiment >= 70 ? 'bg-green-100 text-green-800' :
                          coin.sentiment >= 40 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}
                      >
                        ${coin.symbol.toUpperCase()}: ${coin.sentiment.toFixed(0)}/100
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Real-time Sentiment Analytics */}
          {feature.title === 'Real-time Sentiment Analytics' && selectedCoin && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Sentiment Score</p>
                <p className="text-lg font-bold text-gray-900">${sentimentScore}/100</p>
                <p className="text-sm text-gray-600 mt-2">
                  ${sentimentScore >= 70 ? 'Positive market sentiment' : sentimentScore >= 40 ? 'Neutral market sentiment' : 'Negative market sentiment'}
                </p>
              </div>
            </div>
          )}

          {/* Predictive Analytics */}
          {feature.title === 'Predictive Analytics' && selectedCoin && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Price Prediction (7 Days)</p>
                <p className="text-lg font-bold text-gray-900">${prediction || 'Generating prediction...'}</p>
              </div>
            </div>
          )}

          {/* Advanced Security */}
          {feature.title === 'Advanced Security' && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-line">
                <p className="text-sm text-gray-600">Wallet Security Scan</p>
                <p className="text-lg font-bold text-gray-900">${scanResult || 'Scanning...'}</p>
              </div>
            </div>
          )}

          {/* Automated Yield Farming */}
          {feature.title === 'Automated Yield Farming' && selectedCoin && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Yield Farming Strategy</p>
                <p className="text-lg font-bold text-gray-900">${yieldProtocol || 'Calculating optimal protocol...'}</p>
                <p className="text-sm text-gray-600 mt-2">
                  Assets will be allocated to maximize returns on BSC DeFi protocols based on your risk tolerance.
                </p>
              </div>
            </div>
          )}

          {/* AI Investment Advisor */}
          {feature.title === 'AI Investment Advisor' && (
            <div className="space-y-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Investment Goal</label>
                <select
                  value={investmentGoal}
                  onChange={(e) => setInvestmentGoal(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="Retirement">Retirement</option>
                  <option value="Wealth Growth">Wealth Growth</option>
                  <option value="Short-term Gains">Short-term Gains</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Horizon (Years)</label>
                <input
                  type="number"
                  value={timeHorizon}
                  onChange={(e) => setTimeHorizon(Math.max(1, parseInt(e.target.value)))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  min="1"
                />
              </div>

              {portfolioAllocation && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Briefcase size={20} className="text-green-500" />
                    <p className="text-sm font-bold text-gray-600">Portfolio Allocation</p>
                  </div>
                  <p className="text-sm text-gray-900">Crypto: ${portfolioAllocation.crypto}%</p>
                  <p className="text-sm text-gray-900">Stocks: ${portfolioAllocation.stocks}%</p>
                  <p className="text-sm text-gray-900">Bonds: ${portfolioAllocation.bonds}%</p>
                </div>
              )}

              {expectedReturns && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp size={20} className="text-green-500" />
                    <p className="text-sm font-bold text-gray-600">Expected Returns & Risk</p>
                  </div>
                  <p className="text-sm text-gray-900">Estimated Annual Return: ${expectedReturns.annualReturn}%</p>
                  <p className="text-sm text-gray-900">Risk Level: ${expectedReturns.riskLevel}</p>
                </div>
              )}

              {diversificationTip && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle size={20} className="text-green-500" />
                    <p className="text-sm font-bold text-gray-600">Diversification Tip</p>
                  </div>
                  <p className="text-sm text-gray-900">${diversificationTip}</p>
                </div>
              )}

              {nextSteps.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap size={20} className="text-green-500" />
                    <p className="text-sm font-bold text-gray-600">Actionable Next Steps</p>
                  </div>
                  <ul className="text-sm text-gray-900 list-disc list-inside">
                    {nextSteps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Trading Q&A Bot */}
          {feature.title === 'Trading Q&A Bot' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Bot size={20} className="text-green-500" />
                <h3 className="text-lg font-semibold text-gray-900">Ask the Trading Bot</h3>
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g., What is a stop-loss?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={handleAskBot}
                  disabled={isLoadingBot}
                  className={`bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 ${
                    isLoadingBot ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  ${isLoadingBot ? 'Processing...' : 'Ask'}
                </button>
              </div>
              {botAnswer && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Bot Response:</p>
                  <p className="text-sm text-gray-900">${botAnswer}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeatureModal;
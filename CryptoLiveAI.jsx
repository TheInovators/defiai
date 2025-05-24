import React, { useState, useEffect, useCallback, useRef } from 'react';
import './CryptoLiveAI.css';

const CONFIG = {
    COINGECKO_BASE: "https://api.coingecko.com/api/v3",
    UPDATE_INTERVAL: 30000, // 30 seconds
    FEAR_GREED_API: "https://api.alternative.me/fng/?limit=1",
    MAX_RETRIES: 3,
    RETRY_DELAY: 2000,
    API_KEY: "AIzaSyA4R19ScH-AGObnApADZQqbkl_IOPKPmD0",
    GEMINI_API_URL: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"
};

const CryptoLiveAI = ({ availableCoins }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [marketData, setMarketData] = useState({});
    const [globalStats, setGlobalStats] = useState({});
    const [fearGreedData, setFearGreedData] = useState({ value: 50, sentiment: 'Neutral' });
    const [lastUpdate, setLastUpdate] = useState(null);
    const [messageHistory, setMessageHistory] = useState([]);
    const [connectionStatus, setConnectionStatus] = useState('connecting');
    const [retryCount, setRetryCount] = useState(0);
    const [messageInput, setMessageInput] = useState('');
    const chatBodyRef = useRef(null);

    const coinIds = availableCoins.map(coin => coin.id);

    const formatNumber = (num) => {
        if (!num) return 'N/A';
        if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
        if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
        return num.toFixed(2);
    };

    const formatPrice = (price) => {
        if (!price) return '$0.00';
        if (price >= 1) return '$' + price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        return '$' + price.toFixed(6);
    };

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const fetchWithRetry = async (url, options = {}, retries = CONFIG.MAX_RETRIES) => {
        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(url, options);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return await response.json();
            } catch (error) {
                console.warn(`Fetch attempt ${i + 1} failed:`, error.message);
                if (i === retries - 1) throw error;
                await delay(CONFIG.RETRY_DELAY * (i + 1));
            }
        }
    };

    const fetchGlobalStats = async () => {
        try {
            const data = await fetchWithRetry(`${CONFIG.COINGECKO_BASE}/global`);
            return data.data;
        } catch (error) {
            console.error('Global stats error:', error);
            return null;
        }
    };

    const fetchTopCoins = async () => {
        try {
            const data = await fetchWithRetry(
                `${CONFIG.COINGECKO_BASE}/simple/price?ids=${coinIds.join(',')}&vs_currencies=usd`
            );
            return availableCoins.map(coin => ({
                id: coin.id,
                name: coin.name,
                symbol: coin.symbol,
                current_price: data[coin.id]?.usd || 0
            }));
        } catch (error) {
            console.error('Coin data error:', error);
            return [];
        }
    };

    const fetchFearGreedIndex = async () => {
        try {
            const data = await fetchWithRetry(CONFIG.FEAR_GREED_API);
            const index = data.data[0];
            return {
                value: parseInt(index.value),
                sentiment: index.value_classification
            };
        } catch (error) {
            const mockValue = Math.floor(Math.random() * 100);
            let sentiment = 'Neutral';
            if (mockValue <= 25) sentiment = 'Extreme Fear';
            else if (mockValue <= 45) sentiment = 'Fear';
            else if (mockValue <= 55) sentiment = 'Neutral';
            else if (mockValue <= 75) sentiment = 'Greed';
            else sentiment = 'Extreme Greed';
            return { value: mockValue, sentiment };
        }
    };

    const fetchGeminiResponse = async (query) => {
        const url = `${CONFIG.GEMINI_API_URL}?key=${CONFIG.API_KEY}`;
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: query }] }]
            })
        };
        try {
            const data = await fetchWithRetry(url, options);
            return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from AI.';
        } catch (error) {
            console.error('Gemini API error:', error);
            if (error.message.includes('HTTP 401')) {
                return 'Invalid Gemini API key. Please check the configuration.';
            } else if (error.message.includes('HTTP 429')) {
                return 'Gemini API rate limit exceeded. Please try again later.';
            }
            return `Failed to process query: ${error.message}`;
        }
    };

    const updateConnectionStatus = (status) => {
        setConnectionStatus(status);
    };

    const updateGlobalStats = (stats) => {
        if (stats) {
            setGlobalStats(stats);
        }
    };

    const updateFearGreed = (data) => {
        if (data) {
            setFearGreedData(data);
        }
    };

    const updateCryptoList = (coins) => {
        if (coins && coins.length > 0) {
            const newMarketData = {};
            coins.forEach(coin => {
                newMarketData[coin.id] = coin;
            });
            setMarketData(newMarketData);
        }
    };

    const addMessage = (content, type, isSpecial = false) => {
        const newMessage = {
            content,
            type,
            timestamp: Date.now(),
            isSpecial
        };
        setMessageHistory(prev => [...prev, newMessage]);
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    };

    const processCryptoQuery = async (query) => {
        const lowerQuery = query.toLowerCase();

        if (lowerQuery.includes('market overview') || lowerQuery.includes('market summary')) {
            const coins = Object.values(marketData);
            if (!coins.length) {
                return `
                    <div class="crypto-insight">
                        <div class="insight-header">📊 Market Overview</div>
                        <p>Market data is currently loading. Please wait a moment and try again.</p>
                    </div>
                `;
            }
            return `
                <div class="crypto-insight">
                    <div class="insight-header">📊 Real-Time Market Overview</div>
                    <p><strong>Market Cap:</strong> ${formatNumber(globalStats.total_market_cap?.usd || 0)}</p>
                    <p><strong>24h Volume:</strong> ${formatNumber(globalStats.total_volume?.usd || 0)}</p>
                    <p><strong>BTC Dominance:</strong> ${(globalStats.market_cap_percentage?.btc?.toFixed(1) || 0)}%</p>
                    <p><strong>Fear & Greed Index:</strong> ${fearGreedData.value} (${fearGreedData.sentiment})</p>
                    <p><strong>Available Coins:</strong> ${coins.map(coin => `${coin.name} (${coin.symbol})`).join(', ')}</p>
                </div>
            `;
        }

        const coinMatch = availableCoins.find(coin =>
            lowerQuery.includes(coin.id.toLowerCase()) ||
            lowerQuery.includes(coin.name.toLowerCase()) ||
            lowerQuery.includes(coin.symbol.toLowerCase())
        );

        if (coinMatch && marketData[coinMatch.id]) {
            const coin = marketData[coinMatch.id];
            return `
                <div class="crypto-insight">
                    <div class="insight-header">⚡ ${coin.name} Real-Time Analysis</div>
                    <p><strong>Current Price:</strong> ${formatPrice(coin.current_price)}</p>
                    <p><strong>Note:</strong> Additional metrics like market cap and 24h change are unavailable with current data.</p>
                </div>
            `;
        }

        if (lowerQuery.includes('trending') || lowerQuery.includes('hot') || lowerQuery.includes('movers')) {
            const coins = Object.values(marketData);
            if (!coins.length) {
                return `
                    <div class="crypto-insight">
                        <div class="insight-header">🔥 Trending Analysis</div>
                        <p>Market data is currently loading. Please wait a moment and try again.</p>
                    </div>
                `;
            }
            return `
                <div class="crypto-insight">
                    <div class="insight-header">🔥 Available Coins</div>
                    ${coins.map(coin => `
                        <div class="news-item">
                            <div class="news-title">${coin.name} (${coin.symbol})</div>
                            <p><strong>Price:</strong> ${formatPrice(coin.current_price)}</p>
                        </div>
                    `).join('')}
                    <p><strong>Note:</strong> Trending analysis is limited due to unavailable 24h change data.</p>
                </div>
            `;
        }

        if (lowerQuery.includes('fear') || lowerQuery.includes('greed')) {
            return `
                <div class="crypto-insight">
                    <div class="insight-header">😱 Fear & Greed Index</div>
                    <p><strong>Current Index:</strong> ${fearGreedData.value}/100</p>
                    <p><strong>Sentiment:</strong> ${fearGreedData.sentiment}</p>
                    <p><strong>Analysis:</strong> ${
                        fearGreedData.value <= 25 ? 'Extreme fear in the market often signals buying opportunities for long-term investors.' :
                        fearGreedData.value <= 45 ? 'Fear dominates the market. Consider dollar-cost averaging.' :
                        fearGreedData.value <= 55 ? 'Market sentiment is neutral. Wait for clearer signals.' :
                        fearGreedData.value <= 75 ? 'Greed is building. Consider taking some profits.' :
                        'Extreme greed suggests the market may be overheated. Exercise caution.'
                    }</p>
                </div>
            `;
        }

        const geminiResponse = await fetchGeminiResponse(query);
        return `
            <div class="crypto-insight">
                <div class="insight-header">🤖 AI Response</div>
                <p>${geminiResponse}</p>
            </div>
        `;
    };

    const loadAllData = useCallback(async () => {
        updateConnectionStatus('updating');
        try {
            const [globalStats, coins, fearGreed] = await Promise.all([
                fetchGlobalStats(),
                fetchTopCoins(),
                fetchFearGreedIndex()
            ]);

            updateGlobalStats(globalStats);
            updateCryptoList(coins);
            updateFearGreed(fearGreed);

            setLastUpdate(Date.now());
            updateConnectionStatus('connected');
            setRetryCount(0);
        } catch (error) {
            console.error('Failed to load data:', error);
            updateConnectionStatus('error');
            setRetryCount(prev => {
                const newRetryCount = prev + 1;
                if (newRetryCount < CONFIG.MAX_RETRIES) {
                    setTimeout(() => loadAllData(), CONFIG.RETRY_DELAY * Math.pow(2, newRetryCount));
                }
                return newRetryCount;
            });
        }
    }, [coinIds]);

    const handleCoinClick = (coinId) => {
        const coin = marketData[coinId];
        if (!coin) return;
        const query = `Tell me about ${coin.name}`;
        setMessageInput(query);
        handleSendMessage();
    };

    const handleSendMessage = async () => {
        let message = messageInput.trim();
        if (!message || isProcessing) return;

        message = message.replace(/<[^>]+>/g, '');
        if (!message) return;

        setIsProcessing(true);
        addMessage(message, 'user');

        const typingIndicator = (
            <div className="message bot-message" id="typing-indicator">
                <div className="typing-indicator">
                    <span>AI analyzing data</span>
                    <div className="typing-dots">
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                    </div>
                </div>
            </div>
        );
        setMessageHistory(prev => [...prev, { content: typingIndicator, type: 'bot', timestamp: Date.now(), isSpecial: true }]);

        try {
            await delay(500);
            const response = await processCryptoQuery(message);
            setMessageHistory(prev => prev.filter(msg => msg.content !== typingIndicator));
            addMessage(response, 'bot', true);
        } catch (error) {
            setMessageHistory(prev => prev.filter(msg => msg.content !== typingIndicator));
            addMessage('Sorry, I encountered an error processing your request. Please try again.', 'bot');
            console.error('Message processing error:', error);
        }

        setIsProcessing(false);
        setMessageInput('');
    };

    const clearChat = () => {
        setMessageHistory([]);
    };

    useEffect(() => {
        loadAllData();
        const interval = setInterval(loadAllData, CONFIG.UPDATE_INTERVAL);
        return () => clearInterval(interval);
    }, [loadAllData]);

    return (
        <div className="app-container">
            <div className="sidebar">
                <h2>
                    <span className="live-indicator"></span>
                    Live Markets
                </h2>
                <div className="market-stats">
                    <div className="stat-item">
                        <span className="stat-label">Market Cap</span>
                        <span className="stat-value">{formatNumber(globalStats.total_market_cap?.usd)}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">24h Volume</span>
                        <span className="stat-value">{formatNumber(globalStats.total_volume?.usd)}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">BTC Dominance</span>
                        <span className="stat-value">{(globalStats.market_cap_percentage?.btc?.toFixed(1) || '0')}%</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Fear & Greed</span>
                        <span className="stat-value">{`${fearGreedData.value} (${fearGreedData.sentiment})`}</span>
                    </div>
                    <div className={`connection-status ${connectionStatus}`}>
                        <span className="live-indicator"></span>
                        {
                            connectionStatus === 'connecting' ? '🔄 Connecting...' :
                            connectionStatus === 'connected' ? '✅ Live Data' :
                            connectionStatus === 'updating' ? '🔄 Updating...' :
                            '❌ Connection Error'
                        }
                    </div>
                </div>
                <div id="crypto-list">
                    {Object.values(marketData).length > 0 ? (
                        Object.values(marketData).map(coin => (
                            <div key={coin.id} className="crypto-card" onClick={() => handleCoinClick(coin.id)}>
                                <div className="crypto-header">
                                    <div>
                                        <div className="crypto-name">{coin.name}</div>
                                        <div className="crypto-symbol">{coin.symbol}</div>
                                    </div>
                                </div>
                                <div className="crypto-price">{formatPrice(coin.current_price)}</div>
                            </div>
                        ))
                    ) : (
                        <div className="error-message">Unable to load market data</div>
                    )}
                </div>
            </div>

            <div className="main-chat">
                <div className="chat-header">
                    <div className="chat-title">CryptoLive AI</div>
                    <div className="chat-status">
                        <span className="live-indicator"></span>
                        Real-time Intelligence
                    </div>
                </div>

                <div className="chat-body" ref={chatBodyRef}>
                    {messageHistory.length === 0 ? (
                        <div className="welcome-message">
                            <h3>🚀 Welcome to CryptoLive AI</h3>
                            <p>Your real-time cryptocurrency intelligence assistant powered by live market data</p>
                            <div className="feature-grid">
                                <div className="feature-card">
                                    <div className="feature-icon">📊</div>
                                    <div>Live Prices & Analytics</div>
                                </div>
                                <div className="feature-card">
                                    <div className="feature-icon">📈</div>
                                    <div>Market Trends</div>
                                </div>
                                <div className="feature-card">
                                    <div className="feature-icon">⚡</div>
                                    <div>Price Alerts</div>
                                </div>
                                <div className="feature-card">
                                    <div className="feature-icon">🧠</div>
                                    <div>AI Analysis</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        messageHistory.map((msg, index) => (
                            <div key={index} className={`message ${msg.type}-message`}>
                                <div
                                    className="message-text"
                                    dangerouslySetInnerHTML={msg.isSpecial ? { __html: msg.content } : undefined}
                                >
                                    {!msg.isSpecial && msg.content}
                                </div>
                                <div className="message-timestamp">
                                    {new Date(msg.timestamp).toLocaleTimeString('en-IN', {
                                        timeZone: 'Asia/Kolkata',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="chat-footer">
                    <div className="quick-commands">
                        <button className="quick-cmd" onClick={() => { setMessageInput('market overview'); handleSendMessage(); }}>
                            📊 Market Overview
                        </button>
                        <button className="quick-cmd" onClick={() => { setMessageInput('bitcoin analysis'); handleSendMessage(); }}>
                            ₿ BTC Analysis
                        </button>
                        <button className="quick-cmd" onClick={() => { setMessageInput('trending coins'); handleSendMessage(); }}>
                            🔥 Trending
                        </button>
                        <button className="quick-cmd" onClick={() => { setMessageInput('fear and greed'); handleSendMessage(); }}>
                            😱 Fear & Greed
                        </button>
                    </div>

                    <div className="input-container">
                        <button className="btn btn-secondary" onClick={clearChat}>🗑</button>
                        <input
                            type="text"
                            className="message-input"
                            placeholder="Ask about crypto markets, prices, or anything else..."
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            maxLength="500"
                        />
                        <button
                            className="btn btn-primary"
                            onClick={handleSendMessage}
                            disabled={!messageInput.trim() || isProcessing}
                        >
                            <span>Send</span>
                            <span>⚡</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CryptoLiveAI;
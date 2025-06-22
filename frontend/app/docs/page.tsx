'use client';

import { useState } from 'react';
import { 
  FileText, 
  Search, 
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const documentationContent = `
# MarketForge AI Documentation

## Getting Started

Welcome to MarketForge AI! This comprehensive guide will help you integrate our powerful AI-driven market analysis tools into your applications.

### Quick Start

1. **Sign up** for a MarketForge AI account
2. **Get your API key** from the dashboard
3. **Install** our SDK or use our REST API
4. **Make your first API call**

### Installation

#### JavaScript/Node.js
\`\`\`bash
npm install @marketforge/ai-sdk
\`\`\`

#### Python
\`\`\`bash
pip install marketforge-ai
\`\`\`

#### Go
\`\`\`bash
go get github.com/marketforge/ai-go
\`\`\`

## Authentication

All API requests require authentication using your API key. Include your API key in the Authorization header:

\`\`\`
Authorization: Bearer YOUR_API_KEY
\`\`\`

## API Reference

### Market Analysis Endpoint

**POST** \`/api/v1/analyze\`

Analyze market data and get AI-powered insights.

**Parameters:**
- \`symbol\` (string): Stock symbol (e.g., "AAPL")
- \`timeframe\` (string): Analysis timeframe ("1d", "1w", "1m")
- \`indicators\` (array): Technical indicators to include

**Example Request:**
\`\`\`json
{
  "symbol": "AAPL",
  "timeframe": "1d",
  "indicators": ["rsi", "macd", "bollinger"]
}
\`\`\`

**Example Response:**
\`\`\`json
{
  "symbol": "AAPL",
  "prediction": "bullish",
  "confidence": 0.85,
  "price_target": 175.50,
  "indicators": {
    "rsi": 65.2,
    "macd": "positive_crossover",
    "bollinger": "middle_band"
  }
}
\`\`\`

### Prediction Endpoint

**POST** \`/api/v1/predict\`

Get price predictions for specific assets.

**Parameters:**
- \`symbol\` (string): Asset symbol
- \`horizon\` (string): Prediction horizon ("1h", "1d", "1w")
- \`model\` (string): AI model to use ("standard", "advanced")

### Portfolio Analysis

**POST** \`/api/v1/portfolio/analyze\`

Analyze entire portfolio performance and risk.

**Parameters:**
- \`holdings\` (array): Array of portfolio holdings
- \`risk_tolerance\` (string): Risk level ("low", "medium", "high")

## SDK Examples

### JavaScript
\`\`\`javascript
import { MarketForgeAI } from '@marketforge/ai-sdk';

const client = new MarketForgeAI({
  apiKey: 'your-api-key-here'
});

const analysis = await client.analyze({
  symbol: 'AAPL',
  timeframe: '1d',
  indicators: ['rsi', 'macd']
});

console.log(analysis.prediction);
\`\`\`

### Python
\`\`\`python
from marketforge_ai import MarketForgeAI

client = MarketForgeAI(api_key='your-api-key-here')

analysis = client.analyze(
    symbol='AAPL',
    timeframe='1d',
    indicators=['rsi', 'macd']
)

print(analysis.prediction)
\`\`\`

## Rate Limits

- **Free Plan**: 100 requests per hour
- **Pro Plan**: 1,000 requests per hour
- **Enterprise**: Custom limits

## Error Handling

The API uses standard HTTP status codes:

- **200**: Success
- **400**: Bad Request
- **401**: Unauthorized
- **429**: Rate Limit Exceeded
- **500**: Internal Server Error

## Webhooks

Set up webhooks to receive real-time market alerts:

**POST** \`/api/v1/webhooks\`

Configure webhook endpoints for:
- Price alerts
- Technical indicator signals
- Portfolio rebalancing notifications

## Advanced Features

### Real-time Data Streaming

Connect to our WebSocket API for real-time market data:

\`\`\`javascript
const ws = new WebSocket('wss://api.marketforge.ai/v1/stream');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Real-time update:', data);
};
\`\`\`

### Custom AI Models

Train custom models for your specific use case:

**POST** \`/api/v1/models/train\`

Parameters:
- \`training_data\` (array): Historical data for training
- \`model_type\` (string): Type of model to train
- \`parameters\` (object): Model-specific parameters

### Backtesting

Test your strategies against historical data:

**POST** \`/api/v1/backtest\`

Parameters:
- \`strategy\` (object): Trading strategy definition
- \`start_date\` (string): Backtest start date
- \`end_date\` (string): Backtest end date
- \`initial_capital\` (number): Starting capital amount

## Integration Examples

### React Integration

\`\`\`jsx
import React, { useEffect, useState } from 'react';
import { MarketForgeAI } from '@marketforge/ai-sdk';

function MarketAnalysis() {
  const [analysis, setAnalysis] = useState(null);
  const client = new MarketForgeAI({ apiKey: process.env.REACT_APP_API_KEY });

  useEffect(() => {
    async function fetchAnalysis() {
      const result = await client.analyze({
        symbol: 'AAPL',
        timeframe: '1d'
      });
      setAnalysis(result);
    }
    fetchAnalysis();
  }, []);

  return (
    <div>
      {analysis && (
        <div>
          <h2>Analysis for {analysis.symbol}</h2>
          <p>Prediction: {analysis.prediction}</p>
          <p>Confidence: {analysis.confidence}</p>
        </div>
      )}
    </div>
  );
}
\`\`\`

### Node.js Server Integration

\`\`\`javascript
const express = require('express');
const { MarketForgeAI } = require('@marketforge/ai-sdk');

const app = express();
const client = new MarketForgeAI({ apiKey: process.env.API_KEY });

app.get('/analyze/:symbol', async (req, res) => {
  try {
    const analysis = await client.analyze({
      symbol: req.params.symbol,
      timeframe: '1d'
    });
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
\`\`\`

## Support

For technical support:
- Email: support@marketforge.ai
- Documentation: https://docs.marketforge.ai
- Status Page: https://status.marketforge.ai
- Community Forum: https://community.marketforge.ai

## Changelog

### v2.1.0 (Latest)
- Added portfolio analysis endpoint
- Improved prediction accuracy by 15%
- New technical indicators: Ichimoku, Stochastic
- Enhanced real-time streaming performance
- Bug fixes and performance improvements

### v2.0.0
- Major API redesign for better usability
- Enhanced AI models with transformer architecture
- Real-time data streaming via WebSocket
- Custom model training capabilities
- Breaking changes: Updated authentication method

### v1.5.0
- Added webhook support for real-time alerts
- New SDK languages: Go, Rust, PHP
- Performance improvements: 50% faster response times
- Enhanced error handling and logging

### v1.4.0
- Backtesting functionality
- Portfolio optimization tools
- Risk management features
- Mobile SDK for iOS and Android

### v1.3.0
- Machine learning model improvements
- Additional market data sources
- Enhanced documentation
- Bug fixes and stability improvements
`;

  return (
    <div className="page-scrollable">
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-gradient-to-r from-slate-900/30 via-slate-800/20 to-slate-900/30 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/profile">
                <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                  <ArrowLeft className="w-5 h-5 text-white" />
                </button>
              </Link>
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 backdrop-blur-sm">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <img 
                    src="/LogoArrow.png" 
                    alt="MarketForge AI Logo" 
                    className="w-5 h-5 opacity-90"
                    style={{ filter: 'brightness(0) invert(1) opacity(0.9)' }}
                  />
                  <h1 className="text-xl font-medium text-gradient">MarketForge AI</h1>
                </div>
                <p className="text-sm text-slate-400">API guides and references</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6 pb-12">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="glass rounded-xl p-3">
            <div className="flex items-center space-x-3">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documentation..."
                className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* Documentation Content */}
        <div className="glass rounded-xl p-6">
          <div className="prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-gray-300 leading-relaxed text-sm">
              {documentationContent}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
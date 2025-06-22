# Enhanced agents/trend_detector.py - Building on your existing code
import os
import requests
import logging
from typing import List, Dict
from datetime import datetime

# Import your existing ASI1 client
from .asi1_client import ask_asi1

logger = logging.getLogger(__name__)

class TrendDetector:
    """Enhanced trend detector building on your existing code"""
    
    def __init__(self):
        self.serp_api_key = os.getenv("SERP_API_KEY", "")
        self.news_api_key = os.getenv("NEWS_API_KEY", "")
        logger.info("Enhanced TrendDetector initialized")
        
    def get_news_trends(self, query: str = "technology", limit: int = 10) -> Dict:
        """Enhanced news trends with better business focus"""
        if not self.news_api_key:
            # Enhanced mock data for business demo
            return {
            "articles": [
                {
                    "title": f"Market Growth Accelerating in {query.title()} Industry - Latest Research",
                    "description": f"New data shows {query} businesses adapting to market changes with innovative strategies",
                    "url": "https://example.com/market-growth",
                    "publishedAt": datetime.now().isoformat(),
                    "source": {"name": "Industry Intelligence"},
                    "business_relevance": "high",
                    "roi_potential": self._calculate_dynamic_roi(query)
                }
            ],
            "status": "dynamic_analysis",
            "query_used": query,
            "business_focused": True
        }
        
        try:
            # Enhanced query for better business relevance
            business_query = f"{query} business growth marketing ROI 2025 trends"
            
            url = "https://newsapi.org/v2/everything"
            params = {
                "q": business_query,
                "sortBy": "popularity",
                "apiKey": self.news_api_key,
                "pageSize": limit,
                "language": "en",
                "domains": "techcrunch.com,forbes.com,businessinsider.com,harvard.edu"  # Business-focused sources
            }
            
            response = requests.get(url, params=params, timeout=10)
            if response.status_code == 200:
                data = response.json()
                # Enhance articles with business metadata
                enhanced_articles = []
                for article in data.get('articles', []):
                    article['business_relevance'] = self._assess_business_relevance(article['title'])
                    article['roi_potential'] = self._estimate_roi_potential(article['description'])
                    enhanced_articles.append(article)
                
                data['articles'] = enhanced_articles
                data['enhanced'] = True
                return data
            else:
                logger.error(f"NewsAPI error: {response.status_code}")
                return {"error": f"NewsAPI error: {response.status_code}", "articles": []}
                
        except Exception as e:
            logger.error(f"Error fetching enhanced news: {str(e)}")
            return {"error": str(e), "articles": []}
    
    def _assess_business_relevance(self, title: str) -> str:
        """Assess business relevance of article"""
        high_keywords = ['roi', 'revenue', 'growth', 'profit', 'automation', 'ai', 'productivity']
        medium_keywords = ['marketing', 'customer', 'business', 'strategy', 'digital']
        
        title_lower = title.lower()
        
        if any(keyword in title_lower for keyword in high_keywords):
            return "high"
        elif any(keyword in title_lower for keyword in medium_keywords):
            return "medium"
        else:
            return "low"
    
    def _estimate_roi_potential(self, description: str) -> str:
        """Estimate ROI potential from article description"""
        if not description:
            return "unknown"
        
        desc_lower = description.lower()
        
        if any(term in desc_lower for term in ['300%', '400%', 'triple', 'massive', 'huge']):
            return "300%+"
        elif any(term in desc_lower for term in ['200%', 'double', 'significant']):
            return "200-300%"
        elif any(term in desc_lower for term in ['150%', 'substantial', 'major']):
            return "150-200%"
        else:
            return "100-150%"
    
    def analyze_trends_with_asi1(self, trends_data: Dict) -> Dict:
        """Enhanced analysis using your existing ASI1 integration"""
        business_prompt = f"""
        Analyze these market trends for business intelligence:
        
        {trends_data}
        
        As a senior business consultant, provide:
        1. Top 3 actionable opportunities for business owners
        2. Marketing strategies with estimated ROI 
        3. Competitive advantages to pursue
        4. Productivity improvements using AI/automation
        5. 30/60/90 day implementation roadmap
        
        Focus on practical, profitable recommendations for small-medium businesses.
        Format as structured business insights.
        """
        
        try:
            # Use your existing ask_asi1 function
            analysis = ask_asi1(business_prompt)
            return {
                "analysis": analysis,
                "raw_data": trends_data,
                "analysis_type": "business_intelligence",
                "asi1_enhanced": True,
                "timestamp": datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"Error analyzing with your ASI:One: {str(e)}")
            return {
                "error": str(e),
                "fallback_analysis": self._generate_fallback_analysis(trends_data),
                "analysis_type": "fallback_business_intelligence"
            }
    
    def _generate_fallback_analysis(self, trends_data: Dict) -> Dict:
        """Generate fallback business analysis when ASI1 fails"""
        return {
            "top_opportunities": [
                "Implement AI-powered customer service for 24/7 support",
                "Launch automated email marketing campaigns", 
                "Optimize website for local search rankings"
            ],
            "marketing_strategies": [
                {
                    "strategy": "Content marketing automation",
                    "roi_estimate": "200-300%",
                    "timeline": "60 days"
                },
                {
                    "strategy": "Social media automation",
                    "roi_estimate": "150-250%", 
                    "timeline": "30 days"
                }
            ],
            "competitive_advantages": [
                "First-mover advantage in AI adoption",
                "Enhanced customer experience through automation",
                "Data-driven decision making capabilities"
            ],
            "productivity_improvements": [
                "Automate repetitive marketing tasks",
                "Use AI chatbots for customer inquiries",
                "Implement automated lead scoring and nurturing",
                "Set up automated reporting and analytics"
            ],
            "implementation_roadmap": {
                "30_days": [
                    "Set up basic marketing automation",
                    "Implement AI chatbot for website",
                    "Optimize Google My Business listing"
                ],
                "60_days": [
                    "Launch content marketing campaign",
                    "Implement advanced lead nurturing",
                    "Set up competitive monitoring"
                ],
                "90_days": [
                    "Analyze results and optimize",
                    "Expand to additional marketing channels",
                    "Implement advanced AI tools"
                ]
            },
            "roi_projections": {
                "month_1": "10-20% improvement",
                "month_3": "30-50% improvement", 
                "month_6": "100-200% improvement"
            }
        }
    
    def get_competitor_intelligence(self, business_name: str, industry: str) -> Dict:
        """Enhanced competitor intelligence using news and your ASI1"""
        try:
            # Search for competitor news
            competitor_query = f'"{industry}" competitors analysis market share trends 2025'
            competitor_news = self.get_news_trends(competitor_query, limit=5)
            
            # Analyze with your ASI1
            competitor_prompt = f"""
            Business: {business_name}
            Industry: {industry}
            
            Based on this market intelligence:
            {competitor_news}
            
            Provide competitor analysis including:
            1. Key competitors and their strategies
            2. Market gaps and opportunities
            3. Competitive positioning recommendations
            4. Differentiation strategies
            5. Pricing and value proposition insights
            
            Focus on actionable competitive intelligence.
            """
            
            analysis = ask_asi1(competitor_prompt)
            
            return {
                "competitor_analysis": analysis,
                "market_data": competitor_news,
                "business_context": {
                    "name": business_name,
                    "industry": industry
                },
                "analysis_type": "competitor_intelligence",
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Competitor intelligence error: {str(e)}")
            return {
                "error": str(e),
                "fallback_insights": {
                    "key_trends": [
                        f"Digital transformation accelerating in {industry}",
                        "AI adoption creating competitive advantages",
                        "Customer experience becoming key differentiator"
                    ],
                    "opportunities": [
                        "Leverage AI before competitors",
                        "Focus on customer experience excellence", 
                        "Develop unique value propositions"
                    ]
                }
            }
    
    def get_industry_insights(self, industry: str, business_size: str = "small-medium") -> Dict:
        """Get industry-specific insights for business planning"""
        try:
            # Enhanced industry query
            industry_query = f"{industry} business trends growth opportunities {business_size} 2025"
            industry_news = self.get_news_trends(industry_query, limit=8)
            
            # Industry analysis with your ASI1
            industry_prompt = f"""
            Industry: {industry}
            Business Size: {business_size}
            
            Market Intelligence:
            {industry_news}
            
            Provide comprehensive industry insights:
            1. Growth drivers and market opportunities
            2. Industry challenges and how to overcome them
            3. Technology trends affecting the industry
            4. Customer behavior changes and implications
            5. Revenue optimization strategies specific to {industry}
            6. Cost reduction opportunities
            7. Regulatory or market changes to monitor
            
            Tailor recommendations for {business_size} businesses in {industry}.
            """
            
            insights = ask_asi1(industry_prompt)
            
            return {
                "industry_insights": insights,
                "market_data": industry_news,
                "industry": industry,
                "business_size": business_size,
                "insight_type": "industry_intelligence",
                "enhanced_with_asi1": True,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Industry insights error: {str(e)}")
            return {
                "error": str(e),
                "basic_insights": {
                    "growth_opportunities": [
                        f"Digital adoption in {industry} creating new revenue streams",
                        "Customer experience optimization driving retention",
                        "Automation reducing operational costs"
                    ],
                    "key_challenges": [
                        "Increased competition from digital-native companies",
                        "Rising customer acquisition costs",
                        "Need for technology adoption"
                    ],
                    "recommendations": [
                        "Invest in digital marketing capabilities",
                        "Implement customer retention strategies",
                        "Automate routine business processes"
                    ]
                }
            }

# Enhanced standalone functions that work with your existing codebase
def analyze_business_opportunity(business_data: dict, market_data: dict) -> dict:
    """Enhanced business opportunity analysis using your existing ASI1"""
    try:
        analysis_prompt = f"""
        COMPREHENSIVE BUSINESS OPPORTUNITY ANALYSIS
        
        Business Information:
        - Name: {business_data.get('name', 'Unknown')}
        - Industry: {business_data.get('categories', 'General')}
        - Website: {business_data.get('website', 'Not provided')}
        - Description: {business_data.get('description', 'Not provided')}
        
        Market Intelligence:
        {market_data}
        
        As a senior business consultant specializing in growth strategy, provide:
        
        1. EXECUTIVE SUMMARY (2-3 key insights)
        2. GROWTH OPPORTUNITIES (ranked by impact and feasibility)
        3. MARKETING STRATEGY (specific tactics with ROI estimates)
        4. OPERATIONAL EFFICIENCY (automation and productivity gains)
        5. COMPETITIVE POSITIONING (unique advantages to develop)
        6. FINANCIAL PROJECTIONS (revenue and cost impact estimates)
        7. RISK ASSESSMENT (potential challenges and mitigation)
        8. ACTION PLAN (30/60/90 day roadmap with specific tasks)
        
        Focus on practical, implementable strategies that deliver measurable ROI.
        Target audience: Business owners and marketing agencies seeking growth.
        """
        
        # Use your existing ASI1 integration
        analysis = ask_asi1(analysis_prompt)
        
        return {
            "comprehensive_analysis": analysis,
            "business_context": business_data,
            "market_context": market_data,
            "analysis_type": "business_opportunity",
            "asi1_powered": True,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Business opportunity analysis error: {str(e)}")
        return {
            "error": str(e),
            "fallback_analysis": "Analysis temporarily unavailable. Please try again or contact support.",
            "business_context": business_data
        }
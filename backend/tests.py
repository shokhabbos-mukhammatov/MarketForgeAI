#!/usr/bin/env python3
"""
Simple test script for your enhanced MarketForgeAI
"""

import requests
import json
import time

BASE_URL = "http://localhost:5000"

def test_trend_detector():
    """Test trend detection directly"""
    print("🔍 Testing TrendDetector directly...")
    
    try:
        # Test the trend detection endpoint (if you have one)
        response = requests.get(f"{BASE_URL}/api/trends/news?query=AI+startups&limit=3")
        
        if response.status_code == 200:
            data = response.json()
            articles = data.get('articles', [])
            print(f"✅ Found {len(articles)} trend articles")
            
            if articles:
                print(f"First article: {articles[0].get('title', 'No title')}")
            
            return True
        else:
            print(f"❌ Trend detection failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing trends: {e}")
        return False

def test_full_analysis_workflow():
    """Test the complete analysis workflow"""
    print("\n🚀 Testing Full Analysis Workflow...")
    
    try:
        # Step 1: Start analysis
        business_data = {
            "name": "Salesfinity",
            "website": "https://salesfinity.ai",
            "categories": "SaaS, productivity tools, B2B"
        }
        
        print("Starting analysis...")
        start_response = requests.post(f"{BASE_URL}/api/analyze", json=business_data)
        
        if start_response.status_code != 200:
            print(f"❌ Failed to start analysis: {start_response.status_code}")
            print(f"Response: {start_response.text}")
            return False
        
        start_data = start_response.json()
        job_id = start_data.get('jobId')
        
        print(f"✅ Analysis started with Job ID: {job_id}")
        print(f"Estimated completion: {start_data.get('estimated_completion')}")
        
        # Step 2: Monitor progress
        max_wait = 180  # 3 minutes
        check_interval = 10  # seconds
        elapsed = 0
        
        while elapsed < max_wait:
            print(f"\n⏱️  Checking status... ({elapsed}s elapsed)")
            
            status_response = requests.get(f"{BASE_URL}/api/analyze/{job_id}/status")
            
            if status_response.status_code != 200:
                print(f"❌ Status check failed: {status_response.status_code}")
                return False
            
            status_data = status_response.json()
            status = status_data.get('status')
            progress = status_data.get('progress', 0)
            
            print(f"   Status: {status}")
            print(f"   Progress: {progress}%")
            
            if status == 'completed':
                print("\n🎉 Analysis completed! Getting results...")
                
                # Step 3: Get results
                results_response = requests.get(f"{BASE_URL}/api/analyze/{job_id}/results")
                
                if results_response.status_code == 200:
                    results = results_response.json()
                    
                    print("\n📊 ANALYSIS RESULTS:")
                    print("=" * 50)
                    
                    # Show key results
                    trends = results.get('trends', [])
                    if trends:
                        print(f"📈 Market Trends ({len(trends)}):")
                        for i, trend in enumerate(trends[:3], 1):
                            print(f"   {i}. {trend}")
                    
                    action_plan = results.get('actionPlan', [])
                    if action_plan:
                        print(f"\n✅ Action Plan ({len(action_plan)} items):")
                        for i, action in enumerate(action_plan[:3], 1):
                            if isinstance(action, dict):
                                title = action.get('title', 'No title')
                                timeline = action.get('timeline', 'No timeline')
                                roi = action.get('roi_estimate', 'No ROI estimate')
                                print(f"   {i}. {title}")
                                print(f"      Timeline: {timeline}, ROI: {roi}")
                            else:
                                print(f"   {i}. {action}")
                    
                    marketing = results.get('marketingStrategy', 'No strategy provided')
                    print(f"\n🎯 Marketing Strategy: {marketing[:100]}...")
                    
                    metadata = results.get('metadata', {})
                    ai_providers = metadata.get('ai_providers_used', ['Unknown'])
                    print(f"\n🤖 AI Providers Used: {', '.join(ai_providers)}")
                    
                    return True
                else:
                    print(f"❌ Failed to get results: {results_response.status_code}")
                    return False
            
            elif status == 'failed':
                print("❌ Analysis failed")
                return False
            
            elif status == 'processing':
                print(f"   ⚙️  Still processing... {progress}% complete")
            
            # Wait before next check
            time.sleep(check_interval)
            elapsed += check_interval
        
        print("⏰ Analysis timed out")
        return False
        
    except Exception as e:
        print(f"❌ Analysis workflow failed: {e}")
        return False

def test_quick_insights():
    """Test quick insights feature"""
    print("\n⚡ Testing Quick Insights...")
    
    try:
        insight_data = {
            "business_info": "Local bakery with 2 locations, family-owned, wants to increase online orders",
            "question": "What are 3 ways to boost online sales by 50% in 3 months?"
        }
        
        response = requests.post(f"{BASE_URL}/api/quick-insights", json=insight_data)
        
        if response.status_code == 200:
            result = response.json()
            insights = result.get('insights', 'No insights')
            provider = result.get('provider', 'Unknown')
            
            print(f"✅ Quick insights received from {provider}")
            print(f"Insights preview: {insights[:200]}...")
            
            return True
        else:
            print(f"❌ Quick insights failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Quick insights error: {e}")
        return False

def main():
    """Run tests"""
    print("🧪 Simple MarketForgeAI Test Suite")
    print("=" * 50)
    
    tests = [
        ("Quick Insights", test_quick_insights),
        ("Trend Detection", test_trend_detector), 
        ("Full Analysis Workflow", test_full_analysis_workflow)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        print(f"\n{'='*20} {test_name} {'='*20}")
        success = test_func()
        results.append((test_name, success))
        
        if success:
            print(f"✅ {test_name} - PASSED")
        else:
            print(f"❌ {test_name} - FAILED")
    
    # Summary
    print(f"\n{'='*50}")
    print("📊 SUMMARY")
    print("=" * 50)
    
    passed = sum(1 for _, success in results if success)
    total = len(results)
    
    for test_name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"  {status}: {test_name}")
    
    print(f"\nResult: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Your system is working perfectly!")
    elif passed > 0:
        print("⚠️  Some tests passed. Check the failed ones.")
    else:
        print("❌ All tests failed. Check your configuration.")

if __name__ == "__main__":
    main()
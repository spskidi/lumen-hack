#!/usr/bin/env python3
"""
Test script to verify Gemini API functionality
"""

import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
load_dotenv()

from backend.services.gemini_service import GeminiService
import asyncio

async def test_gemini_api():
    print("🧪 Testing Gemini API...")
    
    try:
        service = GeminiService()
        print("✅ Gemini service initialized successfully")
        
        # Test user recommendations
        print("\n📊 Testing user recommendations...")
        user_data = {
            "current_plan": "Pro",
            "monthly_spend": 99.99,
            "subscription_duration_days": 180
        }
        
        usage_data = [
            {
                "date": "2024-01-01",
                "api_calls": 1500,
                "data_processed_gb": 5.2,
                "session_duration_minutes": 45,
                "features_used": ["API Analytics", "Data Export"],
                "support_tickets": 0
            }
        ]
        
        recommendations = await service.generate_user_recommendations(user_data, usage_data)
        print(f"✅ Generated {len(recommendations)} recommendations")
        for rec in recommendations:
            print(f"   - {rec.get('title', 'No title')}")
        
        # Test renewal predictions
        print("\n🔮 Testing renewal predictions...")
        users_data = [
            {
                "user_id": 1,
                "username": "test_user",
                "current_plan": "Pro",
                "monthly_spend": 99.99,
                "total_api_calls_30d": 1500,
                "support_tickets_30d": 0,
                "usage_trend": "increasing"
            }
        ]
        
        predictions = await service.analyze_renewal_likelihood(users_data)
        print(f"✅ Generated renewal analysis")
        if "overall_metrics" in predictions:
            avg_likelihood = predictions.get('overall_metrics', {}).get('average_renewal_likelihood', 0)
            if isinstance(avg_likelihood, (int, float)):
                print(f"   - Average renewal likelihood: {avg_likelihood * 100:.1f}%")
            else:
                print(f"   - Average renewal likelihood: {avg_likelihood}")
        
        print("\n🎉 All Gemini API tests passed!")
        return True
        
    except Exception as e:
        print(f"❌ Gemini API test failed: {e}")
        return False

if __name__ == "__main__":
    result = asyncio.run(test_gemini_api())
    sys.exit(0 if result else 1)

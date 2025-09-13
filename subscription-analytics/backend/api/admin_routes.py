from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict
from backend.models.database import get_db, User, UsageData, Recommendation
from backend.services.gemini_service import GeminiService
from backend.services.auth_service import AuthService
from datetime import datetime, timedelta
import json

router = APIRouter(prefix="/api/admin", tags=["admin"])
gemini_service = GeminiService()

def get_admin_user(token: str, db: Session = Depends(get_db)) -> User:
    """Get current authenticated admin user"""
    payload = AuthService.verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = db.query(User).filter(User.id == payload.get("sub")).first()
    if not user or user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

@router.get("/analytics")
async def get_admin_analytics(
    days: int = 30,
    db: Session = Depends(get_db)
):
    """Get comprehensive analytics dashboard data"""
    
    # Get all users and their data
    users = db.query(User).all()
    start_date = datetime.utcnow() - timedelta(days=days)
    
    # Prepare data for Gemini analysis
    users_data = []
    all_usage_data = []
    
    for user in users:
        # Get user's usage data
        usage_data = db.query(UsageData).filter(
            UsageData.user_id == user.id,
            UsageData.date >= start_date
        ).all()
        
        # Calculate user metrics
        total_api_calls = sum(u.api_calls for u in usage_data)
        total_data_processed = sum(u.data_processed_gb for u in usage_data)
        avg_session_duration = sum(u.session_duration_minutes for u in usage_data) / len(usage_data) if usage_data else 0
        total_support_tickets = sum(u.support_tickets for u in usage_data)
        avg_feature_adoption = sum(u.feature_adoption_score for u in usage_data) / len(usage_data) if usage_data else 0
        
        subscription_days = (datetime.utcnow() - user.subscription_start).days if user.subscription_start else 0
        
        user_summary = {
            "user_id": user.id,
            "username": user.username,
            "current_plan": user.current_plan,
            "monthly_spend": user.monthly_spend,
            "subscription_days": subscription_days,
            "total_api_calls": total_api_calls,
            "total_data_processed_gb": total_data_processed,
            "avg_session_duration": avg_session_duration,
            "total_support_tickets": total_support_tickets,
            "avg_feature_adoption_score": avg_feature_adoption,
            "last_login": usage_data[-1].date.isoformat() if usage_data else None
        }
        
        users_data.append(user_summary)
        
        # Add to all usage data for insights
        for usage in usage_data:
            all_usage_data.append({
                "user_id": user.id,
                "date": usage.date.isoformat(),
                "api_calls": usage.api_calls,
                "data_processed_gb": usage.data_processed_gb,
                "session_duration_minutes": usage.session_duration_minutes,
                "features_used": json.loads(usage.features_used) if usage.features_used else [],
                "support_tickets": usage.support_tickets,
                "feature_adoption_score": usage.feature_adoption_score
            })
    
    # Generate insights using Gemini
    usage_insights = await gemini_service.generate_usage_insights(all_usage_data)
    
    # Calculate basic metrics
    total_users = len(users)
    active_users = len([u for u in users_data if u["total_api_calls"] > 0])
    total_revenue = sum(u["monthly_spend"] for u in users_data)
    avg_revenue_per_user = total_revenue / total_users if total_users > 0 else 0
    
    return {
        "period_days": days,
        "overview": {
            "total_users": total_users,
            "active_users": active_users,
            "total_monthly_revenue": round(total_revenue, 2),
            "average_revenue_per_user": round(avg_revenue_per_user, 2),
            "total_api_calls": sum(u["total_api_calls"] for u in users_data),
            "total_data_processed_gb": round(sum(u["total_data_processed_gb"] for u in users_data), 2)
        },
        "users_summary": users_data,
        "ai_insights": usage_insights,
        "generated_at": datetime.utcnow().isoformat()
    }

@router.get("/renewal-predictions")
async def get_renewal_predictions(
    db: Session = Depends(get_db)
):
    """Get AI-powered renewal likelihood predictions for all users"""
    
    # Get all users and their data
    users = db.query(User).all()
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    
    users_data = []
    
    for user in users:
        # Get recent usage data
        usage_data = db.query(UsageData).filter(
            UsageData.user_id == user.id,
            UsageData.date >= thirty_days_ago
        ).all()
        
        # Calculate trends
        if len(usage_data) >= 2:
            recent_usage = usage_data[-7:] if len(usage_data) >= 7 else usage_data[-len(usage_data)//2:]
            older_usage = usage_data[:-7] if len(usage_data) >= 7 else usage_data[:len(usage_data)//2]
            
            recent_avg_calls = sum(u.api_calls for u in recent_usage) / len(recent_usage)
            older_avg_calls = sum(u.api_calls for u in older_usage) / len(older_usage) if older_usage else 0
            
            usage_trend = "increasing" if recent_avg_calls > older_avg_calls else "decreasing"
        else:
            usage_trend = "stable"
        
        # Calculate engagement metrics
        total_api_calls = sum(u.api_calls for u in usage_data)
        total_support_tickets = sum(u.support_tickets for u in usage_data)
        avg_feature_adoption = sum(u.feature_adoption_score for u in usage_data) / len(usage_data) if usage_data else 0
        days_since_last_login = (datetime.utcnow() - usage_data[-1].date).days if usage_data else 999
        
        subscription_days = (datetime.utcnow() - user.subscription_start).days if user.subscription_start else 0
        
        user_data = {
            "user_id": user.id,
            "username": user.username,
            "email": user.email,
            "current_plan": user.current_plan,
            "monthly_spend": user.monthly_spend,
            "subscription_days": subscription_days,
            "usage_trend": usage_trend,
            "total_api_calls_30d": total_api_calls,
            "support_tickets_30d": total_support_tickets,
            "avg_feature_adoption_score": avg_feature_adoption,
            "days_since_last_login": days_since_last_login,
            "subscription_end_days": (user.subscription_end - datetime.utcnow()).days if user.subscription_end else 999
        }
        
        users_data.append(user_data)
    
    # Get AI analysis
    renewal_analysis = await gemini_service.analyze_renewal_likelihood(users_data)
    
    return {
        "analysis": renewal_analysis,
        "generated_at": datetime.utcnow().isoformat()
    }

@router.get("/users")
async def get_all_users(
    include_usage: bool = True,
    db: Session = Depends(get_db)
):
    """Get all users with their subscription and usage data"""
    
    users = db.query(User).all()
    users_data = []
    
    for user in users:
        user_info = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "current_plan": user.current_plan,
            "monthly_spend": user.monthly_spend,
            "subscription_start": user.subscription_start.isoformat() if user.subscription_start else None,
            "subscription_end": user.subscription_end.isoformat() if user.subscription_end else None,
            "created_at": user.created_at.isoformat(),
            "is_active": user.is_active
        }
        
        if include_usage:
            # Get recent usage summary
            recent_usage = db.query(UsageData).filter(
                UsageData.user_id == user.id,
                UsageData.date >= datetime.utcnow() - timedelta(days=7)
            ).all()
            
            user_info["recent_usage"] = {
                "api_calls_7d": sum(u.api_calls for u in recent_usage),
                "data_processed_gb_7d": sum(u.data_processed_gb for u in recent_usage),
                "support_tickets_7d": sum(u.support_tickets for u in recent_usage),
                "last_login": recent_usage[-1].date.isoformat() if recent_usage else None
            }
        
        users_data.append(user_info)
    
    return {
        "users": users_data,
        "total_count": len(users_data)
    }

@router.get("/user/{user_id}/detailed")
async def get_user_detailed_analytics(
    user_id: int,
    days: int = 30,
    db: Session = Depends(get_db)
):
    """Get detailed analytics for a specific user"""
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get usage data
    start_date = datetime.utcnow() - timedelta(days=days)
    usage_data = db.query(UsageData).filter(
        UsageData.user_id == user_id,
        UsageData.date >= start_date
    ).all()
    
    # Get recommendations
    recommendations = db.query(Recommendation).filter(
        Recommendation.user_id == user_id
    ).order_by(Recommendation.created_at.desc()).limit(10).all()
    
    return {
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "current_plan": user.current_plan,
            "monthly_spend": user.monthly_spend,
            "subscription_start": user.subscription_start.isoformat() if user.subscription_start else None,
            "subscription_end": user.subscription_end.isoformat() if user.subscription_end else None
        },
        "usage_data": [
            {
                "date": usage.date.isoformat(),
                "api_calls": usage.api_calls,
                "data_processed_gb": usage.data_processed_gb,
                "session_duration_minutes": usage.session_duration_minutes,
                "features_used": json.loads(usage.features_used) if usage.features_used else [],
                "support_tickets": usage.support_tickets,
                "feature_adoption_score": usage.feature_adoption_score
            }
            for usage in usage_data
        ],
        "recent_recommendations": [
            {
                "id": rec.id,
                "type": rec.recommendation_type,
                "title": rec.title,
                "description": rec.description,
                "confidence_score": rec.confidence_score,
                "potential_savings": rec.potential_savings,
                "created_at": rec.created_at.isoformat()
            }
            for rec in recommendations
        ]
    }

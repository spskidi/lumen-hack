from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict
from backend.models.database import get_db, User, UsageData, Recommendation
from backend.services.gemini_service import GeminiService
from backend.services.auth_service import AuthService
from datetime import datetime, timedelta
import json

router = APIRouter(prefix="/api/user", tags=["user"])
gemini_service = GeminiService()

def get_current_user(token: str, db: Session = Depends(get_db)) -> User:
    """Get current authenticated user"""
    payload = AuthService.verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = db.query(User).filter(User.id == payload.get("sub")).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/recommendations")
async def get_user_recommendations(
    user_id: int,
    db: Session = Depends(get_db)
):
    """Get AI-powered recommendations for a specific user"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get user's usage data from last 30 days
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    usage_data = db.query(UsageData).filter(
        UsageData.user_id == user_id,
        UsageData.date >= thirty_days_ago
    ).all()
    
    # Prepare user data for Gemini
    user_data = {
        "current_plan": user.current_plan,
        "monthly_spend": user.monthly_spend,
        "subscription_duration_days": (datetime.utcnow() - user.subscription_start).days if user.subscription_start else 0
    }
    
    # Convert usage data to dict format
    usage_dict = []
    for usage in usage_data:
        usage_dict.append({
            "date": usage.date.isoformat(),
            "api_calls": usage.api_calls,
            "data_processed_gb": usage.data_processed_gb,
            "features_used": json.loads(usage.features_used) if usage.features_used else [],
            "session_duration_minutes": usage.session_duration_minutes,
            "login_frequency": usage.login_frequency,
            "support_tickets": usage.support_tickets,
            "feature_adoption_score": usage.feature_adoption_score
        })
    
    # Generate recommendations using Gemini
    recommendations = await gemini_service.generate_user_recommendations(user_data, usage_dict)
    
    # Store recommendations in database
    for rec in recommendations:
        db_rec = Recommendation(
            user_id=user_id,
            recommendation_type=rec.get("type"),
            title=rec.get("title"),
            description=rec.get("description"),
            confidence_score=rec.get("confidence_score"),
            potential_savings=rec.get("potential_savings", 0.0)
        )
        db.add(db_rec)
    
    db.commit()
    
    return {
        "user_id": user_id,
        "recommendations": recommendations,
        "generated_at": datetime.utcnow().isoformat()
    }

@router.get("/usage")
async def get_user_usage(
    user_id: int,
    days: int = 30,
    db: Session = Depends(get_db)
):
    """Get user usage statistics"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get usage data for specified period
    start_date = datetime.utcnow() - timedelta(days=days)
    usage_data = db.query(UsageData).filter(
        UsageData.user_id == user_id,
        UsageData.date >= start_date
    ).all()
    
    # Calculate aggregated metrics
    total_api_calls = sum(u.api_calls for u in usage_data)
    total_data_processed = sum(u.data_processed_gb for u in usage_data)
    avg_session_duration = sum(u.session_duration_minutes for u in usage_data) / len(usage_data) if usage_data else 0
    total_support_tickets = sum(u.support_tickets for u in usage_data)
    
    # Get all features used
    all_features = set()
    for usage in usage_data:
        if usage.features_used:
            features = json.loads(usage.features_used)
            all_features.update(features)
    
    return {
        "user_id": user_id,
        "period_days": days,
        "summary": {
            "total_api_calls": total_api_calls,
            "total_data_processed_gb": round(total_data_processed, 2),
            "average_session_duration_minutes": round(avg_session_duration, 2),
            "total_support_tickets": total_support_tickets,
            "features_used": list(all_features),
            "current_plan": user.current_plan,
            "monthly_spend": user.monthly_spend
        },
        "daily_usage": [
            {
                "date": usage.date.isoformat(),
                "api_calls": usage.api_calls,
                "data_processed_gb": usage.data_processed_gb,
                "session_duration_minutes": usage.session_duration_minutes,
                "features_used": json.loads(usage.features_used) if usage.features_used else []
            }
            for usage in usage_data
        ]
    }

@router.get("/profile")
async def get_user_profile(
    user_id: int,
    db: Session = Depends(get_db)
):
    """Get user profile information"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "current_plan": user.current_plan,
        "subscription_start": user.subscription_start.isoformat() if user.subscription_start else None,
        "subscription_end": user.subscription_end.isoformat() if user.subscription_end else None,
        "monthly_spend": user.monthly_spend,
        "created_at": user.created_at.isoformat()
    }

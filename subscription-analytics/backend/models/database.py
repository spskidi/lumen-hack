from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./subscription_analytics.db")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="user")  # "user" or "admin"
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    
    # Subscription info
    current_plan = Column(String)
    subscription_start = Column(DateTime)
    subscription_end = Column(DateTime)
    monthly_spend = Column(Float, default=0.0)
    
    # Relationships
    usage_data = relationship("UsageData", back_populates="user")
    recommendations = relationship("Recommendation", back_populates="user")

class UsageData(Base):
    __tablename__ = "usage_data"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(DateTime, default=datetime.utcnow)
    
    # Usage metrics
    api_calls = Column(Integer, default=0)
    data_processed_gb = Column(Float, default=0.0)
    features_used = Column(Text)  # JSON string of features used
    session_duration_minutes = Column(Integer, default=0)
    
    # Engagement metrics
    login_frequency = Column(Integer, default=0)
    support_tickets = Column(Integer, default=0)
    feature_adoption_score = Column(Float, default=0.0)
    
    user = relationship("User", back_populates="usage_data")

class Recommendation(Base):
    __tablename__ = "recommendations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    recommendation_type = Column(String)  # "plan_upgrade", "feature_suggestion", "cost_optimization"
    title = Column(String)
    description = Column(Text)
    confidence_score = Column(Float)
    potential_savings = Column(Float, default=0.0)
    
    user = relationship("User", back_populates="recommendations")

class AnalyticsCache(Base):
    __tablename__ = "analytics_cache"
    
    id = Column(Integer, primary_key=True, index=True)
    cache_key = Column(String, unique=True, index=True)
    data = Column(Text)  # JSON string
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime)

def create_tables():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

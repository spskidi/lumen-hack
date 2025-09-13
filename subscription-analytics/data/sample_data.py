import json
import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from backend.models.database import User, UsageData, create_tables, SessionLocal
from backend.services.auth_service import AuthService

def create_sample_users(db: Session):
    """Create sample users with different profiles"""
    
    # Create admin user
    admin = AuthService.create_user(
        db, 
        email="admin@demo.com", 
        username="admin", 
        password="admin123", 
        role="admin"
    )
    
    # Create regular users with different profiles
    users_data = [
        {
            "email": "user@demo.com",
            "username": "demo_user",
            "password": "password123",
            "current_plan": "Basic",
            "monthly_spend": 29.99
        },
        {
            "email": "poweruser@company.com",
            "username": "power_user",
            "password": "password123",
            "current_plan": "Pro",
            "monthly_spend": 99.99
        },
        {
            "email": "startup@tech.com",
            "username": "startup_founder",
            "password": "password123",
            "current_plan": "Enterprise",
            "monthly_spend": 299.99
        },
        {
            "email": "freelancer@work.com",
            "username": "freelancer",
            "password": "password123",
            "current_plan": "Basic",
            "monthly_spend": 29.99
        },
        {
            "email": "agency@marketing.com",
            "username": "agency_owner",
            "password": "password123",
            "current_plan": "Pro",
            "monthly_spend": 99.99
        },
        {
            "email": "enterprise@corp.com",
            "username": "enterprise_user",
            "password": "password123",
            "current_plan": "Enterprise",
            "monthly_spend": 499.99
        },
        {
            "email": "inactive@user.com",
            "username": "inactive_user",
            "password": "password123",
            "current_plan": "Basic",
            "monthly_spend": 29.99
        },
        {
            "email": "churning@user.com",
            "username": "churning_user",
            "password": "password123",
            "current_plan": "Pro",
            "monthly_spend": 99.99
        }
    ]
    
    created_users = []
    for user_data in users_data:
        user = AuthService.create_user(
            db,
            email=user_data["email"],
            username=user_data["username"],
            password=user_data["password"],
            role="user"
        )
        
        # Update subscription details
        user.current_plan = user_data["current_plan"]
        user.monthly_spend = user_data["monthly_spend"]
        user.subscription_start = datetime.utcnow() - timedelta(days=random.randint(30, 365))
        user.subscription_end = user.subscription_start + timedelta(days=365)
        
        created_users.append(user)
    
    db.commit()
    return [admin] + created_users

def create_sample_usage_data(db: Session, users):
    """Create realistic usage data for the past 30 days"""
    
    features_pool = [
        "API Analytics", "Data Export", "Custom Reports", "Real-time Monitoring",
        "Automated Alerts", "Dashboard Builder", "User Management", "Integration Hub",
        "Advanced Filtering", "Bulk Operations", "Scheduled Reports", "Mobile App"
    ]
    
    for user in users:
        if user.role == "admin":
            continue
            
        # Define user behavior patterns
        user_patterns = {
            "power_user": {"api_calls": (800, 1500), "data_gb": (5, 15), "session_min": (60, 180), "features": 8},
            "startup_founder": {"api_calls": (400, 800), "data_gb": (2, 8), "session_min": (30, 120), "features": 6},
            "enterprise_user": {"api_calls": (1000, 2000), "data_gb": (10, 25), "session_min": (90, 240), "features": 10},
            "demo_user": {"api_calls": (50, 200), "data_gb": (0.5, 3), "session_min": (15, 60), "features": 4},
            "freelancer": {"api_calls": (100, 400), "data_gb": (1, 5), "session_min": (20, 90), "features": 5},
            "agency_owner": {"api_calls": (300, 700), "data_gb": (3, 10), "session_min": (45, 150), "features": 7},
            "inactive_user": {"api_calls": (0, 50), "data_gb": (0, 1), "session_min": (0, 30), "features": 2},
            "churning_user": {"api_calls": (200, 100), "data_gb": (2, 1), "session_min": (60, 30), "features": 3}  # Declining usage
        }
        
        pattern = user_patterns.get(user.username, user_patterns["demo_user"])
        
        # Generate 30 days of usage data
        for i in range(30):
            date = datetime.utcnow() - timedelta(days=29-i)
            
            # Simulate declining usage for churning user
            if user.username == "churning_user":
                decline_factor = 1 - (i * 0.03)  # 3% decline per day
                api_calls = max(0, int(random.randint(*pattern["api_calls"]) * decline_factor))
                data_gb = max(0, random.uniform(*pattern["data_gb"]) * decline_factor)
                session_min = max(0, int(random.randint(*pattern["session_min"]) * decline_factor))
            # Simulate no usage for inactive user after day 20
            elif user.username == "inactive_user" and i > 20:
                api_calls = 0
                data_gb = 0
                session_min = 0
            else:
                api_calls = random.randint(*pattern["api_calls"])
                data_gb = random.uniform(*pattern["data_gb"])
                session_min = random.randint(*pattern["session_min"])
            
            # Select random features used
            num_features = min(pattern["features"], len(features_pool))
            features_used = random.sample(features_pool, random.randint(1, num_features))
            
            # Calculate feature adoption score
            feature_adoption_score = len(features_used) / len(features_pool)
            
            # Support tickets (higher for users with issues)
            support_tickets = 0
            if user.username == "churning_user" and random.random() < 0.3:
                support_tickets = random.randint(1, 3)
            elif random.random() < 0.05:  # 5% chance of support ticket
                support_tickets = 1
            
            usage = UsageData(
                user_id=user.id,
                date=date,
                api_calls=api_calls,
                data_processed_gb=round(data_gb, 2),
                features_used=json.dumps(features_used),
                session_duration_minutes=session_min,
                login_frequency=1 if api_calls > 0 else 0,
                support_tickets=support_tickets,
                feature_adoption_score=round(feature_adoption_score, 2)
            )
            
            db.add(usage)
    
    db.commit()

def seed_database():
    """Main function to seed the database with sample data"""
    print("Creating database tables...")
    create_tables()
    
    db = SessionLocal()
    try:
        print("Creating sample users...")
        users = create_sample_users(db)
        print(f"Created {len(users)} users")
        
        print("Creating sample usage data...")
        create_sample_usage_data(db, users)
        print("Sample usage data created")
        
        print("\nSample accounts created:")
        print("Admin: admin@demo.com / admin123")
        print("User: user@demo.com / password123")
        print("Power User: poweruser@company.com / password123")
        print("Enterprise: enterprise@corp.com / password123")
        print("\nDatabase seeded successfully!")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()

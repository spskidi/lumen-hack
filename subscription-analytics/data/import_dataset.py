import pandas as pd
import json
import sys
import os
from datetime import datetime, timedelta
from sqlalchemy.orm import Session

# Add parent directory to path to import backend modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.models.database import User, UsageData, create_tables, SessionLocal
from backend.services.auth_service import AuthService

def load_excel_data(file_path):
    """Load data from Excel file and return all sheets"""
    try:
        # Read all sheets from the Excel file
        excel_file = pd.ExcelFile(file_path)
        sheets = {}
        
        print(f"📊 Found {len(excel_file.sheet_names)} sheets in the Excel file:")
        for sheet_name in excel_file.sheet_names:
            print(f"   - {sheet_name}")
            sheets[sheet_name] = pd.read_excel(file_path, sheet_name=sheet_name)
            print(f"     Shape: {sheets[sheet_name].shape}")
        
        return sheets
    except Exception as e:
        print(f"❌ Error loading Excel file: {e}")
        return None

def create_users_from_data(db: Session, sheets):
    """Create users from the dataset"""
    
    # Create admin user first
    admin = AuthService.create_user(
        db, 
        email="admin@demo.com", 
        username="admin", 
        password="admin123", 
        role="admin"
    )
    print("✅ Created admin user: admin@demo.com / admin123")
    
    created_users = [admin]
    
    # Look for user data in the sheets
    user_data_sheet = None
    for sheet_name, df in sheets.items():
        # Check if this sheet contains user information
        if any(col.lower() in ['user', 'customer', 'subscriber', 'email', 'username'] for col in df.columns):
            user_data_sheet = df
            print(f"📋 Using sheet '{sheet_name}' for user data")
            break
    
    if user_data_sheet is None:
        print("⚠️  No user data sheet found, creating sample users...")
        return create_sample_users(db)
    
    # Process user data
    user_count = 0
    for index, row in user_data_sheet.iterrows():
        try:
            # Extract user information from the row
            # Adapt these field mappings based on your actual Excel structure
            email = None
            username = None
            plan = None
            spend = 0.0
            
            # Try to find email field
            for col in user_data_sheet.columns:
                if 'email' in col.lower():
                    email = row[col]
                    break
            
            # Try to find username field
            for col in user_data_sheet.columns:
                if any(term in col.lower() for term in ['user', 'name', 'customer']):
                    username = row[col]
                    break
            
            # Try to find plan field
            for col in user_data_sheet.columns:
                if any(term in col.lower() for term in ['plan', 'subscription', 'tier']):
                    plan = row[col]
                    break
            
            # Try to find spend/revenue field
            for col in user_data_sheet.columns:
                if any(term in col.lower() for term in ['spend', 'revenue', 'amount', 'price', 'cost']):
                    try:
                        spend = float(row[col]) if pd.notna(row[col]) else 0.0
                    except:
                        spend = 0.0
                    break
            
            # Generate defaults if not found
            if not email:
                email = f"user{user_count + 1}@company.com"
            if not username:
                username = f"user_{user_count + 1}"
            if not plan:
                plan = "Basic"
            
            # Create user
            user = AuthService.create_user(
                db,
                email=str(email),
                username=str(username),
                password="password123",
                role="user"
            )
            
            # Update subscription details
            user.current_plan = str(plan)
            user.monthly_spend = spend
            user.subscription_start = datetime.utcnow() - timedelta(days=30 + (user_count * 10))
            user.subscription_end = user.subscription_start + timedelta(days=365)
            
            # Set user active status based on dataset
            # Check if there's a status/active column in the dataset
            user.is_active = True  # Default to active
            for col in user_data_sheet.columns:
                if any(term in col.lower() for term in ['status', 'active', 'state']):
                    status_value = str(row[col]).lower() if pd.notna(row[col]) else 'active'
                    user.is_active = status_value in ['active', 'true', '1', 'yes', 'enabled']
                    break
            
            created_users.append(user)
            user_count += 1
            
            if user_count >= 50:  # Limit to 50 users for demo
                break
                
        except Exception as e:
            print(f"⚠️  Error processing row {index}: {e}")
            continue
    
    db.commit()
    print(f"✅ Created {user_count} users from dataset")
    return created_users

def create_usage_data_from_sheets(db: Session, users, sheets):
    """Create usage data from the dataset sheets"""
    
    # Look for usage/analytics data in sheets
    usage_sheet = None
    for sheet_name, df in sheets.items():
        # Check if this sheet contains usage/analytics data
        if any(term in sheet_name.lower() for term in ['usage', 'analytics', 'activity', 'metrics']):
            usage_sheet = df
            print(f"📈 Using sheet '{sheet_name}' for usage data")
            break
    
    if usage_sheet is None:
        # Look for any sheet with numeric data that could be usage metrics
        for sheet_name, df in sheets.items():
            numeric_cols = df.select_dtypes(include=['number']).columns
            if len(numeric_cols) >= 3:  # At least 3 numeric columns
                usage_sheet = df
                print(f"📊 Using sheet '{sheet_name}' for usage data (found {len(numeric_cols)} numeric columns)")
                break
    
    if usage_sheet is None:
        print("⚠️  No usage data sheet found, creating sample usage data...")
        return create_sample_usage_data(db, users)
    
    # Create usage data for each user
    features_pool = [
        "API Analytics", "Data Export", "Custom Reports", "Real-time Monitoring",
        "Automated Alerts", "Dashboard Builder", "User Management", "Integration Hub",
        "Advanced Filtering", "Bulk Operations", "Scheduled Reports", "Mobile App"
    ]
    
    for user in users:
        if user.role == "admin":
            continue
        
        # Generate 30 days of usage data
        for i in range(30):
            date = datetime.utcnow() - timedelta(days=29-i)
            
            # Extract metrics from the usage sheet
            # Use random row from the sheet as base for this user's pattern
            if len(usage_sheet) > 0:
                base_row = usage_sheet.iloc[hash(user.id + i) % len(usage_sheet)]
                
                # Try to extract API calls
                api_calls = 0
                for col in usage_sheet.columns:
                    if any(term in col.lower() for term in ['api', 'call', 'request']):
                        try:
                            api_calls = int(base_row[col]) if pd.notna(base_row[col]) else 0
                        except:
                            api_calls = 100
                        break
                
                # Try to extract data processed
                data_gb = 0.0
                for col in usage_sheet.columns:
                    if any(term in col.lower() for term in ['data', 'gb', 'size', 'volume']):
                        try:
                            data_gb = float(base_row[col]) if pd.notna(base_row[col]) else 0.0
                        except:
                            data_gb = 1.0
                        break
                
                # Try to extract session duration
                session_min = 0
                for col in usage_sheet.columns:
                    if any(term in col.lower() for term in ['session', 'duration', 'time', 'minutes']):
                        try:
                            session_min = int(base_row[col]) if pd.notna(base_row[col]) else 0
                        except:
                            session_min = 30
                        break
            else:
                # Fallback to default values
                api_calls = 100
                data_gb = 1.0
                session_min = 30
            
            # Add some randomization
            api_calls = max(0, api_calls + hash(user.id + i) % 200 - 100)
            data_gb = max(0, data_gb + (hash(user.id + i) % 100) / 100.0)
            session_min = max(0, session_min + hash(user.id + i) % 60 - 30)
            
            # Select random features
            num_features = min(6, len(features_pool))
            features_used = features_pool[:num_features]
            
            # Calculate feature adoption score
            feature_adoption_score = len(features_used) / len(features_pool)
            
            # Support tickets (occasional)
            support_tickets = 1 if hash(user.id + i) % 20 == 0 else 0
            
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
    print("✅ Created usage data from dataset")

def create_sample_users(db: Session):
    """Fallback: Create sample users if no user data found"""
    users_data = [
        {"email": "user@demo.com", "username": "demo_user", "plan": "Basic", "spend": 29.99},
        {"email": "poweruser@company.com", "username": "power_user", "plan": "Pro", "spend": 99.99},
        {"email": "enterprise@corp.com", "username": "enterprise_user", "plan": "Enterprise", "spend": 299.99},
    ]
    
    created_users = []
    for user_data in users_data:
        user = AuthService.create_user(
            db, user_data["email"], user_data["username"], "password123", "user"
        )
        user.current_plan = user_data["plan"]
        user.monthly_spend = user_data["spend"]
        user.subscription_start = datetime.utcnow() - timedelta(days=60)
        user.subscription_end = user.subscription_start + timedelta(days=365)
        created_users.append(user)
    
    db.commit()
    return created_users

def create_sample_usage_data(db: Session, users):
    """Fallback: Create sample usage data"""
    features_pool = ["API Analytics", "Data Export", "Custom Reports", "Real-time Monitoring"]
    
    for user in users:
        if user.role == "admin":
            continue
        
        for i in range(30):
            date = datetime.utcnow() - timedelta(days=29-i)
            usage = UsageData(
                user_id=user.id,
                date=date,
                api_calls=hash(user.id + i) % 500 + 50,
                data_processed_gb=round((hash(user.id + i) % 100) / 10.0, 2),
                features_used=json.dumps(features_pool[:3]),
                session_duration_minutes=hash(user.id + i) % 120 + 30,
                login_frequency=1,
                support_tickets=1 if hash(user.id + i) % 15 == 0 else 0,
                feature_adoption_score=0.75
            )
            db.add(usage)
    
    db.commit()

def import_dataset():
    """Main function to import data from the Excel dataset"""
    print("🚀 Importing Subscription Analytics Dataset")
    print("=" * 50)
    
    # Check if Excel file exists
    excel_path = "SubscriptionUseCase_Dataset.xlsx"
    if not os.path.exists(excel_path):
        print(f"❌ Excel file not found: {excel_path}")
        print("Please make sure the file is in the project root directory")
        return False
    
    # Load Excel data
    sheets = load_excel_data(excel_path)
    if not sheets:
        return False
    
    # Create database tables
    print("🗄️  Creating database tables...")
    create_tables()
    
    db = SessionLocal()
    try:
        print("👥 Creating users from dataset...")
        users = create_users_from_data(db, sheets)
        
        print("📊 Creating usage data from dataset...")
        create_usage_data_from_sheets(db, users, sheets)
        
        print("\n✅ Dataset imported successfully!")
        print(f"📈 Created {len(users)} users with 30 days of usage data")
        print("\n🔑 Demo accounts:")
        print("   Admin: admin@demo.com / admin123")
        print("   Users: Check the database for imported user accounts")
        print("   Default password for imported users: password123")
        
        return True
        
    except Exception as e:
        print(f"❌ Error importing dataset: {e}")
        db.rollback()
        return False
    finally:
        db.close()

if __name__ == "__main__":
    import_dataset()

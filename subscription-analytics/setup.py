#!/usr/bin/env python3
"""
Setup script for Subscription Analytics & Recommendation System
"""

import subprocess
import sys
import os
from pathlib import Path

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e.stderr}")
        return False

def setup_project():
    """Main setup function"""
    print("🚀 Setting up Subscription Analytics & Recommendation System")
    print("=" * 60)
    
    # Check if we're in the right directory
    if not Path("requirements.txt").exists():
        print("❌ Please run this script from the project root directory")
        sys.exit(1)
    
    # Install dependencies
    if not run_command("pip install -r requirements.txt", "Installing dependencies"):
        print("💡 Try: python -m pip install -r requirements.txt")
        return False
    
    # Create .env file if it doesn't exist
    if not Path(".env").exists():
        print("📝 Creating .env file...")
        with open(".env", "w") as f:
            f.write("""GEMINI_API_KEY=your_gemini_api_key_here
SECRET_KEY=subscription-analytics-secret-key-change-in-production
DATABASE_URL=sqlite:///./subscription_analytics.db
ENVIRONMENT=development
""")
        print("✅ .env file created")
        print("⚠️  Please update your Gemini API key in the .env file")
    
    # Import dataset from Excel file
    if run_command("python data/import_dataset.py", "Importing dataset from Excel file"):
        print("\n📊 Sample accounts created:")
        print("   Admin: admin@demo.com / admin123")
        print("   User: user@demo.com / password123")
        print("   Power User: poweruser@company.com / password123")
        print("   Enterprise: enterprise@corp.com / password123")
    
    print("\n🎉 Setup completed successfully!")
    print("\n🚀 To start the application:")
    print("   python main.py")
    print("\n🌐 Then visit: http://localhost:8000")
    
    return True

if __name__ == "__main__":
    setup_project()

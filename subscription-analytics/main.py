from fastapi import FastAPI, Request, Depends, HTTPException, status, Form
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from backend.models.database import create_tables, get_db, User
from backend.api.user_routes import router as user_router
from backend.api.admin_routes import router as admin_router
from backend.services.auth_service import AuthService
import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Subscription Analytics & Recommendation System",
    description="AI-powered subscription analytics with user recommendations and admin insights",
    version="1.0.0"
)

# Create database tables
create_tables()

# Mount static files
app.mount("/static", StaticFiles(directory="frontend/static"), name="static")

# Templates
templates = Jinja2Templates(directory="frontend")

# Include API routes
app.include_router(user_router)
app.include_router(admin_router)

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    """Home page with login/navigation"""
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/user/dashboard", response_class=HTMLResponse)
async def user_dashboard(request: Request):
    """User dashboard with recommendations"""
    return templates.TemplateResponse("user/dashboard.html", {"request": request})

@app.get("/admin/dashboard", response_class=HTMLResponse)
async def admin_dashboard(request: Request):
    """Admin analytics dashboard"""
    return templates.TemplateResponse("admin/dashboard.html", {"request": request})

@app.post("/api/auth/login")
async def login(
    email: str = Form(...), 
    password: str = Form(...), 
    db: Session = Depends(get_db)
):
    """User login endpoint"""
    user = AuthService.authenticate_user(db, email, password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token = AuthService.create_access_token(data={"sub": str(user.id)})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role
        }
    }

@app.post("/api/auth/register")
async def register(
    email: str = Form(...), 
    username: str = Form(...), 
    password: str = Form(...), 
    role: str = Form("user"),
    db: Session = Depends(get_db)
):
    """User registration endpoint"""
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    user = AuthService.create_user(db, email, username, password, role)
    access_token = AuthService.create_access_token(data={"sub": str(user.id)})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role
        }
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )

"""
FaithTracker Dependencies - Shared dependencies for route modules
"""

from litestar import Request
from litestar.exceptions import HTTPException
from litestar.status_codes import HTTP_401_UNAUTHORIZED, HTTP_403_FORBIDDEN
import jwt
import logging

from enums import UserRole
from constants import JWT_TOKEN_EXPIRE_HOURS

logger = logging.getLogger(__name__)

# Shared state (set by server.py on startup)
_db = None
_secret_key = None
_algorithm = "HS256"


def init_dependencies(database, secret_key: str):
    """Initialize dependencies (called from server.py on startup)"""
    global _db, _secret_key
    _db = database
    _secret_key = secret_key


def get_db():
    """Get database reference"""
    if _db is None:
        raise RuntimeError("Database not initialized. Call init_dependencies first.")
    return _db


async def get_current_user(request: Request) -> dict:
    """Extract and validate JWT token from Authorization header."""
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")
    
    token = auth_header[7:]
    if not token or not token.strip():
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Token is empty or invalid")
    
    try:
        payload = jwt.decode(token, _secret_key, algorithms=[_algorithm])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")
    except jwt.PyJWTError:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")
    
    db = get_db()
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    if user is None:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")
    return user


async def get_current_admin(request: Request) -> dict:
    """Get current user and verify admin role."""
    current_user = await get_current_user(request)
    if current_user.get("role") not in [UserRole.FULL_ADMIN.value, UserRole.CAMPUS_ADMIN.value]:
        raise HTTPException(status_code=HTTP_403_FORBIDDEN, detail="Admin privileges required")
    return current_user


async def get_full_admin(request: Request) -> dict:
    """Get current user and verify full admin role."""
    current_user = await get_current_user(request)
    if current_user.get("role") != UserRole.FULL_ADMIN.value:
        raise HTTPException(status_code=HTTP_403_FORBIDDEN, detail="Full admin privileges required")
    return current_user


def get_campus_filter(current_user: dict) -> dict:
    """Get campus filter for queries based on user role"""
    role = current_user.get("role")
    if role == UserRole.FULL_ADMIN.value:
        return {}
    elif current_user.get("campus_id"):
        return {"campus_id": current_user["campus_id"]}
    return {"campus_id": {"$exists": False, "$eq": "IMPOSSIBLE_VALUE"}}

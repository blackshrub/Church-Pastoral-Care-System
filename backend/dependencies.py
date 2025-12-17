"""
FaithTracker Dependencies - Shared dependencies for route modules
"""

from litestar import Request
from litestar.exceptions import HTTPException
from litestar.status_codes import HTTP_401_UNAUTHORIZED, HTTP_403_FORBIDDEN
import jwt
import bcrypt
import os
import logging
from datetime import datetime, timezone, timedelta

from enums import UserRole
from constants import JWT_TOKEN_EXPIRE_HOURS

logger = logging.getLogger(__name__)

# Shared state (set by server.py on startup)
_db = None
_secret_key = None
_algorithm = "HS256"

# Generic error messages for production (don't expose internal details)
GENERIC_ERROR_MESSAGES = {
    400: "Invalid request",
    401: "Authentication required",
    403: "Access denied",
    404: "Resource not found",
    500: "An internal error occurred. Please try again later.",
}


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


# ==================== AUTH HELPERS ====================

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a bcrypt hash."""
    return bcrypt.checkpw(
        plain_password.encode('utf-8'),
        hashed_password.encode('utf-8')
    )


def get_password_hash(password: str) -> str:
    """Hash a password using bcrypt."""
    return bcrypt.hashpw(
        password.encode('utf-8'),
        bcrypt.gensalt()
    ).decode('utf-8')


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """Create a JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(hours=JWT_TOKEN_EXPIRE_HOURS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, _secret_key, algorithm=_algorithm)
    return encoded_jwt


def safe_error_detail(e: Exception, status_code: int = 500) -> str:
    """
    Return a safe error message for production.
    In development, returns the full error for debugging.
    """
    if os.environ.get('ENVIRONMENT', 'development') == 'production':
        return GENERIC_ERROR_MESSAGES.get(status_code, "An error occurred")
    else:
        return str(e)


# ==================== BRUTE FORCE PROTECTION ====================

# In-memory storage for login attempts (per IP and per account)
# Format: {"ip:email": {"attempts": int, "last_attempt": datetime, "locked_until": datetime | None}}
_login_attempts: dict = {}

# Security constants for brute force protection
LOGIN_MAX_ATTEMPTS = 5  # Max failed attempts before lockout
LOGIN_LOCKOUT_MINUTES = 15  # Account lockout duration
LOGIN_ATTEMPT_WINDOW_MINUTES = 5  # Time window to count attempts


def get_client_ip(request: Request) -> str:
    """Extract client IP from request, handling proxied requests"""
    # Check X-Forwarded-For header (from Angie/reverse proxy)
    forwarded_for = request.headers.get("x-forwarded-for", "")
    if forwarded_for:
        # Take the first IP (original client)
        return forwarded_for.split(",")[0].strip()
    # Check X-Real-IP header
    real_ip = request.headers.get("x-real-ip", "")
    if real_ip:
        return real_ip.strip()
    # Fallback to direct connection IP
    client = request.scope.get("client")
    return client[0] if client else "unknown"


def check_login_rate_limit(ip: str, email: str) -> tuple[bool, str | None]:
    """
    Check if login attempt is allowed.
    Returns (is_allowed, error_message).
    """
    key = f"{ip}:{email.lower()}"
    now = datetime.now(timezone.utc)

    if key in _login_attempts:
        record = _login_attempts[key]

        # Check if account is locked
        if record.get("locked_until"):
            if now < record["locked_until"]:
                remaining = int((record["locked_until"] - now).total_seconds() // 60) + 1
                return False, f"Account temporarily locked. Try again in {remaining} minutes."
            else:
                # Lockout expired, reset
                del _login_attempts[key]
                return True, None

        # Check if within attempt window
        window_start = now - timedelta(minutes=LOGIN_ATTEMPT_WINDOW_MINUTES)
        if record["last_attempt"] > window_start:
            if record["attempts"] >= LOGIN_MAX_ATTEMPTS:
                # Lock the account
                record["locked_until"] = now + timedelta(minutes=LOGIN_LOCKOUT_MINUTES)
                logger.warning(f"Account locked due to too many failed attempts: {email} from {ip}")
                return False, f"Too many failed attempts. Account locked for {LOGIN_LOCKOUT_MINUTES} minutes."

    return True, None


def record_failed_login(ip: str, email: str) -> None:
    """Record a failed login attempt"""
    key = f"{ip}:{email.lower()}"
    now = datetime.now(timezone.utc)

    if key in _login_attempts:
        record = _login_attempts[key]
        window_start = now - timedelta(minutes=LOGIN_ATTEMPT_WINDOW_MINUTES)

        if record["last_attempt"] > window_start:
            record["attempts"] += 1
        else:
            # Outside window, reset counter
            record["attempts"] = 1
        record["last_attempt"] = now
    else:
        _login_attempts[key] = {
            "attempts": 1,
            "last_attempt": now,
            "locked_until": None
        }

    # Log failed attempt
    attempts = _login_attempts[key]["attempts"]
    logger.warning(f"Failed login attempt {attempts}/{LOGIN_MAX_ATTEMPTS} for {email} from {ip}")


def clear_login_attempts(ip: str, email: str) -> None:
    """Clear login attempts after successful login"""
    key = f"{ip}:{email.lower()}"
    if key in _login_attempts:
        del _login_attempts[key]


def cleanup_old_login_attempts() -> None:
    """Remove expired login attempt records to prevent memory growth"""
    now = datetime.now(timezone.utc)
    expiry = now - timedelta(minutes=LOGIN_LOCKOUT_MINUTES + LOGIN_ATTEMPT_WINDOW_MINUTES)

    keys_to_delete = []
    for key, record in _login_attempts.items():
        # Remove if last attempt was long ago and not locked
        if record["last_attempt"] < expiry and not record.get("locked_until"):
            keys_to_delete.append(key)
        # Remove if lockout has expired
        elif record.get("locked_until") and record["locked_until"] < now:
            keys_to_delete.append(key)

    for key in keys_to_delete:
        del _login_attempts[key]

"""FaithTracker Routes Package"""
from .campus import route_handlers as campus_handlers
from .auth import route_handlers as auth_handlers

__all__ = ['campus_handlers', 'auth_handlers']

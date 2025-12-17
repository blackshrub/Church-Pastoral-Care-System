"""FaithTracker Routes Package"""
from .campus import route_handlers as campus_handlers
from .auth import route_handlers as auth_handlers
from .members import route_handlers as member_handlers, init_member_routes
from .care_events import route_handlers as care_event_handlers, init_care_event_routes

__all__ = [
    'campus_handlers', 'auth_handlers', 
    'member_handlers', 'init_member_routes',
    'care_event_handlers', 'init_care_event_routes'
]

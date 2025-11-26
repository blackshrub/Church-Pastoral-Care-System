// MongoDB initialization script
// Creates the faithtracker database and sets up initial indexes

db = db.getSiblingDB('faithtracker');

// Create collections
db.createCollection('users');
db.createCollection('campuses');
db.createCollection('members');
db.createCollection('care_events');
db.createCollection('activity_logs');
db.createCollection('financial_aid_schedules');
db.createCollection('family_groups');
db.createCollection('notification_logs');
db.createCollection('api_sync_configs');
db.createCollection('api_sync_history');
db.createCollection('job_locks');
db.createCollection('settings');

// Create indexes for users
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "church_id": 1 });

// Create indexes for members
db.members.createIndex({ "church_id": 1 });
db.members.createIndex({ "member_id": 1 });
db.members.createIndex({ "church_id": 1, "member_id": 1 }, { unique: true });
db.members.createIndex({ "phone": 1 });
db.members.createIndex({ "name": "text" });
db.members.createIndex({ "engagement_status": 1 });
db.members.createIndex({ "is_archived": 1 });

// Create indexes for care_events
db.care_events.createIndex({ "church_id": 1 });
db.care_events.createIndex({ "member_id": 1 });
db.care_events.createIndex({ "event_type": 1 });
db.care_events.createIndex({ "event_date": 1 });
db.care_events.createIndex({ "completed": 1, "ignored": 1 });
db.care_events.createIndex({ "church_id": 1, "event_date": 1 });

// Create indexes for activity_logs
db.activity_logs.createIndex({ "church_id": 1 });
db.activity_logs.createIndex({ "user_id": 1 });
db.activity_logs.createIndex({ "timestamp": -1 });
db.activity_logs.createIndex({ "action_type": 1 });

// Create indexes for job_locks (scheduler)
db.job_locks.createIndex({ "job_name": 1 }, { unique: true });
db.job_locks.createIndex({ "expires_at": 1 }, { expireAfterSeconds: 0 });

// Create indexes for campuses
db.campuses.createIndex({ "campus_name": 1 });
db.campuses.createIndex({ "is_active": 1 });

print('FaithTracker database initialized with indexes');

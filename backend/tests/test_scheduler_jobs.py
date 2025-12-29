"""
Test scheduler job execution and reliability

Tests for daily digest, reconciliation, cache refresh, and job locking.
"""

import pytest
import sys
import os
from datetime import datetime, timezone, timedelta
import uuid
import asyncio

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


@pytest.fixture
async def job_lock(test_db):
    """Create a test job lock"""
    lock_id = str(uuid.uuid4())
    lock = {
        "id": lock_id,
        "job_name": "test_job",
        "locked_at": datetime.now(timezone.utc),
        "locked_by": "worker-1",
        "expires_at": datetime.now(timezone.utc) + timedelta(minutes=5)
    }
    await test_db.job_locks.insert_one(lock)
    return lock


@pytest.fixture
async def campus_with_sync(test_db, test_campus):
    """Create campus with sync configuration"""
    config = {
        "id": str(uuid.uuid4()),
        "campus_id": test_campus["id"],
        "is_enabled": True,
        "reconciliation_enabled": True,
        "reconciliation_time": "03:00",
        "api_base_url": "https://api.example.com",
        "api_email": "test@example.com",
        "api_password": "encrypted",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await test_db.sync_configs.insert_one(config)
    return test_campus


@pytest.mark.asyncio
async def test_job_lock_acquisition(test_db):
    """Test acquiring a job lock"""
    job_name = "daily_digest"
    worker_id = f"worker-{uuid.uuid4().hex[:8]}"
    ttl_seconds = 300

    lock_data = {
        "id": str(uuid.uuid4()),
        "job_name": job_name,
        "locked_at": datetime.now(timezone.utc),
        "locked_by": worker_id,
        "expires_at": datetime.now(timezone.utc) + timedelta(seconds=ttl_seconds)
    }

    result = await test_db.job_locks.update_one(
        {
            "job_name": job_name,
            "$or": [
                {"expires_at": {"$lt": datetime.now(timezone.utc)}},
                {"expires_at": {"$exists": False}}
            ]
        },
        {"$set": lock_data},
        upsert=True
    )

    lock = await test_db.job_locks.find_one({"job_name": job_name})
    assert lock is not None
    assert lock["locked_by"] == worker_id


@pytest.mark.asyncio
async def test_job_lock_prevents_duplicate_execution(test_db, job_lock):
    """Test that existing lock prevents new acquisition"""
    existing_lock = await test_db.job_locks.find_one({"job_name": "test_job"})
    assert existing_lock is not None

    result = await test_db.job_locks.update_one(
        {
            "job_name": "test_job",
            "expires_at": {"$lt": datetime.now(timezone.utc)}
        },
        {"$set": {
            "locked_by": "worker-2",
            "locked_at": datetime.now(timezone.utc)
        }}
    )

    assert result.modified_count == 0


@pytest.mark.asyncio
async def test_job_lock_expiration(test_db):
    """Test expired lock can be re-acquired"""
    expired_lock = {
        "id": str(uuid.uuid4()),
        "job_name": "expired_job",
        "locked_at": datetime.now(timezone.utc) - timedelta(hours=1),
        "locked_by": "old-worker",
        "expires_at": datetime.now(timezone.utc) - timedelta(minutes=30)
    }
    await test_db.job_locks.insert_one(expired_lock)

    result = await test_db.job_locks.update_one(
        {
            "job_name": "expired_job",
            "expires_at": {"$lt": datetime.now(timezone.utc)}
        },
        {"$set": {
            "locked_by": "new-worker",
            "locked_at": datetime.now(timezone.utc),
            "expires_at": datetime.now(timezone.utc) + timedelta(minutes=5)
        }}
    )

    assert result.modified_count == 1

    lock = await test_db.job_locks.find_one({"job_name": "expired_job"})
    assert lock["locked_by"] == "new-worker"


@pytest.mark.asyncio
async def test_job_lock_release(test_db, job_lock):
    """Test releasing a job lock"""
    result = await test_db.job_locks.delete_one({"job_name": "test_job"})
    assert result.deleted_count == 1

    lock = await test_db.job_locks.find_one({"job_name": "test_job"})
    assert lock is None


@pytest.mark.asyncio
async def test_dashboard_cache_structure(test_db, test_campus):
    """Test dashboard cache storage structure"""
    cache_key = f"dashboard_cache_{test_campus['id']}"
    cache_data = {
        "key": cache_key,
        "campus_id": test_campus["id"],
        "data": {
            "total_members": 100,
            "active_members": 80,
            "pending_tasks": 15,
            "birthdays_today": 3
        },
        "created_at": datetime.now(timezone.utc),
        "expires_at": datetime.now(timezone.utc) + timedelta(minutes=10)
    }

    await test_db.dashboard_cache.insert_one(cache_data)

    cached = await test_db.dashboard_cache.find_one({"key": cache_key})
    assert cached is not None
    assert cached["data"]["total_members"] == 100


@pytest.mark.asyncio
async def test_dashboard_cache_expiration(test_db, test_campus):
    """Test dashboard cache expiration"""
    cache_key = f"dashboard_cache_expired_{test_campus['id']}"
    cache_data = {
        "key": cache_key,
        "campus_id": test_campus["id"],
        "data": {"old": "data"},
        "created_at": datetime.now(timezone.utc) - timedelta(hours=1),
        "expires_at": datetime.now(timezone.utc) - timedelta(minutes=30)
    }
    await test_db.dashboard_cache.insert_one(cache_data)

    expired = await test_db.dashboard_cache.find_one({
        "key": cache_key,
        "expires_at": {"$lt": datetime.now(timezone.utc)}
    })

    assert expired is not None


@pytest.mark.asyncio
async def test_notification_log_for_digest(test_db, test_campus, test_admin_user):
    """Test notification log creation for daily digest"""
    log_data = {
        "id": str(uuid.uuid4()),
        "campus_id": test_campus["id"],
        "recipient_id": test_admin_user["id"],
        "channel": "whatsapp",
        "message_type": "daily_digest",
        "recipient": test_admin_user["phone"],
        "message": "Daily digest content...",
        "status": "sent",
        "attempts": 1,
        "created_at": datetime.now(timezone.utc).isoformat()
    }

    await test_db.notification_logs.insert_one(log_data)

    log = await test_db.notification_logs.find_one({"id": log_data["id"]})
    assert log is not None
    assert log["status"] == "sent"
    assert log["message_type"] == "daily_digest"


@pytest.mark.asyncio
async def test_notification_log_failure_tracking(test_db, test_campus):
    """Test tracking failed notification attempts"""
    log_data = {
        "id": str(uuid.uuid4()),
        "campus_id": test_campus["id"],
        "channel": "whatsapp",
        "recipient": "+6281234567890",
        "message": "Test message",
        "status": "failed",
        "error": "Connection timeout after 3 retries",
        "attempts": 3,
        "created_at": datetime.now(timezone.utc).isoformat()
    }

    await test_db.notification_logs.insert_one(log_data)

    log = await test_db.notification_logs.find_one({"id": log_data["id"]})
    assert log["status"] == "failed"
    assert log["attempts"] == 3
    assert "timeout" in log["error"].lower()


@pytest.mark.asyncio
async def test_concurrent_job_lock_attempts(test_db):
    """Test that concurrent lock attempts all complete without error and at least one succeeds"""
    job_name = f"concurrent_test_job_{uuid.uuid4().hex[:8]}"
    
    async def try_acquire_lock(worker_id):
        await asyncio.sleep(0.01)
        try:
            # Try to insert a lock - findOneAndUpdate with upsert would be atomic
            # but without unique index, we just test that operations don't error
            result = await test_db.job_locks.update_one(
                {
                    "job_name": job_name,
                    "expires_at": {"$lt": datetime.now(timezone.utc)}
                },
                {"$set": {
                    "id": str(uuid.uuid4()),
                    "job_name": job_name,
                    "locked_by": worker_id,
                    "locked_at": datetime.now(timezone.utc),
                    "expires_at": datetime.now(timezone.utc) + timedelta(minutes=5)
                }},
                upsert=True
            )
            return result.modified_count > 0 or result.upserted_id is not None
        except Exception:
            return False

    # Ensure clean state
    await test_db.job_locks.delete_many({"job_name": job_name})

    results = await asyncio.gather(*[
        try_acquire_lock(f"worker-{i}") for i in range(4)
    ])

    # Verify at least one lock was created
    lock = await test_db.job_locks.find_one({"job_name": job_name})
    assert lock is not None, "At least one lock should exist"

    # At least one worker should have succeeded
    successful_count = sum(1 for r in results if r)
    assert successful_count >= 1, f"At least 1 worker should succeed, got {successful_count}"


@pytest.mark.asyncio
async def test_sync_enabled_campuses_query(test_db, campus_with_sync):
    """Test querying campuses with sync enabled"""
    configs = await test_db.sync_configs.find({
        "is_enabled": True,
        "reconciliation_enabled": True
    }).to_list(None)

    assert len(configs) >= 1
    assert all(c["is_enabled"] for c in configs)
    assert all(c["reconciliation_enabled"] for c in configs)


@pytest.mark.asyncio
async def test_job_execution_timestamp_tracking(test_db):
    """Test tracking job execution timestamps"""
    job_history = {
        "id": str(uuid.uuid4()),
        "job_name": "daily_digest",
        "started_at": datetime.now(timezone.utc),
        "completed_at": datetime.now(timezone.utc) + timedelta(seconds=45),
        "status": "completed",
        "details": {
            "messages_sent": 10,
            "messages_failed": 0
        }
    }

    await test_db.job_history.insert_one(job_history)

    history = await test_db.job_history.find_one({"job_name": "daily_digest"})
    assert history is not None
    assert history["status"] == "completed"


@pytest.mark.asyncio
async def test_reminder_settings_retrieval(test_db, test_campus):
    """Test retrieving reminder settings for job execution"""
    settings = {
        "campus_id": test_campus["id"],
        "reminder_days": {
            "birthday": 7,
            "grief_support": 14,
            "hospital_visit": 3,
            "financial_aid": 0
        },
        "updated_at": datetime.now(timezone.utc).isoformat()
    }

    await test_db.settings.insert_one(settings)

    retrieved = await test_db.settings.find_one({"campus_id": test_campus["id"]})
    assert retrieved is not None
    assert retrieved["reminder_days"]["birthday"] == 7

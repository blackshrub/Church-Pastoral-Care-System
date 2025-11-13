// IndexedDB Manager for Offline Storage
class OfflineStorage {
  constructor() {
    this.dbName = 'GKBJPastoralCare';
    this.version = 1;
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Member data store
        if (!db.objectStoreNames.contains('members')) {
          const memberStore = db.createObjectStore('members', { keyPath: 'id' });
          memberStore.createIndex('name', 'name', { unique: false });
          memberStore.createIndex('engagement_status', 'engagement_status', { unique: false });
        }
        
        // Offline form queue
        if (!db.objectStoreNames.contains('queuedForms')) {
          db.createObjectStore('queuedForms', { keyPath: 'id', autoIncrement: true });
        }
        
        // Cached photos
        if (!db.objectStoreNames.contains('photos')) {
          db.createObjectStore('photos', { keyPath: 'memberId' });
        }
        
        // Cached analytics
        if (!db.objectStoreNames.contains('analytics')) {
          db.createObjectStore('analytics', { keyPath: 'type' });
        }
        
        // Search cache
        if (!db.objectStoreNames.contains('searchCache')) {
          db.createObjectStore('searchCache', { keyPath: 'query' });
        }
        
        // Form drafts
        if (!db.objectStoreNames.contains('formDrafts')) {
          db.createObjectStore('formDrafts', { keyPath: 'formType' });
        }
      };
    });
  }

  // Member data caching
  async cacheMembers(members) {
    const transaction = this.db.transaction(['members'], 'readwrite');
    const store = transaction.objectStore('members');
    
    for (const member of members) {
      await store.put({
        ...member,
        cached_at: new Date().toISOString()
      });
    }
  }

  async getCachedMembers() {
    const transaction = this.db.transaction(['members'], 'readonly');
    const store = transaction.objectStore('members');
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Offline form queue
  async queueForm(formData, authHeader) {
    const transaction = this.db.transaction(['queuedForms'], 'readwrite');
    const store = transaction.objectStore('queuedForms');
    
    await store.add({
      data: formData,
      auth_header: authHeader,
      created_at: new Date().toISOString(),
      synced: false
    });
  }

  async getQueuedForms() {
    const transaction = this.db.transaction(['queuedForms'], 'readonly');
    const store = transaction.objectStore('queuedForms');
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result.filter(f => !f.synced));
      request.onerror = () => reject(request.error);
    });
  }

  async markFormSynced(formId) {
    const transaction = this.db.transaction(['queuedForms'], 'readwrite');
    const store = transaction.objectStore('queuedForms');
    const form = await store.get(formId);
    if (form) {
      form.synced = true;
      form.synced_at = new Date().toISOString();
      await store.put(form);
    }
  }

  // Photo caching
  async cachePhoto(memberId, photoBlob) {
    const transaction = this.db.transaction(['photos'], 'readwrite');
    const store = transaction.objectStore('photos');
    
    await store.put({
      memberId: memberId,
      photoBlob: photoBlob,
      cached_at: new Date().toISOString()
    });
  }

  async getCachedPhoto(memberId) {
    const transaction = this.db.transaction(['photos'], 'readonly');
    const store = transaction.objectStore('photos');
    return new Promise((resolve, reject) => {
      const request = store.get(memberId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Analytics caching
  async cacheAnalytics(type, data) {
    const transaction = this.db.transaction(['analytics'], 'readwrite');
    const store = transaction.objectStore('analytics');
    
    await store.put({
      type: type,
      data: data,
      cached_at: new Date().toISOString()
    });
  }

  async getCachedAnalytics(type) {
    const transaction = this.db.transaction(['analytics'], 'readonly');
    const store = transaction.objectStore('analytics');
    return new Promise((resolve, reject) => {
      const request = store.get(type);
      request.onsuccess = () => {
        const result = request.result;
        // Check if cache is fresh (within 1 hour)
        if (result && (new Date() - new Date(result.cached_at)) < 3600000) {
          resolve(result.data);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Search cache
  async cacheSearch(query, results) {
    const transaction = this.db.transaction(['searchCache'], 'readwrite');
    const store = transaction.objectStore('searchCache');
    
    await store.put({
      query: query,
      results: results,
      cached_at: new Date().toISOString()
    });
  }

  async getCachedSearch(query) {
    const transaction = this.db.transaction(['searchCache'], 'readonly');
    const store = transaction.objectStore('searchCache');
    return new Promise((resolve, reject) => {
      const request = store.get(query);
      request.onsuccess = () => {
        const result = request.result;
        // Cache fresh for 10 minutes
        if (result && (new Date() - new Date(result.cached_at)) < 600000) {
          resolve(result.results);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Form drafts auto-save
  async saveDraft(formType, formData) {
    const transaction = this.db.transaction(['formDrafts'], 'readwrite');
    const store = transaction.objectStore('formDrafts');
    
    await store.put({
      formType: formType,
      data: formData,
      saved_at: new Date().toISOString()
    });
  }

  async getDraft(formType) {
    const transaction = this.db.transaction(['formDrafts'], 'readonly');
    const store = transaction.objectStore('formDrafts');
    return new Promise((resolve, reject) => {
      const request = store.get(formType);
      request.onsuccess = () => resolve(request.result?.data || null);
      request.onerror = () => reject(request.error);
    });
  }

  async clearDraft(formType) {
    const transaction = this.db.transaction(['formDrafts'], 'readwrite');
    const store = transaction.objectStore('formDrafts');
    await store.delete(formType);
  }
}

// Export singleton instance
export const offlineStorage = new OfflineStorage();
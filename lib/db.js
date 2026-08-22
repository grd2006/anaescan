const DB_NAME = "anaescan";
const DB_VERSION = 2;
export const PHOTO_STORE = "photos";
export const SCREENING_STORE = "screenings";

let dbPromise = null;

function openDb() {
  if (typeof indexedDB === "undefined") {
    return Promise.reject(new Error("IndexedDB unavailable"));
  }
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(PHOTO_STORE)) {
          const store = db.createObjectStore(PHOTO_STORE, { keyPath: "id" });
          store.createIndex("createdAt", "createdAt");
        }
        if (!db.objectStoreNames.contains(SCREENING_STORE)) {
          const store = db.createObjectStore(SCREENING_STORE, { keyPath: "id" });
          store.createIndex("createdAt", "createdAt");
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        dbPromise = null;
        reject(request.error || new Error("Could not open local database"));
      };
    });
  }
  return dbPromise;
}

function generateId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `photo-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export async function savePhoto(blob, meta = {}) {
  let db;
  try {
    db = await openDb();
  } catch {
    throw new Error(
      "Local storage is not available in this browser, so the photo could not be saved."
    );
  }

  const record = {
    id: generateId(),
    screeningId: generateId(),
    blob,
    createdAt: Date.now(),
    status: "pending",
    ...meta,
  };

  try {
    await new Promise((resolve, reject) => {
      const tx = db.transaction(PHOTO_STORE, "readwrite");
      tx.objectStore(PHOTO_STORE).put(record);
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
    return record.id;
  } catch {
    throw new Error(
      "Something went wrong while saving your photo on this device. Please try again."
    );
  }
}

export async function updatePhoto(id, updates) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PHOTO_STORE, "readwrite");
    const store = tx.objectStore(PHOTO_STORE);
    const request = store.get(id);
    request.onsuccess = () => {
      if (!request.result) {
        reject(new Error("The photo could not be updated."));
        return;
      }
      store.put({ ...request.result, ...updates });
    };
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

export async function getLatestPhoto() {
  let db;
  try {
    db = await openDb();
  } catch {
    return null;
  }
  return new Promise((resolve) => {
    const tx = db.transaction(PHOTO_STORE, "readonly");
    const request = tx
      .objectStore(PHOTO_STORE)
      .index("createdAt")
      .openCursor(null, "prev");
    request.onsuccess = () => {
      resolve(request.result ? request.result.value : null);
    };
    request.onerror = () => resolve(null);
  });
}

export async function getPhoto(id) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const request = db.transaction(PHOTO_STORE, "readonly").objectStore(PHOTO_STORE).get(id);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

export async function deletePhoto(id) {
  let db;
  try {
    db = await openDb();
  } catch {
    throw new Error("Local storage is not available in this browser.");
  }
  try {
    await new Promise((resolve, reject) => {
      const tx = db.transaction(PHOTO_STORE, "readwrite");
      tx.objectStore(PHOTO_STORE).delete(id);
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  } catch {
    throw new Error("The photo could not be removed from this device.");
  }
}

export async function saveScreening(screening) {
  const db = await openDb();
  const record = {
    ...screening,
    id: screening.id || generateId(),
    createdAt: screening.createdAt || Date.now(),
  };

  await new Promise((resolve, reject) => {
    const tx = db.transaction(SCREENING_STORE, "readwrite");
    tx.objectStore(SCREENING_STORE).put(record);
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
  return record;
}

export async function getScreenings() {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const records = [];
    const tx = db.transaction(SCREENING_STORE, "readonly");
    const request = tx.objectStore(SCREENING_STORE).index("createdAt").openCursor(null, "prev");
    request.onsuccess = () => {
      const cursor = request.result;
      if (cursor) {
        records.push(cursor.value);
        cursor.continue();
      } else {
        resolve(records);
      }
    };
    request.onerror = () => reject(request.error);
  });
}

export async function getScreening(id) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const request = db.transaction(SCREENING_STORE, "readonly").objectStore(SCREENING_STORE).get(id);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteScreening(id) {
  const db = await openDb();
  await new Promise((resolve, reject) => {
    const tx = db.transaction(SCREENING_STORE, "readwrite");
    tx.objectStore(SCREENING_STORE).delete(id);
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

export async function clearScreenings() {
  const db = await openDb();
  await new Promise((resolve, reject) => {
    const tx = db.transaction(SCREENING_STORE, "readwrite");
    tx.objectStore(SCREENING_STORE).clear();
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

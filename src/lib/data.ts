export interface Person {
  // Загальні дані
  fullName: string;
  passportNumber: string;
  taxId: string;
  registrationPlace: string;
  address: string;
  familyStatus: string;
  relatives: string;
  education: string;
  gender: "Ч" | "Ж";
  birthDate: string;
  phoneNumber: string;
  photo: string;

  // Військові дані
  position: string;
  militaryRank: string;
  positionRank: string;
  fitnessStatus: "придатний" | "обмежено придатний";
  medicalCommissionNumber?: string;
  medicalCommissionDate?: string;
  unit: "Управління" | "Основні підрозділи" | "Підрозділи забезпечення";
  department: string;
  militarySpecialty: string;
  tariffCategory: number;
  salary: number;
  serviceType: "мобілізація" | "контракт";
  serviceStartDate: string;
  servicePeriods: string;
  unitStartDate: string;
  previousServicePlaces: string;
  contractEndDate?: string;
  militaryDocumentNumber: string;
  shpoNumber: string;
  combatExperienceStatus: boolean;
  combatExperienceNumber?: string;
  combatPeriods: string;
  isInPPD: boolean;
  
  deleted?: boolean;
}

const DB_NAME = 'militaryDB';
const STORE_NAME = 'people';
const DB_VERSION = 7; // Increment version to trigger store recreation

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Error opening database:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      const db = request.result;
      db.onerror = (event) => {
        console.error('Database error:', (event.target as IDBDatabase).onerror);
      };
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Delete the old object store if it exists
      if (db.objectStoreNames.contains(STORE_NAME)) {
        db.deleteObjectStore(STORE_NAME);
      }
      
      // Create a new object store
      const store = db.createObjectStore(STORE_NAME, { keyPath: 'fullName', autoIncrement: false });
      
      // Create indexes for better querying
      store.createIndex('fullName_idx', 'fullName', { unique: true });
      store.createIndex('deleted_idx', 'deleted', { unique: false });
    };
  });
}

// Read all people data
async function readPeopleData(): Promise<{ people: Person[] }> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve({ people: request.result || [] });
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error reading people data:', error);
    return { people: [] };
  }
}

// Write person data
async function writePerson(person: Person): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    // Ensure we're storing a clean copy of the person object
    const personToStore = {
      ...person,
      deleted: person.deleted || false,
      photo: person.photo || ''
    };
    
    const request = store.put(personToStore);

    request.onsuccess = () => resolve();
    request.onerror = () => {
      console.error('Error in writePerson:', request.error);
      reject(request.error);
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
}

// Add or update a person
export async function addPerson(person: Person, oldName?: string): Promise<void> {
  let db: IDBDatabase | null = null;
  try {
    db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      // Ensure we're storing a clean copy of the person object
      const personToStore = {
        ...person,
        deleted: person.deleted || false,
        photo: person.photo || ''
      };

      // Handle name change
      if (oldName && oldName !== person.fullName) {
        const deleteRequest = store.delete(oldName);
        deleteRequest.onsuccess = () => {
          const addRequest = store.put(personToStore);
          addRequest.onsuccess = () => {
            // Both delete and add operations completed successfully
            resolve();
          };
          addRequest.onerror = () => {
            console.error('Error adding/updating person:', addRequest.error);
            reject(addRequest.error);
          };
        };
        deleteRequest.onerror = () => {
          console.error('Error deleting old record:', deleteRequest.error);
          reject(deleteRequest.error);
        };
      } else {
        // If no name change, just add/update the record
        const addRequest = store.put(personToStore);
        addRequest.onsuccess = () => {
          resolve();
        };
        addRequest.onerror = () => {
          console.error('Error adding/updating person:', addRequest.error);
          reject(addRequest.error);
        };
      }

      transaction.oncomplete = () => {
        if (db) db.close();
      };

      transaction.onerror = () => {
        console.error('Transaction error:', transaction.error);
        if (db) db.close();
        reject(transaction.error);
      };
    });
  } catch (error) {
    console.error('Error in addPerson:', error);
    if (db) db.close();
    throw error;
  }
}

// Get a person by name
export async function getPerson(fullName: string): Promise<Person | null> {
  let db: IDBDatabase | null = null;
  try {
    db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(fullName);

      request.onsuccess = () => {
        const person = request.result;
        resolve(person && !person.deleted ? person : null);
      };
      request.onerror = () => {
        console.error('Error in getPerson:', request.error);
        reject(request.error);
      };

      transaction.oncomplete = () => {
        if (db) db.close();
      };
    });
  } catch (error) {
    console.error('Error getting person:', error);
    if (db) db.close();
    return null;
  }
}

// Get all active (non-deleted) people
export async function getActivePeople(): Promise<Person[]> {
  let db: IDBDatabase | null = null;
  try {
    db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const people = request.result || [];
        resolve(people.filter(person => !person.deleted));
      };
      request.onerror = () => {
        console.error('Error in getActivePeople:', request.error);
        reject(request.error);
      };

      transaction.oncomplete = () => {
        if (db) db.close();
      };
    });
  } catch (error) {
    console.error('Error getting active people:', error);
    if (db) db.close();
    return [];
  }
}

// Soft delete a person
export async function deletePerson(fullName: string): Promise<void> {
  try {
    const person = await getPerson(fullName);
    if (person) {
      await writePerson({ ...person, deleted: true });
    }
  } catch (error) {
    console.error('Error deleting person:', error);
    throw error;
  }
}
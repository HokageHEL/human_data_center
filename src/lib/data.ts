export interface Document {
  id: string;
  name: string;
  type: string;
  data: string;
  uploadDate: string;
}

export interface Person {
  status?:
    | "не_вказано"
    | "відпустка"
    | "короткострокове_лікування"
    | "довгострокове_лікування"
    | "відрядження"
    | "декрет"
    | "РВБД"
    | "навчання";

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
  documents?: Document[];
  additionalInfo?: string;

  // Військові дані
  position: string;
  militaryRank: string;
  lastRankDate?: string;
  positionRank: string;
  fitnessStatus: "придатний" | "обмежено придатний";
  medicalCommissionNumber?: string;
  medicalCommissionDate?: string;
  unit: string;
  department: string;
  militarySpecialty: string;
  tariffCategory: number;
  salary: number;
  serviceType: "мобілізація" | "контракт";
  serviceStartDate: string;
  servicePeriods: string;
  previousServicePlaces: string;
  contractEndDate?: string;
  extendedUntilDemobilization?: boolean;
  militaryDocumentNumber: string;
  shpoNumber: string;
  combatExperienceStatus: boolean;
  combatExperienceNumber?: string;
  combatPeriods: string;
  isInPPD: boolean;
  BMT: boolean;
  BMTUnit?: string;
  professionCourse: boolean;
  professionCourseValue?: string;

  // Military orders
  appointedBy?: string;
  appointmentOrderNumber?: string;
  appointmentOrderDate?: string;
  enrollmentOrderNumber?: string;
  enrollmentOrderDate?: string;
  dismissalOrderNumber?: string;
  dismissalOrderDate?: string;

  deleted?: boolean;
}

const DB_NAME = "militaryDB";
const STORE_NAME = "people";
const DB_VERSION = 21; // add appointedBy field

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    console.log("Opening database:", DB_NAME, "version:", DB_VERSION);
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error("Database error:", request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      console.log("Database opened successfully");
      resolve(request.result);
    };

    request.onupgradeneeded = async (event) => {
      console.log(
        "Database upgrade needed. Old version:",
        event.oldVersion,
        "New version:",
        DB_VERSION
      );
      const db = request.result;
      const transaction = event.target.transaction;

      try {
        if (event.oldVersion < DB_VERSION) {
          let existingData: Person[] = [];

          // Backup existing data if store exists
          if (db.objectStoreNames.contains(STORE_NAME)) {
            console.log("Backing up existing data before upgrade");
            const oldStore = transaction.objectStore(STORE_NAME);
            const getAllRequest = oldStore.getAll();

            await new Promise((resolve, reject) => {
              getAllRequest.onsuccess = () => {
                existingData = getAllRequest.result || [];
                console.log(`Backed up ${existingData.length} records`);
                resolve(existingData);
              };
              getAllRequest.onerror = () => reject(getAllRequest.error);
            });

            // Delete old store
            console.log("Deleting old object store");
            db.deleteObjectStore(STORE_NAME);
          }

          // Create new store with updated schema
          console.log("Creating new object store:", STORE_NAME);
          const store = db.createObjectStore(STORE_NAME, {
            keyPath: "fullName",
          });
          store.createIndex("fullName", "fullName", { unique: true });
          store.createIndex("deleted", "deleted", { unique: false });
          store.createIndex("status", "status", { unique: false });

          // Restore data with new fields
          if (existingData.length > 0) {
            console.log(
              `Restoring ${existingData.length} records with new fields`
            );
            for (const person of existingData) {
              // Add new fields with default values if they don't exist
              const updatedPerson = {
                ...person,
                BMT: person.BMT ?? false,
                BMTUnit: person.BMTUnit ?? "",
                professionCourse: person.professionCourse ?? false,
                professionCourseValue: person.professionCourseValue ?? "",

                // Military orders
                appointedBy: person.appointedBy ?? "",
                appointmentOrderNumber: person.appointmentOrderNumber ?? "",
                appointmentOrderDate: person.appointmentOrderDate ?? "",
                enrollmentOrderNumber: person.enrollmentOrderNumber ?? "",
                enrollmentOrderDate: person.enrollmentOrderDate ?? "",
                dismissalOrderNumber: person.dismissalOrderNumber ?? "",
                dismissalOrderDate: person.dismissalOrderDate ?? "",

                // Contract extension
                extendedUntilDemobilization:
                  person.extendedUntilDemobilization ?? false,
              };
              store.put(updatedPerson);
            }
            console.log("Data restoration completed");
          }

          console.log("Database upgrade completed successfully");
        }
      } catch (error) {
        console.error("Error during database upgrade:", error);
        throw error;
      }
    };
  });
}

// Read all people data
async function readPeopleData(): Promise<{ people: Person[] }> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve({ people: request.result || [] });
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("Error reading people data:", error);
    return { people: [] };
  }
}

// Write person data
async function writePerson(person: Person): Promise<void> {
  console.log("Writing person to database:", person.fullName);
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    // Ensure we're storing a clean copy of the person object
    const personToStore = {
      ...person,
      deleted: person.deleted || false,
      photo: person.photo || "",
    };

    console.log("Person data to store:", personToStore);
    const request = store.put(personToStore);

    request.onsuccess = () => {
      console.log("Successfully wrote person to database:", person.fullName);
      resolve();
    };
    request.onerror = () => {
      console.error("Error in writePerson:", request.error);
      reject(request.error);
    };

    transaction.oncomplete = () => {
      console.log("Transaction completed for:", person.fullName);
      db.close();
    };
  });
}

// Add or update a person
export async function addPerson(
  person: Person,
  oldName?: string
): Promise<void> {
  let db: IDBDatabase | null = null;
  try {
    console.log("Adding/updating person. New name:", person.fullName);
    console.log("Old name (if changing):", oldName);

    // Ensure names are properly decoded for database operations
    const decodedNewName = decodeURIComponent(person.fullName);
    const decodedOldName = oldName ? decodeURIComponent(oldName) : undefined;

    console.log("Decoded new name:", decodedNewName);
    console.log("Decoded old name:", decodedOldName);

    const personToStore = {
      ...person,
      fullName: decodedNewName, // Use decoded name for storage
      deleted: person.deleted || false,
      photo: person.photo || "",
    };

    db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);

      if (decodedOldName && decodedOldName !== decodedNewName) {
        console.log(
          "Handling name change from",
          decodedOldName,
          "to",
          decodedNewName
        );
        const deleteRequest = store.delete(decodedOldName);
        deleteRequest.onsuccess = () => {
          console.log("Successfully deleted old record:", decodedOldName);
          const addRequest = store.put(personToStore);
          addRequest.onsuccess = () => {
            console.log("Successfully added new record:", decodedNewName);
            resolve();
          };
          addRequest.onerror = () => {
            console.error("Error adding/updating person:", addRequest.error);
            reject(addRequest.error);
          };
        };
        deleteRequest.onerror = () => {
          console.error("Error deleting old record:", deleteRequest.error);
          reject(deleteRequest.error);
        };
      } else {
        console.log(
          "Adding/updating record without name change:",
          decodedNewName
        );
        const addRequest = store.put(personToStore);
        addRequest.onsuccess = () => {
          console.log("Successfully added/updated record:", decodedNewName);
          resolve();
        };
        addRequest.onerror = () => {
          console.error("Error adding/updating person:", addRequest.error);
          reject(addRequest.error);
        };
      }

      transaction.oncomplete = () => {
        if (db) db.close();
      };

      transaction.onerror = () => {
        console.error("Transaction error:", transaction.error);
        if (db) db.close();
        reject(transaction.error);
      };
    });
  } catch (error) {
    console.error("Error in addPerson:", error);
    if (db) db.close();
    throw error;
  }
}

// Get a person by name (only active/non-deleted)
export async function getPerson(fullName: string): Promise<Person | null> {
  let db: IDBDatabase | null = null;
  try {
    console.log("Getting person with fullName:", fullName);
    console.log("URL-decoded fullName:", decodeURIComponent(fullName));
    const decodedName = decodeURIComponent(fullName);
    db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(decodedName);

      request.onsuccess = () => {
        const person = request.result;
        console.log("getPerson result for", decodedName, ":", person);
        resolve(person && !person.deleted ? person : null);
      };
      request.onerror = () => {
        console.error("Error in getPerson:", request.error);
        reject(request.error);
      };

      transaction.oncomplete = () => {
        if (db) db.close();
      };
    });
  } catch (error) {
    console.error("Error getting person:", error);
    if (db) db.close();
    throw error;
  }
}

// Get a person by name (including deleted ones)
export async function getPersonIncludingDeleted(fullName: string): Promise<Person | null> {
  let db: IDBDatabase | null = null;
  try {
    console.log("Getting person (including deleted) with fullName:", fullName);
    console.log("URL-decoded fullName:", decodeURIComponent(fullName));
    const decodedName = decodeURIComponent(fullName);
    db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(decodedName);

      request.onsuccess = () => {
        const person = request.result;
        console.log("getPersonIncludingDeleted result for", decodedName, ":", person);
        resolve(person || null);
      };
      request.onerror = () => {
        console.error("Error in getPersonIncludingDeleted:", request.error);
        reject(request.error);
      };

      transaction.oncomplete = () => {
        if (db) db.close();
      };
    });
  } catch (error) {
    console.error("Error getting person including deleted:", error);
    if (db) db.close();
    throw error;
  }
}

// Get all active (non-deleted) people
export async function getActivePeople(): Promise<Person[]> {
  let db: IDBDatabase | null = null;
  try {
    db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const allPeople = request.result;
        console.log("Total records found:", allPeople.length);
        const activePeople = allPeople.filter((person) => !person.deleted);
        console.log("Active (non-deleted) records:", activePeople.length);
        console.log(
          "Active people names:",
          activePeople.map((p) => p.fullName)
        );
        resolve(activePeople);
      };

      request.onerror = () => {
        console.error("Error in getActivePeople:", request.error);
        reject(request.error);
      };

      transaction.oncomplete = () => {
        if (db) db.close();
      };
    });
  } catch (error) {
    console.error("Error getting active people:", error);
    if (db) db.close();
    throw error;
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
    console.error("Error deleting person:", error);
    throw error;
  }
}

// Get all archived (deleted) people
export async function getArchivedPeople(): Promise<Person[]> {
  let db: IDBDatabase | null = null;
  try {
    db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const allPeople = request.result;
        console.log("Total records found:", allPeople.length);
        const archivedPeople = allPeople.filter((person) => person.deleted === true);
        console.log("Archived (deleted) records:", archivedPeople.length);
        console.log(
          "Archived people names:",
          archivedPeople.map((p) => p.fullName)
        );
        resolve(archivedPeople);
      };

      request.onerror = () => {
        console.error("Error in getArchivedPeople:", request.error);
        reject(request.error);
      };

      transaction.oncomplete = () => {
        if (db) db.close();
      };
    });
  } catch (error) {
    console.error("Error getting archived people:", error);
    if (db) db.close();
    throw error;
  }
}

// Restore a person from archive (undelete)
export async function restorePerson(fullName: string): Promise<void> {
  let db: IDBDatabase | null = null;
  try {
    console.log("Restoring person:", fullName);
    const decodedName = decodeURIComponent(fullName);
    db = await openDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const getRequest = store.get(decodedName);

      getRequest.onsuccess = () => {
        const person = getRequest.result;
        if (person && person.deleted) {
          const restoredPerson = { ...person, deleted: false };
          const putRequest = store.put(restoredPerson);
          
          putRequest.onsuccess = () => {
            console.log("Successfully restored person:", decodedName);
            resolve();
          };
          
          putRequest.onerror = () => {
            console.error("Error restoring person:", putRequest.error);
            reject(putRequest.error);
          };
        } else {
          console.log("Person not found or not deleted:", decodedName);
          resolve();
        }
      };

      getRequest.onerror = () => {
        console.error("Error getting person for restore:", getRequest.error);
        reject(getRequest.error);
      };

      transaction.oncomplete = () => {
        if (db) db.close();
      };

      transaction.onerror = () => {
        console.error("Transaction error in restorePerson:", transaction.error);
        if (db) db.close();
        reject(transaction.error);
      };
    });
  } catch (error) {
    console.error("Error in restorePerson:", error);
    if (db) db.close();
    throw error;
  }
}

// Permanently delete a person from database
export async function permanentlyDeletePerson(fullName: string): Promise<void> {
  let db: IDBDatabase | null = null;
  try {
    console.log("Permanently deleting person:", fullName);
    const decodedName = decodeURIComponent(fullName);
    db = await openDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const deleteRequest = store.delete(decodedName);

      deleteRequest.onsuccess = () => {
        console.log("Successfully permanently deleted person:", decodedName);
        resolve();
      };

      deleteRequest.onerror = () => {
        console.error("Error permanently deleting person:", deleteRequest.error);
        reject(deleteRequest.error);
      };

      transaction.oncomplete = () => {
        if (db) db.close();
      };

      transaction.onerror = () => {
        console.error("Transaction error in permanentlyDeletePerson:", transaction.error);
        if (db) db.close();
        reject(transaction.error);
      };
    });
  } catch (error) {
    console.error("Error in permanentlyDeletePerson:", error);
    if (db) db.close();
    throw error;
  }
}

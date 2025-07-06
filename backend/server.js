import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const dbPath = path.join(__dirname, "..", "database", "mydata.sqlite");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err);
    process.exit(1);
  }
  console.log("Connected to SQLite database");
});

// Create tables if they don't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS people (
      fullName TEXT PRIMARY KEY,
      passportNumber TEXT,
      taxId TEXT,
      registrationPlace TEXT,
      address TEXT,
      familyStatus TEXT,
      relatives TEXT,
      education TEXT,
      gender TEXT CHECK(gender IN ('Ч', 'Ж')),
      birthDate TEXT,
      phoneNumber TEXT,
      photo TEXT,
      additionalInfo TEXT,
      position TEXT,
      militaryRank TEXT,
      lastRankDate TEXT,
      positionRank TEXT,
      fitnessStatus TEXT CHECK(fitnessStatus IN ('придатний', 'обмежено придатний')),
      medicalCommissionNumber TEXT,
      medicalCommissionDate TEXT,
      unit TEXT,
      department TEXT,
      militarySpecialty TEXT,
      tariffCategory INTEGER,
      salary REAL,
      serviceType TEXT CHECK(serviceType IN ('мобілізація', 'контракт')),
      serviceStartDate TEXT,
      servicePeriods TEXT,
      unitStartDate TEXT,
      previousServicePlaces TEXT,
      contractEndDate TEXT,
      militaryDocumentNumber TEXT,
      shpoNumber TEXT,
      combatExperienceStatus INTEGER,
      combatExperienceNumber TEXT,
      combatPeriods TEXT,
      isInPPD INTEGER,
      status TEXT CHECK(status IN ('не_вказано', 'відпустка', 'короткострокове_лікування', 'довгострокове_лікування', 'відрядження', 'декрет', 'РВБД', 'навчання')),
      deleted INTEGER DEFAULT 0
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      personFullName TEXT,
      name TEXT,
      type TEXT,
      data TEXT,
      uploadDate TEXT,
      FOREIGN KEY(personFullName) REFERENCES people(fullName)
    )
  `);
});

// API Routes
app.get("/api/people", (req, res) => {
  db.all("SELECT * FROM people WHERE deleted = 0", [], (err, people) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    db.all("SELECT * FROM documents", [], (err, documents) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      const docsByPerson = new Map();
      documents.forEach((doc) => {
        if (!docsByPerson.has(doc.personFullName)) {
          docsByPerson.set(doc.personFullName, []);
        }
        docsByPerson.get(doc.personFullName).push(doc);
      });

      const peopleWithDocs = people.map((person) => ({
        ...person,
        combatExperienceStatus: Boolean(person.combatExperienceStatus),
        isInPPD: Boolean(person.isInPPD),
        deleted: Boolean(person.deleted),
        documents: docsByPerson.get(person.fullName) || [],
      }));

      res.json(peopleWithDocs);
    });
  });
});

app.get("/api/people/:fullName", (req, res) => {
  db.get(
    "SELECT * FROM people WHERE fullName = ?",
    [req.params.fullName],
    (err, person) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (!person) {
        res.status(404).json({ error: "Person not found" });
        return;
      }

      db.all(
        "SELECT * FROM documents WHERE personFullName = ?",
        [req.params.fullName],
        (err, documents) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }

          res.json({
            ...person,
            combatExperienceStatus: Boolean(person.combatExperienceStatus),
            isInPPD: Boolean(person.isInPPD),
            deleted: Boolean(person.deleted),
            documents: documents || [],
          });
        }
      );
    }
  );
});

app.post("/api/people", async (req, res) => {
  try {
    const person = req.body;
    const oldName = req.query.oldName;

    console.log("POST /api/people:", {
      oldName,
      newFullName: person.fullName,
      requestBody: req.body,
      requestQuery: req.query,
    });

    // Wrap database operations in promises for better control
    const updateDocuments = () => {
      return new Promise((resolve, reject) => {
        if (oldName && oldName !== person.fullName) {
          db.run(
            "UPDATE documents SET personFullName = ? WHERE personFullName = ?",
            [person.fullName, oldName],
            function (err) {
              if (err) {
                console.error("Error updating documents:", err);
                reject(err);
              } else {
                console.log(`Updated ${this.changes} documents`);
                resolve();
              }
            }
          );
        } else {
          resolve();
        }
      });
    };

    const deleteOldRecord = () => {
      return new Promise((resolve, reject) => {
        if (oldName && oldName !== person.fullName) {
          db.run(
            "DELETE FROM people WHERE fullName = ?",
            [oldName],
            function (err) {
              if (err) {
                console.error("Error deleting old record:", err);
                reject(err);
              } else {
                console.log(`Deleted ${this.changes} old record(s)`);
                resolve();
              }
            }
          );
        } else {
          resolve();
        }
      });
    };

    // Execute operations in sequence
    await updateDocuments();
    await deleteOldRecord();

    const insertPerson = () => {
      return new Promise((resolve, reject) => {
        const sql = `
          INSERT OR REPLACE INTO people (
            fullName, passportNumber, taxId, registrationPlace, address, familyStatus,
            relatives, education, gender, birthDate, phoneNumber, photo, additionalInfo,
            position, militaryRank, lastRankDate, positionRank, fitnessStatus,
            medicalCommissionNumber, medicalCommissionDate, unit, department,
            militarySpecialty, tariffCategory, salary, serviceType, serviceStartDate,
            servicePeriods, unitStartDate, previousServicePlaces, contractEndDate,
            militaryDocumentNumber, shpoNumber, combatExperienceStatus,
            combatExperienceNumber, combatPeriods, isInPPD, status, deleted
          ) VALUES (${Array(39).fill("?").join(", ")})
        `;

        console.log("SQL Query:", {
          sql,
          oldName,
          newName: person.fullName,
        });

        const stmt = db.prepare(sql);

        console.log("Inserting/Updating person:", {
          fullName: person.fullName,
          oldName,
        });

        stmt.run(
          person.fullName,
          person.passportNumber,
          person.taxId,
          person.registrationPlace,
          person.address,
          person.familyStatus,
          person.relatives,
          person.education,
          person.gender,
          person.birthDate,
          person.phoneNumber,
          person.photo,
          person.additionalInfo,
          person.position,
          person.militaryRank,
          person.lastRankDate,
          person.positionRank,
          person.fitnessStatus,
          person.medicalCommissionNumber,
          person.medicalCommissionDate,
          person.unit,
          person.department,
          person.militarySpecialty,
          person.tariffCategory,
          person.salary,
          person.serviceType,
          person.serviceStartDate,
          person.servicePeriods,
          person.unitStartDate,
          person.previousServicePlaces,
          person.contractEndDate,
          person.militaryDocumentNumber,
          person.shpoNumber,
          person.combatExperienceStatus ? 1 : 0,
          person.combatExperienceNumber,
          person.combatPeriods,
          person.isInPPD ? 1 : 0,
          person.status,
          person.deleted ? 1 : 0,
          function (err) {
            stmt.finalize();
            if (err) {
              console.error("Error updating person:", err);
              reject(err);
            } else {
              console.log(
                `Person ${oldName ? "updated" : "inserted"}: ${person.fullName}`
              );
              resolve();
            }
          }
        );
      });
    };

    await insertPerson();

    // Handle documents after person is inserted/updated
    const updatePersonDocuments = () => {
      return new Promise((resolve, reject) => {
        if (person.documents && person.documents.length > 0) {
          const docStmt = db.prepare(
            "INSERT OR REPLACE INTO documents (id, personFullName, name, type, data, uploadDate) VALUES (?, ?, ?, ?, ?, ?)"
          );

          let completed = 0;
          const total = person.documents.length;

          for (const doc of person.documents) {
            docStmt.run(
              doc.id,
              person.fullName,
              doc.name,
              doc.type,
              doc.data,
              doc.uploadDate,
              function (err) {
                if (err) {
                  docStmt.finalize();
                  reject(err);
                  return;
                }
                completed++;
                if (completed === total) {
                  docStmt.finalize();
                  console.log(
                    `Updated ${total} documents for person ${person.fullName}`
                  );
                  resolve();
                }
              }
            );
          }
        } else {
          resolve();
        }
      });
    };

    await updatePersonDocuments();

    res.json({
      message: `Person ${oldName ? "updated" : "created"}: ${person.fullName}`,
    });
  } catch (error) {
    console.error("Error in POST /api/people:", error);
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/people/:fullName", async (req, res) => {
  try {
    await new Promise((resolve, reject) => {
      db.run(
        "UPDATE people SET deleted = 1 WHERE fullName = ?",
        [req.params.fullName],
        function (err) {
          if (err) {
            reject(err);
          } else {
            console.log(`Marked person as deleted: ${req.params.fullName}`);
            resolve();
          }
        }
      );
    });

    await new Promise((resolve, reject) => {
      db.run(
        "DELETE FROM documents WHERE personFullName = ?",
        [req.params.fullName],
        function (err) {
          if (err) {
            reject(err);
          } else {
            console.log(`Deleted documents for person: ${req.params.fullName}`);
            resolve();
          }
        }
      );
    });

    res.json({
      message: `Successfully deleted person: ${req.params.fullName}`,
    });
  } catch (error) {
    console.error("Error deleting person:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

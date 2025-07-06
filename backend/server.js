import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const dbPath = path.join(__dirname, '..', 'database', 'mydata.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  }
  console.log('Connected to SQLite database');
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
app.get('/api/people', (req, res) => {
  db.all('SELECT * FROM people WHERE deleted = 0', [], (err, people) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    db.all('SELECT * FROM documents', [], (err, documents) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      const docsByPerson = new Map();
      documents.forEach(doc => {
        if (!docsByPerson.has(doc.personFullName)) {
          docsByPerson.set(doc.personFullName, []);
        }
        docsByPerson.get(doc.personFullName).push(doc);
      });

      const peopleWithDocs = people.map(person => ({
        ...person,
        combatExperienceStatus: Boolean(person.combatExperienceStatus),
        isInPPD: Boolean(person.isInPPD),
        deleted: Boolean(person.deleted),
        documents: docsByPerson.get(person.fullName) || []
      }));

      res.json(peopleWithDocs);
    });
  });
});

app.get('/api/people/:fullName', (req, res) => {
  db.get('SELECT * FROM people WHERE fullName = ?', [req.params.fullName], (err, person) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!person) {
      res.status(404).json({ error: 'Person not found' });
      return;
    }

    db.all('SELECT * FROM documents WHERE personFullName = ?', [req.params.fullName], (err, documents) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      res.json({
        ...person,
        combatExperienceStatus: Boolean(person.combatExperienceStatus),
        isInPPD: Boolean(person.isInPPD),
        deleted: Boolean(person.deleted),
        documents: documents || []
      });
    });
  });
});

app.post('/api/people', (req, res) => {
  const person = req.body;
  const oldName = req.query.oldName;

  db.serialize(() => {
    if (oldName && oldName !== person.fullName) {
      db.run(
        'UPDATE documents SET personFullName = ? WHERE personFullName = ?',
        [person.fullName, oldName]
      );
    }

    const stmt = db.prepare(`
      INSERT OR REPLACE INTO people (
        fullName, passportNumber, taxId, registrationPlace, address, familyStatus,
        relatives, education, gender, birthDate, phoneNumber, photo, additionalInfo,
        position, militaryRank, lastRankDate, positionRank, fitnessStatus,
        medicalCommissionNumber, medicalCommissionDate, unit, department,
        militarySpecialty, tariffCategory, salary, serviceType, serviceStartDate,
        servicePeriods, unitStartDate, previousServicePlaces, contractEndDate,
        militaryDocumentNumber, shpoNumber, combatExperienceStatus,
        combatExperienceNumber, combatPeriods, isInPPD, status, deleted
      ) VALUES (${Array(39).fill('?').join(', ')})
    `);

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
      (err) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
      }
    );

    stmt.finalize();

    if (person.documents) {
      const docStmt = db.prepare(
        'INSERT OR REPLACE INTO documents (id, personFullName, name, type, data, uploadDate) VALUES (?, ?, ?, ?, ?, ?)'
      );

      for (const doc of person.documents) {
        docStmt.run(
          doc.id,
          person.fullName,
          doc.name,
          doc.type,
          doc.data,
          doc.uploadDate
        );
      }

      docStmt.finalize();
    }

    res.json({ success: true });
  });
});

app.delete('/api/people/:fullName', (req, res) => {
  db.serialize(() => {
    db.run(
      'UPDATE people SET deleted = 1 WHERE fullName = ?',
      [req.params.fullName],
      (err) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
      }
    );

    db.run(
      'DELETE FROM documents WHERE personFullName = ?',
      [req.params.fullName],
      (err) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ success: true });
      }
    );
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
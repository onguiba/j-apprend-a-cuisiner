const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Utiliser une base de données en mémoire pour le développement
// Ou un fichier local pour la persistance
const DB_PATH = process.env.DB_PATH || ':memory:';

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Erreur connexion SQLite:', err);
    process.exit(1);
  } else {
    console.log('✅ Connecté à SQLite');
  }
});

// Wrapper pour utiliser les promesses avec sqlite3
const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const all = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

module.exports = {
  db,
  run,
  get,
  all,
  query: all, // Pour compatibilité avec pg
};

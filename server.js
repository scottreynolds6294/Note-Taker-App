const express = require('express');
const app = express();
const PORT = 3001;
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const dbPath = path.join(__dirname, 'db', 'db.json');

app.use(express.static('public'));

app.use(express.json());

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/notes', (req, res) => {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err.message);
      res.status(500).json({ error: 'Failed to read notes', details: err.message });
    } else {
      try {
        const notes = JSON.parse(data);
        res.json(notes);
      } catch (parseErr) {
        console.error('Error parsing JSON:', parseErr.message);
        res.status(500).json({ error: 'Failed to parse notes', details: parseErr.message });
      }
    }
  });
});
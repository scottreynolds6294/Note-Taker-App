const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
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

app.post('/api/notes', (req, res) => {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err.message);
      res.status(500).json({ error: 'Failed to read notes', details: err.message });
    } else {
      try {
        const notes = JSON.parse(data);
        const newNote = req.body;
        newNote.id = uuidv4();
        notes.push(newNote);

        fs.writeFile(dbPath, JSON.stringify(notes, null, 2), (err) => {
          if (err) {
            console.error('Error writing file:', err.message);
            res.status(500).json({ error: 'Failed to add note', details: err.message });
          } else {
            res.json(newNote);
          }
        });
      } catch (parseErr) {
        console.error('Error parsing JSON:', parseErr.message);
        res.status(500).json({ error: 'Failed to parse notes', details: parseErr.message });
      }
    }
  });
});

app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;

  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err.message);
      res.status(500).json({ error: 'Failed to read notes', details: err.message });
    } else {
      try {
        let notes = JSON.parse(data);
        const updatedNotes = notes.filter((note) => note.id !== noteId);

        fs.writeFile(dbPath, JSON.stringify(updatedNotes, null, 2), (err) => {
          if (err) {
            console.error('Error writing file:', err.message);
            res.status(500).json({ error: 'Failed to delete note', details: err.message });
          } else {
            res.json({ message: 'Note deleted successfully' });
          }
        });
      } catch (parseErr) {
        console.error('Error parsing JSON:', parseErr.message);
        res.status(500).json({ error: 'Failed to parse notes', details: parseErr.message });
      }
    }
  });
});

app.use((req, res) => {
  res.status(404).send('Not Found');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

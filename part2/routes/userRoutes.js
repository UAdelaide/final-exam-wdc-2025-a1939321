const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET all users (for admin/testing)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT user_id, username, email, role FROM Users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST a new user (simple signup)
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const [result] = await db.query(`
      INSERT INTO Users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `, [username, email, password, role]);

    res.status(201).json({ message: 'User registered', user_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  res.json(req.session.user);
});

// POST login (dummy version)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.query(`
      SELECT user_id, username, role FROM Users
      WHERE username = ? AND password_hash = ?
    `, [username, password]);
      console.log('Query result:', rows);//debugging line
    if (rows.length === 0) {
      console.log('No matching user found for username:', username); //debugging line
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    req.session.user = rows[0];
    console.log('Session set:', req.session.user); //debugging line
    res.json({ message: 'Login successful', user: rows[0] });
  } catch (error) {
    console.error('Login error:', error); //debugging line
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/logout', function (req, res) {
  delete req.session.user;
  res.json({ message: 'Logged out successfully' });
  });

router.get('/dogs', async (req, res) => {
  const { username } = req.session.user;
  try {
    const [rows] = await db.query(`
      SELECT d.dog_id, dname
      FROM Dogs d
      JOIN Users u ON d.owner_id = u.user_id
      WHERE u.username = ?`, [username]);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'No dogs found for this user' });
      }
    res.json(rows[0].dog_id);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dogs' });
  }
});

module.exports = router;
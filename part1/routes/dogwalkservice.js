var express = require('express');
var router = express.Router();
var db = require('../db');

// GET all dogs
router.get('/dogs', async function(req, res) {
        const [rows] = await db.query(`
            SELECT d.name AS dog_name, d.size, u.username AS owner_username
            FROM Dogs d
            JOIN Users u ON d.owner_id = u.user_id`);
        res.json(rows);
    });

// GET open walkrequests
router.get('/walkrequests/open', async function(req, res) {
    const [rows] = await db.query(`
        SELECT w.request_id, w.dog_id, d.name AS dog_name, w.requested_time, w.duration_minutes, w.location
        FROM WalkRequests w
        JOIN Dogs d ON w.dog_id = d.dog_id
        WHERE w.status = "open"`);
    res.json(rows);
});

// GET Walker SUMMARY
router.get('walker/summary', async function(req, res) {
    const [rows] = await db.query(`
        SELECT u.username AS walker_username,
        COUNT(w.request_id) AS total_walks,
        CASE
            WHEN COUNT()
        FROM USers u
        LEFT JOIN WalkApplications wa ON u.user_id = wa.walker_id AND wa.status = 'completed'
        `);
    res.json(rows);
});

module.exports = router;
var express = require('express');
var router = express.Router();
var db = require('../db');

// GET all dogs
router.get('/dogs', async function(req, res) {
    const [rows] = await db.query('SELECT  FROM Dogs');
        res.json(rows);
    });

// GET open walkrequests
router.get('/walkrequests', async function(req, res) {
    const [rows] = await db.query('SELECT * FROM WalkRequests WHERE status = "open"');
    res.json(rows);
});

//

module.exports = router;
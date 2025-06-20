var express = require('express');
var router = express.Router();
var db = require('../db');

// GET all dogs
router.get('/dogs', async function(req, res, next) {
    try {
        const [rows] = await db.query('SELECT * FROM Dogs');
        res.json(rows);
    } catch (err) {
        next(err);
    }
});

// GET all walkrequests

module.exports = router;
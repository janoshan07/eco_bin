// routes/recycleRoutes.js
const express = require('express');
const { createCollection, getAllCollections, updateCollectionStatus,  updateRecycleRecord, getRecycleHistoryByEmail, deleteCollection } = require('../controllers/recycleController');
const auth = require('../middleware/auth'); // JWT Authentication Middleware

const router = express.Router();

// POST route to handle recycling data
router.post('/', createCollection);

// GET route to fetch all collections
router.get('/', getAllCollections);

// PUT route to update collection status by ID
router.put('/update-status', updateCollectionStatus);

// GET route to fetch recycle history for a specific user by email
router.get('/history/:userEmail', auth, getRecycleHistoryByEmail);

// DELETE route to delete a collection by ID
router.delete('/:id', auth, deleteCollection);



router.put('/:id', updateRecycleRecord); // Add this route
module.exports = router;

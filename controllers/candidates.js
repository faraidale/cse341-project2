const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

// GET ALL Candidates
const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDb().db().collection('candidates').find();
    result.toArray().then((lists) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists);
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Some error occurred while retrieving candidates.' });
  }
};

// GET SINGLE Candidate
const getSingle = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('candidates').find({ _id: userId });
    result.toArray().then((lists) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists[0]);
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Some error occurred while retrieving the candidate.' });
  }
};

// CREATE Candidate (Includes Data Validation for Rubric)
const createCandidate = async (req, res) => {
  try {
    // Data Validation: Check if required fields are present
    if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.targetRole) {
      return res.status(400).send({ message: 'Validation Failed: firstName, lastName, email, and targetRole are required fields.' });
    }

    const candidate = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      targetRole: req.body.targetRole,
      experienceLevel: req.body.experienceLevel,
      interviewDate: req.body.interviewDate,
      applicationStatus: req.body.applicationStatus
    };

    const response = await mongodb.getDb().db().collection('candidates').insertOne(candidate);
    
    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json(response.error || 'Some error occurred while creating the candidate.');
    }
  } catch (err) {
    res.status(500).json({ message: err.message || 'Some error occurred while creating the candidate.' });
  }

};
// UPDATE Candidate (Includes Data Validation for Rubric)
const updateCandidate = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    
    // Data Validation for PUT
    if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.targetRole) {
      return res.status(400).send({ message: 'Validation Failed: firstName, lastName, email, and targetRole are required fields.' });
    }

    const candidate = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      targetRole: req.body.targetRole,
      experienceLevel: req.body.experienceLevel,
      interviewDate: req.body.interviewDate,
      applicationStatus: req.body.applicationStatus
    };

    const response = await mongodb.getDb().db().collection('candidates').replaceOne({ _id: userId }, candidate);
    
    if (response.modifiedCount > 0) {
      res.status(204).send(); // 204 means success, no content to send back
    } else {
      res.status(500).json(response.error || 'Some error occurred while updating the candidate.');
    }
  } catch (err) {
    res.status(500).json({ message: err.message || 'Some error occurred while updating the candidate.' });
  }
};

// DELETE Candidate
const deleteCandidate = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const response = await mongodb.getDb().db().collection('candidates').deleteOne({ _id: userId });
    
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json(response.error || 'Some error occurred while deleting the candidate.');
    }
  } catch (err) {
    res.status(500).json({ message: err.message || 'Some error occurred while deleting the candidate.' });
  }
};
module.exports = {
  getAll,
  getSingle,
  createCandidate,
  updateCandidate,  // Added this
  deleteCandidate   // Added this
};
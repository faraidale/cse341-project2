const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

// GET ALL Questions
const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDb().db().collection('questions').find();
    result.toArray().then((lists) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists);
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Some error occurred while retrieving questions.' });
  }
};

// GET SINGLE Question
const getSingle = async (req, res) => {
  try {
    const questionId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('questions').find({ _id: questionId });
    result.toArray().then((lists) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists[0]);
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Some error occurred while retrieving the question.' });
  }
};

// CREATE Question (Includes Data Validation)
const createQuestion = async (req, res) => {
  try {
    // Data Validation: Check if required fields are present
    if (!req.body.category || !req.body.questionText || !req.body.difficulty) {
      return res.status(400).send({ message: 'Validation Failed: category, questionText, and difficulty are required fields.' });
    }

    const question = {
      category: req.body.category,
      questionText: req.body.questionText,
      difficulty: req.body.difficulty
    };

    const response = await mongodb.getDb().db().collection('questions').insertOne(question);
    
    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json(response.error || 'Some error occurred while creating the question.');
    }
  } catch (err) {
    res.status(500).json({ message: err.message || 'Some error occurred while creating the question.' });
  }
};

// UPDATE Question (Includes Data Validation)
const updateQuestion = async (req, res) => {
  try {
    const questionId = new ObjectId(req.params.id);
    
    // Data Validation for PUT
    if (!req.body.category || !req.body.questionText || !req.body.difficulty) {
      return res.status(400).send({ message: 'Validation Failed: category, questionText, and difficulty are required fields.' });
    }

    const question = {
      category: req.body.category,
      questionText: req.body.questionText,
      difficulty: req.body.difficulty
    };

    const response = await mongodb.getDb().db().collection('questions').replaceOne({ _id: questionId }, question);
    
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json(response.error || 'Some error occurred while updating the question.');
    }
  } catch (err) {
    res.status(500).json({ message: err.message || 'Some error occurred while updating the question.' });
  }
};

// DELETE Question
const deleteQuestion = async (req, res) => {
  try {
    const questionId = new ObjectId(req.params.id);
    const response = await mongodb.getDb().db().collection('questions').deleteOne({ _id: questionId });
    
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json(response.error || 'Some error occurred while deleting the question.');
    }
  } catch (err) {
    res.status(500).json({ message: err.message || 'Some error occurred while deleting the question.' });
  }
};

module.exports = {
  getAll,
  getSingle,
  createQuestion,
  updateQuestion,  // Added this
  deleteQuestion   // Added this
};
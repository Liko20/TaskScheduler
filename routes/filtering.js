const express = require('express');
const Task = require('../models/Task'); 
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const {
      priority,         
      status,           
      assignedTo,       
      dueDate,          
      sortBy,           
      sortOrder = 'asc' 
    } = req.body;
    
    const filter = {};
    if (priority) filter.priority = priority;
    if (status) filter.status = status;
    if (assignedTo) filter.assignedTo = assignedTo;

    const sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1; 
    }
    const tasks = await Task.find(filter).sort(sortOptions);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
});

module.exports = router;

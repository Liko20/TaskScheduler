const express = require('express');
const Task = require('../models/Task');
const { protect } = require('../middleware/authMiddleware');
const moment = require('moment');
const cron = require('node-cron');
const router = express.Router();


router.post('/', protect, async (req, res) => {
  const task = new Task({ ...req.body, createdBy: req.user._id });
  await task.save();
  res.status(201).json(task);
});


router.put('/:id/complete', protect, async (req, res) => {
  const task = await Task.findById(req.params.id);
  const dependencies = await Task.find({ _id: { $in: task.dependencies }, status: 'incomplete' });
  if (dependencies.length) return res.status(400).json({ message: 'Dependencies incomplete' });

  task.status = 'complete';
  await task.save();
  res.json(task);
});

cron.schedule('0 0 * * *', async () => {
  const tasks = await Task.find({ recurring: { $ne: 'none' }, status: 'complete' });
  tasks.forEach(async task => {
    let nextDueDate = getNextDueDate(task.recurring, task.dueDate);
    const newTask = new Task({ ...task.toObject(), dueDate: nextDueDate, status: 'incomplete' });
    await newTask.save();
  });
});

function getNextDueDate(frequency, currentDate) {
  switch (frequency) {
    case 'daily': return moment(currentDate).add(1, 'days').toDate();
    case 'weekly': return moment(currentDate).add(1, 'weeks').toDate();
    case 'monthly': return moment(currentDate).add(1, 'months').toDate();
  }
}

module.exports = router;

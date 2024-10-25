const cron = require('node-cron');
const moment = require('moment');
const Task = require('../models/Task');
const sendNotification = require('../utils/sendNotification');

cron.schedule('0 0 * * *', async () => {
  const overdueTasks = await Task.find({ dueDate: { $lt: moment().toDate() }, status: 'incomplete' });
  overdueTasks.forEach(task => sendNotification(task));
});


const nodemailer = require('nodemailer');
const sendNotification = async (task) => {
  const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: task.assignedTo.email,
    subject: 'Overdue Task',
    text: `Your task "${task.title}" is overdue.`
  });
};
module.exports = sendNotification;

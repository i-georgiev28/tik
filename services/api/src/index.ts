import express from 'express';
import { db } from './db';
import { robots, alarms, reminders } from './schema';
import { eq, and } from 'drizzle-orm';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

migrate(db, { migrationsFolder: 'drizzle' });
console.log('Migrations applied successfully!');

// POST /robot/:id/alarm
app.post('/robot/:id/alarm', async (req, res) => {
  const robotId = req.params.id;
  // Check if robot exists
  const robot = await db.select().from(robots).where(eq(robots.id, robotId)).get();
  if (!robot) {
    return res.status(404).json({ error: 'Robot not found' });
  }

  const {id, enabled, time, tag, days } = req.body;

  // Validate the time format (HH:MM)
  if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
    return res.status(400).json({ error: 'Invalid time format. Use HH:MM.' });
  }

  // Insert the alarm
  try {
    const newAlarm = await db.insert(alarms).values({
      robotId,
      enabled,
      time,
      tag,
      days,
    }).returning().get();
    res.status(201).json(newAlarm);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create alarm' });
  }
});

// GET /robot/:id/alarm
app.get('/robot/:id/alarm', async (req, res) => {
  const robotId = req.params.id;
  const robotAlarms = await db.select().from(alarms).where(eq(alarms.robotId, robotId)).all();
  res.json(robotAlarms);
});

// PUT /robot/:id/alarm/:alarmId
app.put('/robot/:id/alarm/:alarmId', async (req, res) => {
  const robotId = req.params.id;
  const alarmId = parseInt(req.params.alarmId);
  const { enabled, time, tag, days } = req.body;

  // Check if the alarm exists and belongs to the robot
  const alarm = await db.select().from(alarms).where(and(eq(alarms.id, alarmId), eq(alarms.robotId, robotId))).get();
  if (!alarm) {
    return res.status(404).json({ error: 'Alarm not found' });
  }

  // Validate the time format if provided
  if (time && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
    return res.status(400).json({ error: 'Invalid time format. Use HH:MM.' });
  }

  // Update the alarm
  try {
    const updatedAlarm = await db.update(alarms)
      .set({ enabled, time, tag, days })
      .where(and(eq(alarms.id, alarmId), eq(alarms.robotId, robotId)))
      .returning()
      .get();
    res.json(updatedAlarm);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update alarm' });
  }
});

// GET /robot/:id/status
app.get('/robot/:id/status', async (req, res) => {
  const robotId = req.params.id;
  const robot = await db.select().from(robots).where(eq(robots.id, robotId)).get();
  if (!robot) {
    return res.status(404).json({ error: 'Robot not found' });
  }
  res.json({ battery: robot.battery });
});

// PUT /robot/:id/status
app.put('/robot/:id/status', async (req, res) => {
  const robotId = req.params.id;
  const { battery } = req.body;

  // Validate battery is an integer between 0 and 100
  if (typeof battery !== 'number' || battery < 0 || battery > 100) {
    return res.status(400).json({ error: 'Battery must be an integer between 0 and 100' });
  }

  // Check if robot exists
  const robot = await db.select().from(robots).where(eq(robots.id, robotId)).get();
  if (!robot) {
    return res.status(404).json({ error: 'Robot not found' });
  }

  // Update the robot's battery
  try {
    const updatedRobot = await db.update(robots)
      .set({ battery })
      .where(eq(robots.id, robotId))
      .returning()
      .get();
    res.json({ battery: updatedRobot.battery });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update robot status' });
  }
});

// 
// REMINDERS
// 
app.post('/robot/:id/reminder', async (req, res) => {
  const robotId = req.params.id;
  // Check if robot exists
  const robot = await db.select().from(robots).where(eq(robots.id, robotId)).get();
  if (!robot) {
    return res.status(404).json({ error: 'Robot not found' });
  }

  const { enabled, time, tag, days } = req.body;

  // Validate the time format (HH:MM)
  if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
    return res.status(400).json({ error: 'Invalid time format. Use HH:MM.' });
  }

  // Insert the reminder
  try {
    const newreminder = await db.insert(reminders).values({
      robotId,
      enabled,
      time,
      tag,
      days,
    }).returning().get();
    res.status(201).json(newreminder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create reminder' });
  }
});

// GET /robot/:id/reminder
app.get('/robot/:id/reminder', async (req, res) => {
    console.log('Received request to get reminders');
  const robotId = req.params.id;
  const robotreminders = await db.select().from(reminders).where(eq(reminders.robotId, robotId)).all();
  res.json(robotreminders);
});

// PUT /robot/:id/reminder/:reminderId
app.put('/robot/:id/reminder/:reminderId', async (req, res) => {
  const robotId = req.params.id;
  const reminderId = parseInt(req.params.reminderId);
  const { enabled, time, tag, days } = req.body;

  // Check if the reminder exists and belongs to the robot
  const reminder = await db.select().from(reminders).where(and(eq(reminders.id, reminderId), eq(reminders.robotId, robotId))).get();
  if (!reminder) {
    return res.status(404).json({ error: 'reminder not found' });
  }

  // Validate the time format if provided
  if (time && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
    return res.status(400).json({ error: 'Invalid time format. Use HH:MM.' });
  }

  // Update the reminder
  try {
    const updatedreminder = await db.update(reminders)
      .set({ enabled, time, tag, days })
      .where(and(eq(reminders.id, reminderId), eq(reminders.robotId, robotId)))
      .returning()
      .get();
    res.json(updatedreminder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update reminder' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
import { db } from './db';
import { robots, alarms, reminders } from './schema';

async function seed() {
  console.log('Seeding database with initial data...');

  try {
    // Clear existing data
    await db.delete(alarms);
    await db.delete(robots);

    // Insert mock robots
    const mockRobots = [
      { id: 'abc123', battery: 93 },
    ];

    for (const robot of mockRobots) {
      await db.insert(robots).values(robot);
    }

    // Insert mock alarms
    const mockAlarms = [
      {
        robotId: 'abc123',
        enabled: true,
        time: '23:00',
        tag: 'TODAY',
        days: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: true, sun: false },
      },
      {
        robotId: 'abc123',
        enabled: false,
        time: '22:00',
        tag: 'TODAY',
        days: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: true, sun: false },
      },
      {
        robotId: 'abc123',
        enabled: false,
        time: '22:15',
        tag: 'TODAY',
        days: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: true, sun: false },
      },
      {
        robotId: 'abc123',
        enabled: false,
        time: '22:45',
        tag: 'TODAY',
        days: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: true, sun: false },
      },
    ];
    const mockReminders = [
      {
        robotId: 'abc123',
        enabled: true,
        time: '17:00',
        tag: 'TODAY',
        days: { mon: false, tue: false, wed: false, thu: false, fri: false, sat: true, sun: false },
      },
      {
        robotId: 'abc123',
        enabled: false,
        time: '12:15',
        tag: 'TMMRW',
        days: { mon: false, tue: true, wed: true, thu: true, fri: true, sat: true, sun: false },
      },
      {
        robotId: 'abc123',
        enabled: false,
        time: '22:00',
        tag: 'TMMRW',
        days: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: true, sun: false },
      },
    ];

    for (const alarm of mockAlarms) {
      await db.insert(alarms).values(alarm);
    }

        for (const reminder of mockReminders) {
      await db.insert(reminders).values(reminder);
    }

    console.log('Database seeded successfully!');
    console.log(`- Created robot: abc123 with 93% battery`);
    console.log(`- Created ${mockAlarms.length} alarms for robot abc123`);
    console.log(`- Created ${mockReminders.length} remidners for robot abc123`);
    
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
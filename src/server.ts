import { app } from './app';
import * as db from './db';

const port = Number(process.env.PORT) || 4000;

async function seed(): Promise<void> {
  const seeds: Array<{ title: string; dueDate?: Date; completed?: boolean }> = [
    { title: 'Buy groceries', dueDate: new Date('2026-11-20'), completed: true },
    { title: 'Write report', dueDate: new Date('2026-11-21') },
    { title: 'Call dentist', dueDate: new Date('2026-11-22') },
    { title: 'Fix bike', dueDate: new Date('2026-11-23'), completed: true },
    { title: 'Read chapter 4', dueDate: new Date('2026-11-24') },
    { title: 'Submit expenses', dueDate: new Date('2026-11-25') },
    { title: 'Team standup notes', dueDate: new Date('2026-11-26') },
    { title: 'Renew license', dueDate: new Date('2026-11-27') },
    { title: 'Plan vacation' },
    { title: 'Organize desk' },
    { title: 'Water plants', completed: true },
    { title: 'Backup photos' },
  ];

  for (const item of seeds) {
    await db.save({
      id: db.nextTodoId(),
      title: item.title,
      completed: item.completed ?? false,
      dueDate: item.dueDate,
    });
  }
}

seed().then(() => {
  app.listen(port, () => {
    console.log(`dq-demo-app listening on port ${port}`);
  });
});

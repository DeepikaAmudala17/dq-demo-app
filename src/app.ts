import express from 'express';
import path from 'path';
import * as todos from './todos';

export const app = express();
app.use(express.json());

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.get('/todos', async (req, res) => {
  try {
    const page = Number(req.query.page ?? 1);
    const size = Number(req.query.size ?? 5);
    const all = await todos.listTodos();
    const pageItems = todos.paginate(all, page, size);
    const items = pageItems.map((todo) => ({
      id: todo.id,
      title: todo.title,
      completed: todo.completed,
      dueDate: todo.dueDate,
      summary: todos.summary(todo),
    }));
    const totalPages = Math.max(1, Math.ceil(all.length / size));
    res.json({
      items,
      page,
      pageSize: size,
      total: all.length,
      totalPages,
      completedCount: todos.countCompleted(all),
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/todos', async (req, res) => {
  try {
    const todo = await todos.createTodo({
      title: req.body?.title,
      dueDate: req.body?.dueDate ? new Date(req.body.dueDate) : undefined,
    });
    res.status(201).json(todo);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

app.patch('/todos/:id', async (req, res) => {
  try {
    const todo = await todos.setTodoCompleted(
      Number(req.params.id),
      Boolean(req.body?.completed),
    );
    if (!todo) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    res.json(todo);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

app.delete('/todos/:id', async (req, res) => {
  const removed = await todos.deleteTodo(Number(req.params.id));
  res.status(removed ? 204 : 404).end();
});

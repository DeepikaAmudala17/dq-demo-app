import express from 'express';
import * as todos from './todos';

export const app = express();
app.use(express.json());

app.get('/todos', async (req, res) => {
  const page = Number(req.query.page ?? 1);
  const size = Number(req.query.size ?? 10);
  const all = await todos.listTodos();
  res.json(todos.paginate(all, page, size));
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

app.delete('/todos/:id', async (req, res) => {
  const removed = await todos.deleteTodo(Number(req.params.id));
  res.status(removed ? 204 : 404).end();
});

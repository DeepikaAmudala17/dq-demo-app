import * as db from '../src/db';
import {
  createTodo,
  listTodos,
  deleteTodo,
  summary,
  paginate,
  countCompleted,
  validateTitle,
} from '../src/todos';

beforeEach(async () => {
  // Let any pending writes finish before clearing the store.
  await new Promise((resolve) => setTimeout(resolve, 10));
  db.resetDb();
});

test('createTodo trims the title', async () => {
  const todo = await createTodo({ title: '  buy milk  ' });
  expect(todo.title).toBe('buy milk');
});

test('validateTitle rejects an empty title', () => {
  expect(() => validateTitle('   ')).toThrow('Title is required');
});

test('createTodo accepts a todo without a due date', async () => {
  const todo = await createTodo({ title: 'no date' });
  expect(todo.dueDate).toBeUndefined();
});

test('summary shows the due date', () => {
  const todo: db.Todo = {
    id: 1,
    title: 'essay',
    completed: false,
    dueDate: new Date('2026-11-20T00:00:00Z'),
  };
  expect(summary(todo)).toBe('essay (due 2026-11-20)');
});

test('summary handles a todo with no due date', () => {
  const todo: db.Todo = { id: 2, title: 'someday', completed: false };
  expect(summary(todo)).toBe('someday (no due date)');
});

test('listTodos includes a todo right after it is created', async () => {
  await createTodo({ title: 'first' });
  const all = await listTodos();
  expect(all).toHaveLength(1);
});

test('deleteTodo removes a todo', async () => {
  await db.save({ id: 99, title: 'temp', completed: false });
  const removed = await deleteTodo(99);
  expect(removed).toBe(true);
  expect(await listTodos()).toHaveLength(0);
});

test('paginate returns a full page of pageSize items', () => {
  expect(paginate([1, 2, 3, 4, 5], 1, 2)).toEqual([1, 2]);
});

test('paginate returns the first item on page 1', () => {
  expect(paginate(['a', 'b', 'c'], 1, 2)[0]).toBe('a');
});

test('paginate returns an empty array past the last page', () => {
  expect(paginate([1, 2, 3, 4, 5], 10, 2)).toEqual([]);
});

test('countCompleted counts only completed todos', () => {
  const items: db.Todo[] = [
    { id: 1, title: 'a', completed: true },
    { id: 2, title: 'b', completed: false },
  ];
  expect(countCompleted(items)).toBe(1);
});

import * as db from './db';
import { logEvent } from './log';

export interface NewTodo {
  title: string;
  dueDate?: Date;
}

export function validateTitle(title: string): void {
  if (!title || !title.trim()) {
    throw new Error('Title is required');
  }
}

export async function createTodo(input: NewTodo): Promise<db.Todo> {
  validateTitle(input.title);
  const todo: db.Todo = {
    id: db.nextTodoId(),
    title: input.title.trim(),
    completed: false,
    dueDate: input.dueDate,
  };

  // BUG 3 (un-awaited async call): save() is not awaited, so the function
  // returns before the write finishes. Fix: `await db.save(todo);`
  await db.save(todo);

  logEvent(`created todo ${todo.id}`);
  return todo;
}

export async function listTodos(): Promise<db.Todo[]> {
  return db.findAll();
}

export async function deleteTodo(id: number): Promise<boolean> {
  return db.remove(id);
}

export function summary(todo: db.Todo): string {
  // BUG 2 (missing null check): dueDate is optional, but it is read
  // without checking it first. Fix: if (!todo.dueDate) return `${todo.title} (no due date)`;
  if (!todo.dueDate) return `${todo.title} (no due date)`;
  const due = todo.dueDate.toISOString().slice(0, 10);
  return `${todo.title} (due ${due})`;
}

export function paginate<T>(items: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  // BUG 1 (off-by-one in pagination): the end index is one too small,
  // so every page returns one item fewer. Fix: const end = page * pageSize;
  const end = page * pageSize;
  return items.slice(start, end);
}

export function countCompleted(todos: db.Todo[]): number {
  // BUG 4 (== vs ===): completed is a boolean, but it is compared to the
  // string 'true' with ==. The check is always false. Fix: t.completed === true
  return todos.filter((t) => t.completed).length;
}

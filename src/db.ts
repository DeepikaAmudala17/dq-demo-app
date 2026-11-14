// In-memory "database" with async-style functions, so it behaves like a real DB client.

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  dueDate?: Date;
}

let rows: Todo[] = [];
let nextId = 1;

const tick = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

export async function save(todo: Todo): Promise<void> {
  await tick(); // a real database write takes time
  rows.push({ ...todo });
}

export async function findAll(): Promise<Todo[]> {
  return rows.map((r) => ({ ...r }));
}

export async function remove(id: number): Promise<boolean> {
  const index = rows.findIndex((r) => r.id === id);
  if (index === -1) return false;
  rows.splice(index, 1);
  return true;
}

export function nextTodoId(): number {
  return nextId++;
}

export function resetDb(): void {
  rows = [];
  nextId = 1;
}

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { Database } from '../src/database/database';

const testDatabasePath = path.join(os.tmpdir(), `problem5-test-${process.pid}.sqlite`);

process.env.NODE_ENV = 'test';
process.env.DATABASE_PATH = testDatabasePath;

if (fs.existsSync(testDatabasePath)) {
  fs.unlinkSync(testDatabasePath);
}

export function cleanDatabase(): void {
  const db = new Database(testDatabasePath);
  db.clearResources();
  db.close();
}

export function createTestResource() {
  return {
    name: 'Test Resource',
    description: 'A test resource for e2e testing',
    category: 'test',
    status: 'active' as const,
  };
}

export function createMultipleTestResources() {
  return [
    {
      name: 'Resource 1',
      description: 'First test resource',
      category: 'category1',
      status: 'active' as const,
    },
    {
      name: 'Resource 2',
      description: 'Second test resource',
      category: 'category2',
      status: 'inactive' as const,
    },
    {
      name: 'Resource 3',
      description: 'Third test resource',
      category: 'category1',
      status: 'active' as const,
    },
  ];
}

afterAll(() => {
  if (fs.existsSync(testDatabasePath)) {
    fs.unlinkSync(testDatabasePath);
  }
});

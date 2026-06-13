import fs from 'node:fs';
import path from 'node:path';
import DatabaseClient from 'better-sqlite3';

export type ResourceStatus = 'active' | 'inactive';

export interface Resource {
  id: number;
  name: string;
  description: string;
  category: string;
  status: ResourceStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ResourceFilters {
  category?: string;
  status?: ResourceStatus;
  name?: string;
  limit: number;
  offset: number;
}

export type CreateResourceData = Pick<Resource, 'name' | 'description' | 'category' | 'status'>;
export type UpdateResourceData = Partial<CreateResourceData>;

type ResourceRow = {
  id: number;
  name: string;
  description: string;
  category: string;
  status: ResourceStatus;
  created_at: string;
  updated_at: string;
};

export class Database {
  private readonly client: DatabaseClient.Database;

  constructor(dbPath = process.env.DATABASE_PATH ?? 'database.sqlite') {
    if (dbPath !== ':memory:') {
      const directory = path.dirname(path.resolve(dbPath));
      fs.mkdirSync(directory, { recursive: true });
    }

    this.client = new DatabaseClient(dbPath);
    this.client.pragma('foreign_keys = ON');
    this.init();
  }

  createResource(input: CreateResourceData): Resource {
    const now = new Date().toISOString();
    const result = this.client
      .prepare(
        `
        INSERT INTO resources (name, description, category, status, created_at, updated_at)
        VALUES (@name, @description, @category, @status, @createdAt, @updatedAt)
      `
      )
      .run({
        ...input,
        createdAt: now,
        updatedAt: now,
      });

    const resource = this.getResourceById(Number(result.lastInsertRowid));
    if (!resource) {
      throw new Error('Failed to load created resource');
    }

    return resource;
  }

  listResources(filters: ResourceFilters): Resource[] {
    const { whereSql, params } = this.buildListQuery(filters);
    const rows = this.client
      .prepare(
        `
        SELECT * FROM resources
        ${whereSql}
        ORDER BY created_at DESC, id DESC
        LIMIT @limit OFFSET @offset
      `
      )
      .all({ ...params, limit: filters.limit, offset: filters.offset }) as ResourceRow[];

    return rows.map(this.mapResourceRow);
  }

  countResources(filters: Omit<ResourceFilters, 'limit' | 'offset'>): number {
    const { whereSql, params } = this.buildListQuery({
      ...filters,
      limit: 1,
      offset: 0,
    });
    const row = this.client
      .prepare(`SELECT COUNT(*) AS total FROM resources ${whereSql}`)
      .get(params) as { total: number };

    return row.total;
  }

  getResourceById(id: number): Resource | null {
    const row = this.client
      .prepare('SELECT * FROM resources WHERE id = ?')
      .get(id) as ResourceRow | undefined;

    return row ? this.mapResourceRow(row) : null;
  }

  updateResource(id: number, updates: UpdateResourceData): Resource | null {
    const currentResource = this.getResourceById(id);
    if (!currentResource) {
      return null;
    }

    const fields = Object.keys(updates) as Array<keyof UpdateResourceData>;
    if (fields.length === 0) {
      return currentResource;
    }

    const columnByField: Record<keyof UpdateResourceData, string> = {
      name: 'name',
      description: 'description',
      category: 'category',
      status: 'status',
    };
    const setSql = fields.map((field) => `${columnByField[field]} = @${field}`).join(', ');

    this.client
      .prepare(
        `
        UPDATE resources
        SET ${setSql}, updated_at = @updatedAt
        WHERE id = @id
      `
      )
      .run({
        ...updates,
        id,
        updatedAt: new Date().toISOString(),
      });

    return this.getResourceById(id);
  }

  deleteResource(id: number): boolean {
    const result = this.client.prepare('DELETE FROM resources WHERE id = ?').run(id);
    return result.changes > 0;
  }

  clearResources(): void {
    this.client.prepare('DELETE FROM resources').run();
  }

  close(): void {
    this.client.close();
  }

  private init(): void {
    this.client.exec(`
      CREATE TABLE IF NOT EXISTS resources (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('active', 'inactive')),
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);
      CREATE INDEX IF NOT EXISTS idx_resources_status ON resources(status);
      CREATE INDEX IF NOT EXISTS idx_resources_name ON resources(name);
    `);
  }

  private buildListQuery(filters: ResourceFilters): {
    whereSql: string;
    params: Record<string, string>;
  } {
    const conditions: string[] = [];
    const params: Record<string, string> = {};

    if (filters.category) {
      conditions.push('category = @category');
      params.category = filters.category;
    }

    if (filters.status) {
      conditions.push('status = @status');
      params.status = filters.status;
    }

    if (filters.name) {
      conditions.push("LOWER(name) LIKE LOWER(@name) ESCAPE '\\'");
      params.name = `%${this.escapeLikePattern(filters.name)}%`;
    }

    return {
      whereSql: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '',
      params,
    };
  }

  private mapResourceRow(row: ResourceRow): Resource {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      category: row.category,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private escapeLikePattern(value: string): string {
    return value.replace(/[\\%_]/g, (character) => `\\${character}`);
  }
}

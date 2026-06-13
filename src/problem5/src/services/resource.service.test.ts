import { describe, expect, it, jest } from '@jest/globals';
import type { Mocked } from 'jest-mock';
import type { Resource } from '../database/database';
import type { CreateResourceInput, ResourceQuery, UpdateResourceInput } from '../schemas/resource.schema';
import { ResourceServiceImpl, type ResourceRepository } from './resource.service';

const createResource = (overrides: Partial<Resource> = {}): Resource => ({
  id: 1,
  name: 'Resource',
  description: 'Description',
  category: 'test',
  status: 'active',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
});

const createDatabaseMock = (): Mocked<ResourceRepository> => ({
  createResource: jest.fn(),
  listResources: jest.fn(),
  countResources: jest.fn(),
  getResourceById: jest.fn(),
  updateResource: jest.fn(),
  deleteResource: jest.fn(),
});

describe('ResourceServiceImpl', () => {
  it('creates a resource through the database', () => {
    const db = createDatabaseMock();
    const service = new ResourceServiceImpl(db);
    const input: CreateResourceInput = {
      name: 'Name',
      description: 'Description',
      category: 'Category',
      status: 'active',
    };
    const resource = createResource(input);

    db.createResource.mockReturnValue(resource);

    expect(service.createResource(input)).toEqual(resource);
    expect(db.createResource).toHaveBeenCalledWith(input);
  });

  it('lists resources with filters and total count', () => {
    const db = createDatabaseMock();
    const service = new ResourceServiceImpl(db);
    const query: ResourceQuery = {
      category: 'test',
      status: 'active',
      limit: 10,
      offset: 0,
    };
    const resources = [createResource()];

    db.listResources.mockReturnValue(resources);
    db.countResources.mockReturnValue(1);

    expect(service.listResources(query)).toEqual({
      resources,
      total: 1,
      filters: {
        category: 'test',
        status: 'active',
        limit: 10,
        offset: 0,
      },
    });
  });

  it('updates a resource after removing undefined fields', () => {
    const db = createDatabaseMock();
    const service = new ResourceServiceImpl(db);
    const updates: UpdateResourceInput = {
      name: 'Updated',
      description: undefined,
      status: 'inactive',
    };
    const updatedResource = createResource({ name: 'Updated', status: 'inactive' });

    db.updateResource.mockReturnValue(updatedResource);

    expect(service.updateResource(1, updates)).toEqual(updatedResource);
    expect(db.updateResource).toHaveBeenCalledWith(1, {
      name: 'Updated',
      status: 'inactive',
    });
  });

  it('gets and deletes resources through the database', () => {
    const db = createDatabaseMock();
    const service = new ResourceServiceImpl(db);
    const resource = createResource({ id: 2 });

    db.getResourceById.mockReturnValue(resource);
    db.deleteResource.mockReturnValue(true);

    expect(service.getResourceById(2)).toEqual(resource);
    expect(service.deleteResource(2)).toBe(true);
  });
});

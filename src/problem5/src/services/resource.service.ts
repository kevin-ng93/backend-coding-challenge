import type { Resource, ResourceFilters } from '../database/database';
import type {
  CreateResourceInput,
  ResourceQuery,
  UpdateResourceInput,
} from '../schemas/resource.schema';

export interface ResourceService {
  createResource(input: CreateResourceInput): Resource;
  listResources(query: ResourceQuery): {
    resources: Resource[];
    total: number;
    filters: ResourceFilters;
  };
  getResourceById(id: number): Resource | null;
  updateResource(id: number, updates: UpdateResourceInput): Resource | null;
  deleteResource(id: number): boolean;
}

export interface ResourceRepository {
  createResource(input: CreateResourceInput): Resource;
  listResources(filters: ResourceFilters): Resource[];
  countResources(filters: Omit<ResourceFilters, 'limit' | 'offset'>): number;
  getResourceById(id: number): Resource | null;
  updateResource(id: number, updates: UpdateResourceInput): Resource | null;
  deleteResource(id: number): boolean;
}

export class ResourceServiceImpl implements ResourceService {
  constructor(private readonly db: ResourceRepository) {}

  createResource(input: CreateResourceInput): Resource {
    return this.db.createResource(input);
  }

  listResources(query: ResourceQuery): {
    resources: Resource[];
    total: number;
    filters: ResourceFilters;
  } {
    const filters: ResourceFilters = {
      category: query.category,
      status: query.status,
      name: query.name,
      limit: query.limit,
      offset: query.offset,
    };

    const countFilters = {
      category: filters.category,
      status: filters.status,
      name: filters.name,
    };

    return {
      resources: this.db.listResources(filters),
      total: this.db.countResources(countFilters),
      filters,
    };
  }

  getResourceById(id: number): Resource | null {
    return this.db.getResourceById(id);
  }

  updateResource(id: number, updates: UpdateResourceInput): Resource | null {
    const sanitizedUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, value]) => value !== undefined)
    ) as UpdateResourceInput;

    return this.db.updateResource(id, sanitizedUpdates);
  }

  deleteResource(id: number): boolean {
    return this.db.deleteResource(id);
  }
}

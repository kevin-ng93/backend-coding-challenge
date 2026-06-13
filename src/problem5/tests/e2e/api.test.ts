import request from 'supertest';
import { cleanDatabase, createMultipleTestResources, createTestResource } from '../setup';
import app from '../../src/app';

describe('Problem 5 CRUD API', () => {
  beforeEach(() => {
    cleanDatabase();
  });

  it('returns health status', async () => {
    const response = await request(app).get('/health').expect(200);

    expect(response.body).toMatchObject({
      success: true,
      message: 'Server is running',
      timestamp: expect.any(String),
    });
  });

  it('creates a resource', async () => {
    const payload = createTestResource();
    const response = await request(app).post('/api/resources').send(payload).expect(201);

    expect(response.body).toMatchObject({
      success: true,
      message: 'Resource created successfully',
      data: {
        id: expect.any(Number),
        ...payload,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    });
  });

  it('lists resources with basic filters and pagination', async () => {
    for (const resource of createMultipleTestResources()) {
      await request(app).post('/api/resources').send(resource).expect(201);
    }

    const response = await request(app)
      .get('/api/resources?category=category1&status=active&limit=1&offset=0')
      .expect(200);

    expect(response.body).toMatchObject({
      success: true,
      message: 'Resources retrieved successfully',
      data: expect.any(Array),
      meta: {
        count: 1,
        total: 2,
        limit: 1,
        offset: 0,
        filters: {
          category: 'category1',
          status: 'active',
        },
      },
    });
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0]).toMatchObject({
      category: 'category1',
      status: 'active',
    });
  });

  it('treats % and _ in name filters as literal characters', async () => {
    await request(app)
      .post('/api/resources')
      .send({
        name: '100% Pure',
        description: 'Contains a percent sign',
        category: 'special',
      })
      .expect(201);
    await request(app)
      .post('/api/resources')
      .send({
        name: '1000 Pure',
        description: 'Similar name without percent',
        category: 'special',
      })
      .expect(201);

    const response = await request(app).get('/api/resources?name=100%25').expect(200);

    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0]).toMatchObject({
      name: '100% Pure',
    });
  });

  it('gets resource details', async () => {
    const payload = createTestResource();
    const createResponse = await request(app).post('/api/resources').send(payload).expect(201);
    const id = createResponse.body.data.id;

    const response = await request(app).get(`/api/resources/${id}`).expect(200);

    expect(response.body).toMatchObject({
      success: true,
      message: 'Resource retrieved successfully',
      data: {
        id,
        ...payload,
      },
    });
  });

  it('updates resource details', async () => {
    const createResponse = await request(app)
      .post('/api/resources')
      .send(createTestResource())
      .expect(201);
    const id = createResponse.body.data.id;

    const response = await request(app)
      .put(`/api/resources/${id}`)
      .send({ name: 'Updated name', status: 'inactive' })
      .expect(200);

    expect(response.body).toMatchObject({
      success: true,
      message: 'Resource updated successfully',
      data: {
        id,
        name: 'Updated name',
        status: 'inactive',
      },
    });
  });

  it('deletes a resource', async () => {
    const createResponse = await request(app)
      .post('/api/resources')
      .send(createTestResource())
      .expect(201);
    const id = createResponse.body.data.id;

    await request(app).delete(`/api/resources/${id}`).expect(200);
    await request(app).get(`/api/resources/${id}`).expect(404);
  });

  it('returns validation errors for bad input', async () => {
    const response = await request(app)
      .post('/api/resources')
      .send({ name: '', description: '', category: '', status: 'draft' })
      .expect(400);

    expect(response.body).toMatchObject({
      success: false,
      message: 'Validation failed',
      errors: expect.any(Array),
    });
  });

  it('returns 404 for missing resources and unknown endpoints', async () => {
    await request(app).get('/api/resources/999999').expect(404);
    await request(app).delete('/api/resources/999999').expect(404);
    await request(app).get('/not-found').expect(404);
  });
});

# Problem 5: ExpressJS CRUD API

Backend server built with ExpressJS and TypeScript. The API exposes CRUD
endpoints for `resources` and persists data in SQLite.

## Requirements Covered

- Create a resource
- List resources with basic filters
- Get resource details
- Update resource details
- Delete a resource
- Persist data with SQLite
- Provide setup and run instructions

## Resource Shape

```ts
type Resource = {
  id: number;
  name: string;
  description: string;
  category: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
};
```

## Configuration

The server reads these environment variables:

| Variable | Default | Description |
| --- | --- | --- |
| `PORT` | `3000` | HTTP server port |
| `DATABASE_PATH` | `database.sqlite` | SQLite file path |

## Install

```sh
npm install
```

## Run

Development mode:

```sh
npm run dev
```

Production mode:

```sh
npm run build
npm start
```

The API runs at `http://localhost:3000` by default.

## Verify

```sh
npm run typecheck
npm test
```

## Endpoints

### Health

```http
GET /health
```

### Create Resource

```http
POST /api/resources
Content-Type: application/json
```

```json
{
  "name": "Notebook",
  "description": "Work laptop",
  "category": "hardware",
  "status": "active"
}
```

`status` is optional and defaults to `active`.

### List Resources

```http
GET /api/resources
```

Supported query parameters:

| Query | Description |
| --- | --- |
| `category` | Exact category match |
| `status` | `active` or `inactive` |
| `name` | Case-insensitive partial name match |
| `limit` | Page size, 1-100, default `20` |
| `offset` | Number of rows to skip, default `0` |

Example:

```http
GET /api/resources?category=hardware&status=active&name=note&limit=10&offset=0
```

### Get Resource Details

```http
GET /api/resources/:id
```

### Update Resource

```http
PUT /api/resources/:id
Content-Type: application/json
```

```json
{
  "name": "Updated notebook",
  "status": "inactive"
}
```

At least one updatable field is required.

### Delete Resource

```http
DELETE /api/resources/:id
```

## Curl Example

```sh
curl -X POST http://localhost:3000/api/resources \
  -H "Content-Type: application/json" \
  -d '{"name":"Notebook","description":"Work laptop","category":"hardware"}'

curl "http://localhost:3000/api/resources?category=hardware"
```

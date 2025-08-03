# API Endpoints Documentation

Base URL: `http://localhost:3005/api/v1`

## Authentication

All endpoints except registration and login require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## Authentication Endpoints

### Register User

- **POST** `/auth/register`
- **Description**: Register a new user account
- **Authentication**: Not required

### Login User

- **POST** `/auth/login`
- **Description**: Authenticate user and get JWT token
- **Authentication**: Not required

### Get User Profile

- **GET** `/auth/profile`
- **Description**: Get current authenticated user's profile
- **Authentication**: Required

---

## User Management Endpoints

### Create User

- **POST** `/users`
- **Description**: Create a new user (admin functionality)
- **Authentication**: Not required

### Get All Users

- **GET** `/users`
- **Description**: Retrieve all users
- **Authentication**: Required

### Get User by ID

- **GET** `/users/:id`
- **Description**: Retrieve a specific user by ID
- **Authentication**: Required

### Update User

- **PATCH** `/users/:id`
- **Description**: Update user information
- **Authentication**: Required

### Delete User

- **DELETE** `/users/:id`
- **Description**: Delete a user account
- **Authentication**: Required

---

## Article Management Endpoints

### Create Article

- **POST** `/articles`
- **Description**: Create a new article
- **Authentication**: Required

### Get All Articles

- **GET** `/articles`
- **Description**: Retrieve all articles with pagination and search
- **Query Parameters**:
  - `page` (optional): Page number
  - `limit` (optional): Items per page
  - `search` (optional): Search term
  - `page` (optional): Page number
  - `limit` (optional): Items per page
- **Authentication**: Required

### Get Article by ID

- **GET** `/articles/:id`
- **Description**: Retrieve a specific article by ID
- **Authentication**: Required

### Update Article

- **PATCH** `/articles/:id`
- **Description**: Update an existing article (author only)
- **Authentication**: Required

### Delete Article

- **DELETE** `/articles/:id`
- **Description**: Delete an article (author only)
- **Authentication**: Required

### Get My Articles

- **GET** `/articles/my/articles`
- **Description**: Get articles created by the authenticated user
- **Query Parameters**:
  - `page` (optional): Page number
  - `limit` (optional): Items per page
- **Authentication**: Required

### Like Article

- **POST** `/articles/:id/like`
- **Description**: Like/unlike an article
- **Authentication**: Required

### Remove Like from Article

- **DELETE** `/articles/:id/like`
- **Description**: Remove like from an article
- **Authentication**: Required

### Get Article Likes

- **GET** `/articles/:id/likes`
- **Description**: Get all likes for a specific article
- **Query Parameters**:
  - `page` (optional): Page number
  - `limit` (optional): Items per page
- **Authentication**: Required

### Get My Liked Articles

- **GET** `/articles/my/liked`
- **Description**: Get articles liked by the authenticated user
- **Query Parameters**:
  - `page` (optional): Page number
  - `limit` (optional): Items per page
- **Authentication**: Required

---

## Comment Management Endpoints

### Create Comment

- **POST** `/comments`
- **Description**: Create a new comment on an article
- **Authentication**: Required

### Get All Comments

- **GET** `/comments`
- **Description**: Retrieve all comments with pagination
- **Query Parameters**:
  - `page` (optional): Page number
  - `limit` (optional): Items per page
- **Authentication**: Required

### Get Comments by Article

- **GET** `/comments/article/:articleId`
- **Description**: Get all comments for a specific article
- **Query Parameters**:
  - `page` (optional): Page number
  - `limit` (optional): Items per page
- **Authentication**: Required

### Get My Comments

- **GET** `/comments/my`
- **Description**: Get comments created by the authenticated user
- **Authentication**: Required

### Get Comment by ID

- **GET** `/comments/:id`
- **Description**: Retrieve a specific comment by ID
- **Authentication**: Required

### Update Comment

- **PATCH** `/comments/:id`
- **Description**: Update an existing comment (author only)
- **Authentication**: Required

### Delete Comment

- **DELETE** `/comments/:id`
- **Description**: Delete a comment (author only)
- **Authentication**: Required

---

## Search & Filtering

### Pagination

All list endpoints support pagination with the following query parameters:

- `page`: Page number (starts from 1)
- `limit`: Number of items per page (default: 10, max: 100)

---

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Error details",
  "statusCode": 400
}
```

Common HTTP status codes:

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `500`: Internal Server Error

---

## Response Format

All successful responses follow this format:

```json
{
  "success": true,
  "message": "Operation description",
  "data": {
    // Response data
  }
}
```

For paginated responses:

```json
{
  "success": true,
  "message": "Operation description",
  "data": [
    // Array of items
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

---

## Interactive API Documentation

For detailed request/response schemas and to test the API endpoints, visit:

- **Swagger UI**: `http://localhost:3005/api/docs` (when server is running)

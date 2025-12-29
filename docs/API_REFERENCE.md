# Electron API Reference

Complete API documentation for the Electron marketing tool backend.

## Base URL
```
https://electron-backend.carlos-mdtz9.workers.dev
```

## Authentication

All API endpoints (except `/api/health`, `/api/register`, `/api/login`) require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <jwt-token>
```

## Response Format

All responses follow this structure:

```json
{
  "success": true|false,
  "data": { ... } | null,
  "error": "error message" | null,
  "message": "success message" | null
}
```

---

## Authentication Endpoints

### POST /api/register

Register a new user account.

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required, min 6 chars)"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "userId": 123
}
```

**Errors:**
- 400: Invalid input data
- 409: User already exists
- 500: Server error

### POST /api/login

Authenticate user and return JWT token.

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response (200):**
```json
{
  "token": "jwt-token-string",
  "userId": 123
}
```

**Errors:**
- 400: Invalid input data
- 401: Invalid credentials
- 500: Server error

---

## Workspace Endpoints

### GET /api/workspaces

Get all workspaces for the authenticated user.

**Query Parameters:** None

**Response (200):**
```json
{
  "workspaces": [
    {
      "id": 1,
      "name": "My Brand Workspace",
      "created_at": "2025-01-01T10:00:00Z"
    }
  ]
}
```

### POST /api/workspaces

Create a new workspace.

**Request Body:**
```json
{
  "name": "string (required, max 100 chars)"
}
```

**Response (201):**
```json
{
  "message": "Workspace created successfully",
  "workspace": {
    "id": 1,
    "name": "My Workspace",
    "created_at": "2025-01-01T10:00:00Z"
  }
}
```

**Errors:**
- 400: Invalid workspace name
- 401: Unauthorized
- 500: Server error

---

## Brand Analysis Endpoints

### GET /api/analyses

Get brand analyses for a specific workspace.

**Query Parameters:**
- `workspace_id` (required): Workspace ID

**Response (200):**
```json
{
  "analyses": [
    {
      "id": 1,
      "url": "https://example.com",
      "analysis_type": "url",
      "ai_analysis": "Brand analysis content...",
      "status": "completed",
      "created_at": "2025-01-01T10:00:00Z"
    }
  ]
}
```

### POST /api/analyses

Start a new brand analysis.

**Request Body:**
```json
{
  "workspace_id": "number (required)",
  "url": "string (required for url analysis)",
  "analysis_type": "string (required: 'url' or 'file')"
}
```

**Response (201):**
```json
{
  "message": "Analysis started",
  "analysis": {
    "id": 1,
    "workspace_id": 1,
    "url": "https://example.com",
    "analysis_type": "url",
    "status": "processing",
    "created_at": "2025-01-01T10:00:00Z"
  }
}
```

**Analysis Types:**
- `url`: Analyze a website URL
- `file`: Analyze uploaded file (future feature)

---

## Character Endpoints

### GET /api/characters

Get characters for a workspace.

**Query Parameters:**
- `workspace_id` (required): Workspace ID

**Response (200):**
```json
{
  "characters": [
    {
      "id": 1,
      "name": "Professional Guide",
      "personality": "Confident, knowledgeable, approachable...",
      "description": "A reliable expert who guides customers...",
      "status": "approved",
      "created_at": "2025-01-01T10:00:00Z"
    }
  ]
}
```

### POST /api/characters

Generate AI characters for a workspace based on brand analysis.

**Request Body:**
```json
{
  "workspace_id": "number (required)",
  "brand_analysis": "number (optional: analysis ID for context)"
}
```

**Response (202):**
```json
{
  "message": "Character generation started. Characters will be available shortly.",
  "workspace_id": 1
}
```

### PUT /api/characters/{id}

Update character status.

**Path Parameters:**
- `id`: Character ID

**Request Body:**
```json
{
  "status": "string (required: 'approved' or 'discarded')"
}
```

**Response (200):**
```json
{
  "message": "Character approved successfully"
}
```

---

## Ad Generation Endpoints

### GET /api/ads

Get generated ads for a workspace.

**Query Parameters:**
- `workspace_id` (required): Workspace ID

**Response (200):**
```json
{
  "ads": [
    {
      "id": 1,
      "ad_type": "linkedin_post",
      "topic": "Product Launch",
      "content": "Generated ad content...",
      "character_name": "Professional Guide",
      "created_at": "2025-01-01T10:00:00Z"
    }
  ]
}
```

### POST /api/ads

Generate ads using approved characters.

**Request Body:**
```json
{
  "workspace_id": "number (required)",
  "character_ids": "number[] (required: approved character IDs)",
  "ad_type": "string (required)",
  "topic": "string (required)",
  "quantity": "number (required: 1-10)"
}
```

**Ad Types:**
- `linkedin_post`: Professional LinkedIn content
- `twitter`: Twitter/X posts
- `email`: Email marketing content

**Response (202):**
```json
{
  "message": "Ad generation started. Ads will be available shortly.",
  "workspace_id": 1,
  "quantity": 3,
  "ad_type": "linkedin_post"
}
```

---

## Health Check

### GET /api/health

Check API health status.

**Response (200):**
```json
{
  "status": "ok",
  "message": "Electron backend is running"
}
```

---

## Error Codes

### Common HTTP Status Codes

- **200**: Success
- **201**: Created
- **202**: Accepted (async processing)
- **400**: Bad Request (validation error)
- **401**: Unauthorized (invalid/missing token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **409**: Conflict (resource already exists)
- **500**: Internal Server Error

### Error Response Format

```json
{
  "error": "Human-readable error message",
  "code": "optional_error_code"
}
```

### Common Error Messages

- `"Email and password required"`
- `"Invalid credentials"`
- `"User already exists"`
- `"Unauthorized"`
- `"Workspace not found"`
- `"Character not found"`
- `"No approved characters found for this workspace"`
- `"Invalid status. Must be approved or discarded"`
- `"workspace_id parameter required"`

---

## Rate Limiting

- No explicit rate limiting implemented
- CloudFlare Workers have built-in abuse protection
- AI requests are processed asynchronously to prevent timeouts

## Data Validation

### Input Sanitization
- All user inputs are validated server-side
- SQL injection prevention via prepared statements
- XSS protection via input sanitization

### Business Rules
- Users can only access their own workspaces
- Characters must be approved before ad generation
- Workspace ownership verification on all operations

## WebSocket Support

Currently not implemented. All operations are REST-based with polling for status updates.

## Versioning

API versioning not implemented. All endpoints are at `/api/` level.

## SDKs & Libraries

No official SDKs available. Use standard HTTP clients.

## Changelog

See `docs/changelog.md` for API changes and updates.

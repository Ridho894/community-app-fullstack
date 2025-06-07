# Community App Backend

This is the backend for a community web application built with NestJS and TypeORM. It provides functionality for user authentication, posts, comments, likes, and admin moderation.

## Features

- **User Authentication**: Secure registration and login with JWT
- **Posts**: Create, read, update, and delete posts with title, content, and tags
- **Comments**: Add comments to posts and manage them
- **Likes**: Like/unlike posts and comments
- **Admin Panel**: Approve/reject posts and comments, view analytics

## Prerequisites

- Node.js (v14 or later)
- MariaDB/MySQL

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/community-app-fullstack.git
cd community-app-fullstack/backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the `backend` directory with the following variables:

```
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=community_app
JWT_SECRET=your_jwt_secret
```

4. Create the database:

```sql
CREATE DATABASE community_app;
```

5. Start the application:

```bash
npm run start:dev
```

The server will run on http://localhost:3000 by default.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Posts

- `GET /api/posts` - Get all approved posts
- `GET /api/posts/:id` - Get a specific post
- `POST /api/posts` - Create a new post (authenticated)
- `PATCH /api/posts/:id` - Update a post (authenticated, owner only)
- `DELETE /api/posts/:id` - Delete a post (authenticated, owner only)

### Comments

- `GET /api/comments/post/:postId` - Get all approved comments for a post
- `POST /api/comments` - Create a new comment (authenticated)
- `PATCH /api/comments/:id` - Update a comment (authenticated, owner only)
- `DELETE /api/comments/:id` - Delete a comment (authenticated, owner only)

### Likes

- `POST /api/likes` - Toggle like on a post or comment (authenticated)
- `DELETE /api/likes/:id` - Remove a like (authenticated, owner only)

### Admin

- `GET /api/admin/stats` - Get application statistics (admin only)
- `GET /api/admin/posts/pending` - Get pending posts (admin only)
- `GET /api/admin/comments/pending` - Get pending comments (admin only)
- `PATCH /api/admin/posts/:id/status` - Update post status (admin only)
- `PATCH /api/admin/comments/:id/status` - Update comment status (admin only)
- `DELETE /api/admin/posts/:id` - Delete a post (admin only)
- `DELETE /api/admin/comments/:id` - Delete a comment (admin only)

## Database Schema

The application uses the following entity relationships:

- **User**: Stores user information and authentication details
- **Post**: Contains posts created by users
- **Comment**: Stores comments on posts
- **Like**: Tracks likes on posts and comments
- **Tag**: Stores post tags
- **PostTag**: Junction table for post-tag many-to-many relationship

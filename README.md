# Community Application Full Stack

A community web application with a NestJS backend and Next.js frontend. This application allows users to register, create posts, comment on posts, like posts/comments, and provides admin functionality to moderate content.

## Project Structure

- `backend/`: NestJS API with TypeORM and MariaDB
- `frontend/`: Next.js application with React Query and Tailwind CSS

## Features

### Authentication

- Secure JWT authentication with refresh tokens
- Protected routes for authenticated users
- Role-based access control (user/admin)

### Post Management

- Create, read, update, and delete posts
- Rich text content and image uploads
- Tagging system for categorization
- Post moderation workflow (pending, approved, rejected)
- Real-time status updates via WebSocket

### User Interactions

- Like/unlike posts and comments
- Comment on posts with threaded discussions
- User profiles with post history
- Activity tracking

### Real-time Notifications

- WebSocket-based notification system
- Different notification types (likes, comments, post status changes)
- In-app notification center with read/unread status
- Real-time UI updates

### Search Functionality

- Keyword-based search across posts
- Debounced search with optimized performance
- Trending search suggestions
- Results displayed in a responsive grid layout

### Admin Features

- Dashboard with usage statistics
- Content moderation for pending posts
- Review and management of rejected posts
- User management
- Comment moderation

### UI/UX

- Responsive design for all device sizes
- Dark/light mode support
- Modern, clean interface with Tailwind CSS
- Optimized loading states and transitions

## Backend Features

- **User Authentication**: Secure registration and login with JWT
- **Posts**: Create, read, update, and delete posts with title, content, and tags
- **Comments**: Add comments to posts and manage them
- **Likes**: Like/unlike posts and comments
- **Admin Panel**: Approve/reject posts, view analytics
- **WebSockets**: Real-time notifications and updates

## Prerequisites

- Node.js (v14 or later)
- MariaDB/MySQL

## Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
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

## Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your_nextauth_secret
```

4. Start the application:

```bash
npm run dev
```

The frontend will run on http://localhost:3001 by default.

## Implemented Features Explained

### Post Lifecycle and Moderation

Posts in the system follow a specific lifecycle:

1. **Creation**: Users create posts with images and tags
2. **Pending**: New posts enter a pending state awaiting admin approval
3. **Moderation**: Admins review posts in the admin panel
4. **Approval/Rejection**: Admins can approve posts (making them visible to all users) or reject them
5. **Soft Delete**: Rejected posts are stored in the database but hidden from users
6. **Admin Review**: Admins can view rejected posts and either permanently delete them or approve them

The moderation system ensures content quality while allowing admins to recover mistakenly rejected content.

### Real-time Notification System

The application features a comprehensive WebSocket-based notification system:

- **Multiple Notification Types**: Supports likes, comments, post approvals, and post rejections
- **Real-time Delivery**: Notifications are delivered instantly without page refresh
- **Interactive UI**: Notification bell with counter shows unread notifications
- **Action Links**: Clicking notifications navigates to the relevant content
- **Status Management**: Notifications can be marked as read individually or all at once

Notifications provide immediate feedback for user actions and admin decisions, enhancing the interactive experience.

### Search Functionality

The search system provides a rich content discovery experience:

- **Optimized Performance**: Uses debounced input to prevent excessive API calls
- **Keyword Matching**: Searches across post titles, content, and tags
- **Visual Results**: Search results display in a responsive grid with post images
- **Trending Suggestions**: Shows popular search terms
- **Real-time Updates**: Results update as users type

### User Profiles

User profiles provide personalized experiences:

- **Post Management**: Users can view, edit, and delete their own posts
- **Status Tracking**: Users can see which posts are pending, approved, or rejected
- **Activity History**: Shows posts created and liked by the user
- **Real-time Updates**: Profile content updates automatically when post statuses change

## API Documentation

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

- `GET /api/comments/post/:postId` - Get all comments for a post
- `POST /api/comments` - Create a new comment (authenticated)
- `PATCH /api/comments/:id` - Update a comment (authenticated, owner only)
- `DELETE /api/comments/:id` - Delete a comment (authenticated, owner only)

### Likes

- `POST /api/likes` - Toggle like on a post or comment (authenticated)
- `DELETE /api/likes/:id` - Remove a like (authenticated, owner only)

### Admin

- `GET /api/admin/stats` - Get application statistics (admin only)
- `GET /api/admin/posts/pending` - Get pending posts (admin only)
- `GET /api/admin/posts/rejected` - Get rejected posts (admin only)
- `GET /api/admin/comments` - Get all comments (admin only)
- `PATCH /api/admin/posts/:id/status` - Update post status (admin only)
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
- **Notification**: Stores user notifications

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

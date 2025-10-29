# PostgreSQL Database Schema for Dating App Match Feature

## Overview
This document outlines the database schema for the match feature of the dating application using PostgreSQL.

## Tables

### 1. Users Table
Stores basic user profile information.

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    studied_at TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. About Me Table
Stores the "About Me" information for users.

```sql
CREATE TABLE about_me (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Looking For Table
Stores user preferences for what they're looking for in a match.

```sql
CREATE TABLE looking_for (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    preferences TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Music Table
Stores music preferences for users.

```sql
CREATE TABLE music (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    genres TEXT[],
    artists TEXT[],
    songs TEXT[],
    albums TEXT[],
    album_covers TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. Albums Table
Stores photo album information for users.

```sql
CREATE TABLE albums (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    photos TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Relationships
- All tables except `users` have a foreign key relationship with the `users` table
- When a user is deleted, all related records in other tables are automatically deleted due to `ON DELETE CASCADE`

## Notes
- Arrays in PostgreSQL are used for storing multiple values in a single column
- The `updated_at` timestamp can be automatically updated using a trigger
- All tables include timestamps for audit purposes
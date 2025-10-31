# Server - Quick Reference Guide

## File Structure

```
server/
├── config/
│   ├── database.js
│   ├── schema.js
│   └── sequelize.js
├── controllers/
│   └── authController.js          ← HTTP request handlers
├── middleware/
│   └── auth.js
├── models/
│   ├── User_Sequelize.js
│   ├── Profile_Sequelize.js
│   ├── MatchingPrefs_Sequelize.js
│   ├── UserPhoto_Sequelize.js
│   └── index_sequelize.js         ← Model barrel export
├── routes/
│   ├── auth.js                    ← Auth endpoints
│   └── index.js
├── services/
│   ├── authService.js             ← Business logic
│   └── healthCheck.js
├── server.js                      ← Main server file
├── package.json
├── .env
├── DATABASE_ARCHITECTURE.md       ← Schema documentation
├── API_DOCUMENTATION.md           ← API reference
├── IMPLEMENTATION_SUMMARY.md      ← Implementation details
└── QUICK_REFERENCE.md             ← This file
```

## Core Concepts

### Sign-Up Flow
```
POST /auth/sign-up
  ↓
authController.signUp()
  ↓
authService.createUser()
  ├─ Validate email format
  ├─ Validate birthdate format (YYYY-MM-DD)
  ├─ Check email uniqueness
  ├─ Hash password (bcrypt, 10 rounds)
  ├─ Create User record
  └─ Create Profile record (only birthdate set)
  ↓
Response: { success, data: { id, email, message } }
```

### Sign-In Flow
```
POST /auth/sign-in
  ↓
authController.signIn()
  ↓
authService.verifyCredentials()
  ├─ Validate email format
  ├─ Find user by email
  ├─ Compare password with bcrypt hash
  └─ Return user data
  ↓
Response: { success, data: { id, email, message } }
```

## API Endpoints

### POST /auth/sign-up
**Create new user account**

Request:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "birthdate": "2000-01-15"
}
```

Success (201):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "message": "User created successfully"
  }
}
```

Errors:
- `400 validation_error`: Missing required fields
- `400 invalid_email`: Invalid email format
- `400 invalid_birthdate`: Invalid birthdate format (not YYYY-MM-DD)
- `409 email_exists`: Email already registered
- `500 server_error`: Server/database error

---

### POST /auth/sign-in
**Verify credentials and sign in**

Request:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Success (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "message": "Sign in successful"
  }
}
```

Errors:
- `400 validation_error`: Missing required fields
- `401 invalid_credentials`: Invalid email or password
- `500 server_error`: Server/database error

---

## Database Models

### User
```javascript
{
  id: UUID (PK),
  email: string (unique),
  password_hash: string,
  created_at: timestamp,
  updated_at: timestamp
}
```

### Profile
```javascript
{
  user_id: UUID (PK, FK),
  // Set at sign-up:
  birthdate: date (NOT NULL),
  // Filled during onboarding (all nullable):
  first_name: string,
  last_name: string,
  middle_name: string,
  gender: enum,
  location: string,
  school: string,
  program: string,
  looking_for: text,
  interests: json,
  music: json,
  created_at: timestamp,
  updated_at: timestamp
}
```

### MatchingPrefs
```javascript
{
  user_id: UUID (PK, FK),
  open_for_everyone: boolean,
  gender_preferences: json,
  purpose_preference: json,
  distance_min_km: int,
  distance_max_km: int,
  created_at: timestamp,
  updated_at: timestamp
}
```

### UserPhoto
```javascript
{
  id: UUID (PK),
  user_id: UUID (FK),
  type: enum (card_preview | pfp | album),
  url: text,
  position: int,
  created_at: timestamp
  // Unique: (user_id, type, position)
}
```

---

## Validation Rules

| Field | Format | Validation |
|-------|--------|-----------|
| email | string | Must match `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` |
| password | string | No backend format (frontend enforces) |
| birthdate | string | Must match `YYYY-MM-DD` format |

---

## Error Codes

### Sign-Up
- `validation_error` (400): Missing required fields
- `invalid_email` (400): Email format invalid
- `invalid_birthdate` (400): Birthdate format invalid
- `email_exists` (409): Email already registered
- `server_error` (500): Database/server error

### Sign-In
- `validation_error` (400): Missing required fields
- `invalid_credentials` (401): Email or password incorrect
- `server_error` (500): Database/server error

---

## Common Tasks

### Add New Auth Endpoint

1. **Create service function** in `server/services/authService.js`:
```javascript
async function myFunction(param1, param2) {
  try {
    // Validation
    // Business logic
    return result;
  } catch (error) {
    error.code = 'MY_ERROR_CODE';
    throw error;
  }
}
```

2. **Create controller function** in `server/controllers/authController.js`:
```javascript
async function myEndpoint(req, res) {
  try {
    const result = await myFunction(req.body.param1, req.body.param2);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    if (error.code === 'MY_ERROR_CODE') {
      return res.status(400).json({ success: false, error: 'my_error' });
    }
    return res.status(500).json({ success: false, error: 'server_error' });
  }
}
```

3. **Add route** in `server/routes/auth.js`:
```javascript
router.post('/my-endpoint', myEndpoint);
```

4. **Export function** in `server/controllers/authController.js`:
```javascript
module.exports = {
  signUp,
  signIn,
  myEndpoint,  // Add here
};
```

---

### Query User with Profile

```javascript
const { User, Profile } = require('./models/index_sequelize');

// Get user with profile
const user = await User.findByPk(userId, {
  include: 'Profile'
});

// Access profile data
console.log(user.Profile.birthdate);
console.log(user.Profile.first_name); // Will be NULL until onboarding
```

---

### Update Profile During Onboarding

```javascript
const { Profile } = require('./models/index_sequelize');

// Update profile with onboarding data
await Profile.update(
  {
    first_name: 'John',
    last_name: 'Doe',
    gender: 'male',
    location: 'San Francisco',
    school: 'UC Berkeley',
    program: 'Computer Science',
    looking_for: 'Study buddy',
    interests: ['coding', 'music', 'sports'],
    music: [
      {
        music_link: 'https://...',
        album_cover: 'https://...',
        music_name: 'Song Name',
        artist: 'Artist Name'
      }
    ]
  },
  {
    where: { user_id: userId }
  }
);
```

---

### Create Matching Preferences

```javascript
const { MatchingPrefs } = require('./models/index_sequelize');

// Create matching prefs for user
await MatchingPrefs.create({
  user_id: userId,
  open_for_everyone: false,
  gender_preferences: ['female', 'nonbinary'],
  purpose_preference: ['date', 'study-buddy'],
  distance_min_km: 0,
  distance_max_km: 50
});
```

---

## Testing with cURL

### Sign-Up
```bash
curl -X POST http://localhost:3000/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "birthdate": "2000-01-15"
  }'
```

### Sign-In
```bash
curl -X POST http://localhost:3000/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Invalid Email
```bash
curl -X POST http://localhost:3000/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid",
    "password": "password123",
    "birthdate": "2000-01-15"
  }'
```

### Test Invalid Birthdate
```bash
curl -X POST http://localhost:3000/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "birthdate": "01/15/2000"
  }'
```

---

## Important Notes

1. **Profile Incomplete Data**: Only `birthdate` is set during sign-up. All other fields are NULL until onboarding.

2. **Password Security**: Passwords are hashed with bcrypt (10 salt rounds) before storage. Never store plain text passwords.

3. **Email Validation**: Email format is validated with regex at service layer. Email uniqueness is enforced at database level.

4. **Birthdate Format**: Must be `YYYY-MM-DD`. Other formats will be rejected.

5. **Error Codes**: Always check `error.code` in controller to determine HTTP status and response format.

6. **Sequelize Sync**: Models are auto-synced on server startup with `sequelize.sync({ alter: true })`.

---

## Documentation Files

- **DATABASE_ARCHITECTURE.md**: Complete schema and design decisions
- **API_DOCUMENTATION.md**: Full API reference with examples
- **IMPLEMENTATION_SUMMARY.md**: Detailed implementation overview
- **QUICK_REFERENCE.md**: This file - quick lookup guide

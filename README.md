# Routinr API Documentation

Welcome to the API documentation for the Routinr backend, where routines come to life! Whether you're a morning person or a night owl, Routinr has you covered. Dive into the details below and start building your personalized routines.

## API Endpoints

### Authentication

#### Register a New User

- **Endpoint:** `/auth/register`
- **Method:** `POST`
- **Description:** Register a new user and join the Routinr community.
- **Request Body:**
  - `first_name` (string): User's first name
  - `last_name` (string): User's last name
  - `username` (string): Chosen username
  - `email` (string, email format): User's email address
  - `password` (string): User's password
  - `phone_number` (string): User's phone number
- **Responses:**
  - `201`: Account created successfully
  - `400`: Missing user data
  - `409`: Duplicate user entry
  - `500`: Internal function error

#### Login with User Credentials

- **Endpoint:** `/auth/login`
- **Method:** `POST`
- **Description:** Log in with user credentials and get ready for Routinr adventures.
- **Request Body:**
  - `email` (string, email format): User's email address
  - `password` (string): User's password
- **Responses:**
  - `200`: Login successful
  - `401`: Invalid password
  - `404`: User not found
  - `500`: Internal server error

#### Start Email Verification Process

- **Endpoint:** `/auth/verify-user-email/start`
- **Method:** `POST`
- **Description:** Begin the email verification process.
- **Request Body:**
  - `userId` (string): User ID
  - `email` (string, email format): User's email address
- **Responses:**
  - `200`: Email sent successfully
  - `500`: Internal server error

#### Complete Email Verification Process

- **Endpoint:** `/auth/verify-user-email/end`
- **Method:** `POST`
- **Description:** Finish the email verification process.
- **Request Body:**
  - `verifyToken` (string): Verification token
  - `userId` (string): User ID
- **Responses:**
  - `200`: Email verification successful
  - `400`: Invalid or expired token
  - `500`: Internal server error

#### Initiate Password Reset Process

- **Endpoint:** `/auth/forgot-password`
- **Method:** `POST`
- **Description:** Start the password reset process.
- **Request Body:**
  - `email` (string, email format): User's email address
- **Responses:**
  - `200`: Email sent successfully
  - `404`: User not found
  - `500`: Internal server error

#### Reset User's Password

- **Endpoint:** `/auth/reset-password`
- **Method:** `POST`
- **Description:** Reset the user's password.
- **Request Body:**
  - `token` (string): Reset token
  - `password` (string): New password
- **Responses:**
  - `200`: Password reset successful
  - `400`: Invalid or expired token
  - `500`: Internal server error

### Routines

#### Retrieve Routines by User ID

- **Endpoint:** `/routines/user/{user_id}`
- **Method:** `GET`
- **Description:** Get routines associated with a specific user.
- **Parameters:**
  - `user_id` (integer): ID of the user
- **Responses:**
  - `200`: Routines retrieved successfully
  - `404`: Routines not found
  - `500`: Internal server error

#### Retrieve Information about a Routine by ID

- **Endpoint:** `/routines/view/{routine_id}`
- **Method:** `GET`
- **Description:** Get details about a specific routine.
- **Parameters:**
  - `routine_id` (integer): ID of the routine
- **Responses:**
  - `200`: Routine information retrieved successfully
  - `404`: Routine not found
  - `500`: Internal server error

## Data Schemas

### User

Represents a Routinr user.

```json
{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "hashedpassword",
  "is_email_verified": false,
  "phone_number": "1234567890"
}
```

### Routine

Describes a Routinr routine.

```json
{
  "id": 1,
  "user_id": 2,
  "name": "Morning Routine",
  "description": "A refreshing start to the day",
  "time_block": "1h",
  "steps": [
    {
      "id": 1,
      "routine_id": 1,
      "name": "Wake Up",
      "icon": "☀️",
      "time_slot": "6:00 AM",
      "description": "Greet the day with a smile"
    },
    {
      "id": 2,
      "routine_id": 1,
      "name": "Stretch",
      "icon": "🤸",
      "time_slot": "6:15 AM",
      "description": "Reach for the sky"
    }
  ]
}
```

### Step

Details a step within a Routinr routine.

```json
{
  "id": 1,
  "routine_id": 2,
  "name": "Workout",
  "icon": "🏋️‍♂️",
  "time_slot": "7:00 AM",
  "description": "Get those gains!"
}
```

## Servers

- **Development Server:** [http://localhost:3000](http://localhost:3000)
- **Production Server:** [https://routinr-backend.onrender.com](https://routinr-backend.onrender.com)

Feel free to explore, experiment, and build amazing routines with Routinr!
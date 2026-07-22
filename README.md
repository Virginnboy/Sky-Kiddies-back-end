# Sky Kiddies Backend

## Overview

The Sky Kiddies Backend is the server-side application for the Sky Kiddies e-commerce platform.

It provides RESTful APIs for user authentication, product management, shopping cart operations, order processing, password reset, image uploads, and real-time messaging between users and administrators.

The backend was built using Node.js, Express, and MongoDB with a focus on secure authentication, scalability, and maintainable code.

---

## Purpose

This backend powers the Sky Kiddies e-commerce platform by providing secure APIs for authentication, product management, shopping cart operations, order processing, and real-time communication between customers and administrators.

---

## Features

- User registration and login
- Admin authentication
- JWT authentication with protected routes
- Password reset via email
- Product management
- Shopping cart management
- Order placement
- Image upload using Cloudinary
- Real-time chat using Socket.IO
- MongoDB database integration
- Global error handling
- Secure cookie authentication

---

## Tech Stack
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication
- JSON Web Token (JWT)
- Cookies

### File Storage
- Cloudinary
- Multer

### Real-Time Communication
- Socket.IO
---
## Project Structure
controllers/
errors/
middlewares/
models/
routes/
sockets/
utils/
config/
server.js
app.js

---
## Environment Variables

Create a `.env` file and add the following variables:

```env
ADMIN_URL=
USER_URL=

PORT=
MONGO_URI=
NODE_ENV=

JWT_SECRET=
JWT_EXPIRES_IN=
COOKIE_EXPIRES_IN=

EMAIL_USERNAME=
EMAIL_PASSWORD=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

RESEND_API_KEY=
```
---
## Installation
Clone the repository

```bash
git clone https://github.com/Virginnboy/Sky-Kiddies-back-end.git
```

Install dependencies

```bash
npm install
```

Start the server

```bash
npm run dev
```
---

## API Features
- Authentication
- Product APIs
- Cart APIs
- Order APIs
- Chat APIs
- Admin APIs
- User APIs
---
## Future Improvements
- Payment gateway integration
- Product reviews and ratings
- Wishlist functionality
- Email notifications
- Order tracking
- Performance optimization
---
## Author

**Adebayo Olajide**

GitHub:
https://github.com/Virginnboy

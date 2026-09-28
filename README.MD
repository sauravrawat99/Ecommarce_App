# ShopKart: Full Stack E-Commerce Platform

A full-stack MERN e-commerce app with secure authentication, Razorpay payments, saved addresses, an admin dashboard, and smart product collections.

**Live Demo:** https://ecommerce-app-flame.vercel.app

> The backend is hosted on Render's free tier, so the first request after inactivity can take 30-60 seconds to wake up.

## Demo Credentials

| Role  | Email               | Password       |
| ----- | ------------------- | -------------- |
| raya  | `<raya@gmail.com>`            | `<raya123>`   |
| saurav | `<sauravrawat@gmail.com>`     | `<sauav123>`   |

Payments run in **Razorpay test mode**. No real money is charged. Use Razorpay's test card/UPI details, or choose Cash on Delivery.

## Screenshots

| Home | Product Page | Checkout |
| ---- | ------------ | -------- |
| ![Home](screenshots/home.png) | ![Product](screenshots/product.png) | ![Checkout](screenshots/checkout.png) |

| Cart | Admin Dashboard |
| ---- | --------------- |
| ![Cart](screenshots/cart.png) | ![Admin](screenshots/admin.png) |

## Features

**Customer**
- Signup / login with JWT stored in httpOnly cookies
- Browse products with category, brand, and price filters (with counts)
- Search, cart, and wishlist
- Multiple saved addresses (add, edit, delete, set default)
- Checkout with Razorpay (Card / UPI) or Cash on Delivery
- Order history, order details, and order cancellation (stock is restored)

**Admin**
- Role-based access control (user / admin)
- Dashboard with sales and order stats
- View all orders and update order status
- Manage users
- Product and category management with multi-image upload (Cloudinary)
- Manual and smart (rule-based) collections

## Tech Stack

| Layer    | Technologies                                                  |
| -------- | ------------------------------------------------------------- |
| Frontend | React, Redux Toolkit, React Router, Tailwind CSS, Axios       |
| Backend  | Node.js, Express.js                                           |
| Database | MongoDB, Mongoose                                             |
| Auth     | JWT, httpOnly cookies, bcrypt                                 |
| Payments | Razorpay                                                      |
| Storage  | Cloudinary (multer + streamifier)                             |
| Deploy   | Vercel (frontend), Render (backend)                           |

## Key Technical Decisions

- **Order address snapshot:** each order stores a reference to the address and a frozen copy of it. If the user later edits or deletes the address, old orders keep the correct shipping details.
- **Ownership checks:** address, order, and cancel queries filter by both `_id` and `user`, so one user cannot access another user's data (IDOR protection).
- **Payment verification on the server:** the Razorpay signature is verified on the backend before an order is marked paid. Amounts are converted to paise using `Math.round(amount * 100)`.
- **Faceted filters:** MongoDB aggregation with `$facet` and `$bucket` returns filter counts and price ranges in one query.
- **Security:** rate limiting on APIs, httpOnly cookies, CORS configuration, and admin-only routes protected by `isAuthenticated` and `isAdmin` middleware.

## Project Structure

```
Ecommarce-App/
├── client/                 # React frontend
│   └── src/
│       ├── api/            # axios instance and services
│       ├── components/
│       ├── pages/
│       └── redux/slices/
└── server/                 # Express backend
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── service/            # business logic
    └── utils/
```

## Run Locally

**Prerequisites:** Node.js 18+, a MongoDB database (local or Atlas), a Cloudinary account, and Razorpay test keys.

```bash
# 1. Clone
git clone https://github.com/sauravrawat99/Ecommarce_App.git
cd Ecommarce_App

# 2. Backend
cd server
npm install
cp .env.example .env     # fill in your values
npm run dev

# 3. Frontend (new terminal)
cd client
npm install
cp .env.example .env     # fill in your values
npm run dev
```

### Environment Variables

`server/.env`

```env
PORT=5000
MONGO_URI=<your mongodb connection string>
JWT_SECRET=<a long random string>
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=<your cloud name>
CLOUDINARY_API_KEY=<your api key>
CLOUDINARY_API_SECRET=<your api secret>

RAZORPAY_KEY_ID=<your test key id>
RAZORPAY_KEY_SECRET=<your test key secret>
```

`client/.env`

```env
VITE_API_URL=http://localhost:5000
```

## API Overview

| Area      | Example endpoints                                                     |
| --------- | --------------------------------------------------------------------- |
| Auth      | `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`        |
| Products  | `GET /products`, `GET /products/:id`                                  |
| Addresses | `GET/POST /addresses`, `PUT /addresses/:id`, `PUT /addresses/:id/set-default`, `DELETE /addresses/:id` |
| Orders    | `POST /account/orders/create/order`, `GET /account/orders/my-orders`, `PUT /account/orders/cancel/:id` |
| Payments  | `POST /payment/create`, `POST /payment/verify`                        |
| Admin     | `GET /admin/orders`, `PUT /admin/orders/:id`, `GET /admin/users`, `GET /admin/stats` |

## Future Improvements

- Product reviews and ratings
- Email notifications for order updates
- Coupon codes
- Unit and integration tests

## Author

**Saurav Rawat**
[GitHub](https://github.com/sauravrawat99) | [LinkedIn](https://linkedin.com/in/saurav-rawat-/)
# Nadagro - Next.js 14 E-commerce with Referral System

A modern e-commerce platform built with Next.js 14, TypeScript, Prisma ORM, and MySQL, featuring a referral system, admin panel, and Telegram notifications.

## 🚀 Features

- **Next.js 14 App Router** with TypeScript and TailwindCSS
- **Responsive Design** for all devices
- **MySQL Database** with Prisma ORM
- **Authentication System** with JWT
- **Referral System** with 5% discounts
- **Admin Panel** for managing products, categories, orders, and users
- **Telegram Notifications** for new orders

## 📋 Requirements

- Node.js 18.17.0 or later
- MySQL 5.7 or later
- npm or yarn

## 🛠️ Installation & Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd nadagro/version2
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up environment variables

Copy the example env file and update it with your values:

```bash
cp env.example .env
```

Edit the `.env` file and fill in your database credentials and other required variables.

### 4. Set up the database

Make sure your MySQL server is running and create a database:

```sql
CREATE DATABASE berenjda_base CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 5. Run Prisma migrations

```bash
npx prisma migrate dev --name init
```

This will create all the necessary tables in your database.

### 6. Seed the database (optional)

If you want to populate your database with sample data:

```bash
npx prisma db seed
```

### 7. Start the development server

```bash
npm run dev
# or
yarn dev
```

Your application should now be running at [http://localhost:3000](http://localhost:3000).

## 🔄 Referral System Logic

1. **User Registration with Referral**
   - When a user visits with a referral link (`/shop?ref=REF123`), the referral code is saved in localStorage
   - During registration, the code is attached to the user's record as `referred_by`

2. **First Purchase Discount**
   - New users get a 5% discount on their first purchase if they were referred
   - After purchase completion, the referral status changes from "pending" to "activated"
   - The referrer receives a 5% discount credit for their next purchase

3. **Discount Application**
   - Discounts are automatically applied during checkout
   - The system checks for referral-earned discounts or first-purchase discounts

## 👨‍💻 Admin Panel

Access the admin panel at `/admin` with the credentials set in your `.env` file.

Features:
- Dashboard with key metrics
- Product management
- Category management
- Order management
- User management
- Referral tracking

## 📱 Telegram Notifications

To set up Telegram notifications:

1. Create a Telegram bot using [@BotFather](https://t.me/botfather)
2. Get your bot token and add it to `.env`
3. Create a group or channel and add your bot
4. Get the chat ID and add it to `.env`

You'll receive notifications for new orders with details about the customer, items, and referral status.

## 🌐 API Routes

The application includes the following API routes:

- **Authentication**
  - `/api/auth/register` - Register a new user
  - `/api/auth/login` - Login a user
  - `/api/auth/logout` - Logout a user

- **Products**
  - `/api/products` - List all products or create a new one
  - `/api/products/[id]` - Get, update or delete a product

- **Categories**
  - `/api/categories` - List all categories or create a new one
  - `/api/categories/[id]` - Get, update or delete a category

- **Orders**
  - `/api/orders` - List user's orders or create a new one
  - `/api/orders/[id]` - Get order details

- **Admin**
  - `/api/admin/dashboard` - Get dashboard statistics
  - `/api/admin/referrals` - Get referral data

## 📦 Project Structure

```
version2/
├── prisma/                # Prisma schema and migrations
│   └── schema.prisma      # Database schema
├── public/                # Static assets
├── src/
│   ├── app/               # App Router pages
│   │   ├── admin/         # Admin panel pages
│   │   ├── api/           # API routes
│   │   ├── auth/          # Authentication pages
│   │   └── ...            # Other pages
│   ├── components/        # React components
│   │   ├── admin/         # Admin panel components
│   │   ├── layout/        # Layout components
│   │   └── ...            # Other components
│   └── lib/               # Utility functions
│       ├── context/       # React context providers
│       ├── hooks/         # Custom React hooks
│       ├── prisma.ts      # Prisma client
│       ├── telegram.ts    # Telegram notification functions
│       └── utils.ts       # Utility functions
├── .env                   # Environment variables (not in git)
├── env.example            # Example environment variables
└── README.md              # Project documentation
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
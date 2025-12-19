# Discount Tracker - Quick Start Guide

## ✅ What's been set up

Your Discount Tracker application is now fully configured and ready to use. Here's what has been implemented:

### Core Features Implemented:
✓ User authentication (register/login with email and password)
✓ Password hashing with bcryptjs
✓ SQLite database with Prisma ORM
✓ User dashboard with wishlist management
✓ Add items to wishlist by URL
✓ Price tracking table with discount calculation
✓ Responsive UI with Tailwind CSS
✓ NextAuth.js session management

### Project Components:
- **Frontend**: Next.js 16.1 with React 19.2, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite + Prisma ORM
- **Auth**: NextAuth.js with Credentials provider
- **Utilities**: bcryptjs (password hashing), Cheerio (web scraping), Axios, node-cron, Nodemailer

---

## 🚀 How to Run

### 1. Start the Development Server
```bash
npm run dev
```

The app will be available at: `http://localhost:3000`

### 2. Create Your First Account
- Click "Create Account" on the home page
- Enter your name, email, and password
- Click "Register"
- You'll be redirected to login

### 3. Sign In
- Enter your email and password
- Click "Sign In"
- You'll be taken to your dashboard

### 4. Add Items to Wishlist
- Paste a product URL in the "Product URL" field
- Optionally add a product title
- Click "Add to Wishlist"
- The app will capture the current price

### 5. Monitor Prices
- Your dashboard shows all wishlist items in a table
- View original price, current price, discount percentage, and last checked date
- Discounts greater than 10% are highlighted in green

---

## 📁 Project Structure Overview

```
app/
├── page.tsx                    # Home page (landing)
├── dashboard/page.tsx          # Main dashboard (protected route)
├── login/page.tsx              # Login page
├── register/page.tsx           # Registration page
├── layout.tsx                  # Root layout
└── api/
    ├── auth/
    │   ├── [...nextauth]/route.ts   # NextAuth endpoints
    │   └── register/route.ts         # User registration
    └── wishlist/route.ts            # Get/Add wishlist items

lib/
├── auth.ts                     # NextAuth configuration
└── prisma.ts                   # Prisma client instance

components/
└── Providers.tsx               # SessionProvider wrapper

prisma/
└── schema.prisma               # Database models

.env                            # Configuration (already set up)
```

---

## 🗄️ Database Models

### User Table
- `id`: Unique identifier
- `email`: Email address (unique)
- `name`: User's name
- `password`: Hashed password
- `createdAt`: Account creation date
- `updatedAt`: Last update date

### WishlistItem Table
- `id`: Unique identifier
- `userId`: Reference to user
- `url`: Product URL
- `title`: Product title
- `originalPrice`: Price when added
- `currentPrice`: Latest price
- `lastChecked`: Last price check timestamp
- `createdAt`: Item creation date
- `updatedAt`: Last update date

---

## 🔧 Environment Variables (Already Configured)

```env
DATABASE_URL="file:./dev.db"                              # SQLite database
NEXTAUTH_SECRET="supersecretkeythatislongenoughfornextauth"  # Session encryption
NEXTAUTH_URL="http://localhost:3000"                      # App URL
```

---

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth callbacks (login, logout, session)

### Wishlist Management
- `GET /api/wishlist` - Get all user's wishlist items
- `POST /api/wishlist` - Add new item to wishlist

---

## 🔄 Next Steps to Complete

To fully implement the price tracking feature, you'll need to:

1. **Implement Price Scraping** (`/app/api/wishlist/route.ts`):
   - Use Cheerio + Axios to scrape product prices from URLs
   - Different websites have different HTML structures
   - Handle errors gracefully

2. **Set Up Daily Price Checks** (new file):
   - Use node-cron to schedule daily price checks
   - Create a job that iterates through all wishlist items
   - Update prices in the database

3. **Configure Email Alerts** (new file):
   - Set up Nodemailer with your email service
   - Create email templates
   - Send notifications when discount > 10%

4. **Example for Amazon**:
```typescript
// Pseudo-code for price scraping
const scrapeAmazonPrice = async (url: string) => {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  const price = $('.a-price-whole').first().text();
  return parseFloat(price.replace('$', ''));
}
```

---

## 🐛 Troubleshooting

### Port 3000 is already in use
```bash
# Kill the process on macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Database errors
```bash
# Reset database
rm dev.db
npx prisma migrate dev
```

### Build/Compile errors
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

---

## ✨ Features Summary

| Feature | Status | Notes |
|---------|--------|-------|
| User Registration | ✅ Complete | Email/password with hashing |
| User Login | ✅ Complete | Session-based authentication |
| Wishlist Management | ✅ Complete | Add/view items |
| Dashboard | ✅ Complete | View all wishlist items |
| Price Display | ✅ Complete | Shows original, current, discount |
| Price Scraping | 🔄 Partial | Placeholder implemented |
| Daily Price Checks | ⏳ Todo | Need to set up node-cron scheduler |
| Email Alerts | ⏳ Todo | Need to configure Nodemailer |

---

## 📚 Documentation Links

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs/)
- [NextAuth.js Docs](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Cheerio](https://cheerio.js.org/)
- [node-cron](https://github.com/merencia/node-cron)
- [Nodemailer](https://nodemailer.com/)

---

## 🎯 Production Deployment Tips

1. Update `NEXTAUTH_SECRET` with a secure random value
2. Change database to PostgreSQL for production
3. Set `NEXTAUTH_URL` to your production domain
4. Use environment-specific `.env` files
5. Set up proper error logging
6. Configure CORS if needed
7. Use a task scheduler for price checks (e.g., AWS Lambda, Vercel Cron)

---

**Your app is ready! Start with `npm run dev` and enjoy! 🎉**
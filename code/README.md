# Discount Tracker Application

A personalized web application that helps you track prices on items in your wishlist. The app periodically checks prices and sends email notifications when items drop by 10% or more.

## Features

- **User Authentication**: Register and create a personalized account with email and password
- **Wishlist Management**: Add items to your wishlist by saving product URLs
- **Price Tracking**: Automatic daily price monitoring for wishlist items
- **Price Drop Alerts**: Email notifications when prices drop more than 10% from the original price
- **Dashboard**: View all wishlist items with real-time price information and discount percentages

## Tech Stack

- **Frontend**: Next.js 16.1, React 19.2, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js with Credentials provider
- **Price Scraping**: Cheerio, Axios (for web scraping)
- **Scheduling**: node-cron (for daily price checks)
- **Email**: Nodemailer (for email notifications)
- **Password Hashing**: bcryptjs

## Project Structure

```
code/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── [...nextauth]/route.ts      # NextAuth handler
│   │       └── register/route.ts            # User registration endpoint
│   │   └── wishlist/route.ts                # Wishlist API endpoints
│   ├── dashboard/page.tsx                   # Main dashboard (protected)
│   ├── login/page.tsx                       # Login page
│   ├── register/page.tsx                    # Registration page
│   ├── page.tsx                             # Home page
│   └── layout.tsx                           # Root layout with providers
├── lib/
│   ├── auth.ts                              # NextAuth configuration
│   └── prisma.ts                            # Prisma client instance
├── components/
│   └── Providers.tsx                        # NextAuth session provider
├── prisma/
│   ├── schema.prisma                        # Database schema
│   └── migrations/                          # Database migrations
├── .env                                     # Environment variables
├── next.config.ts                           # Next.js configuration
├── tsconfig.json                            # TypeScript configuration
└── package.json                             # Project dependencies

```

## Database Schema

### User Model
- `id`: Unique identifier (CUID)
- `email`: Email address (unique)
- `name`: User's name (optional)
- `password`: Hashed password
- `createdAt`: Account creation timestamp
- `updatedAt`: Last update timestamp
- `wishlistItems`: Relation to WishlistItem

### WishlistItem Model
- `id`: Unique identifier (CUID)
- `userId`: Reference to User (with cascade delete)
- `url`: Product URL
- `title`: Product title (optional)
- `originalPrice`: Initial product price
- `currentPrice`: Latest product price
- `lastChecked`: Last price check timestamp
- `createdAt`: Item creation timestamp
- `updatedAt`: Last update timestamp

## Getting Started

### Prerequisites
- Node.js (v20 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository** (if not already done):
```bash
git clone https://github.com/MonaMohammadi/Discount_tracker_application.git
cd Discount_tracker_application/code
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:
   - The `.env` file is already configured with defaults
   - Update `NEXTAUTH_SECRET` with a more secure value (optional but recommended for production):
   ```bash
   openssl rand -base64 32
   ```
   - Copy the output and update `NEXTAUTH_SECRET` in `.env`

4. **Initialize the database**:
```bash
npx prisma migrate dev
```

5. **Start the development server**:
```bash
npm run dev
```

6. **Open your browser**:
   - Navigate to `http://localhost:3000`
   - The app is now running!

## Usage

### 1. Create an Account
- Click "Create Account" on the home page
- Enter your name, email, and password
- Click "Register"
- You'll be redirected to the login page

### 2. Sign In
- Enter your email and password
- Click "Sign In"
- You'll be taken to your dashboard

### 3. Add Items to Wishlist
- On the dashboard, fill in the "Product URL" field with the link to the product
- Optionally add a "Product Title" for easy identification
- Click "Add to Wishlist"
- The item will be added and its current price will be captured

### 4. Monitor Prices
- The dashboard displays all your wishlist items in a table format
- You can see:
  - Original Price: The price when you added the item
  - Current Price: The most recent price
  - Discount %: The percentage change from original price
  - Last Checked: When the price was last updated

### 5. Price Alerts
- When a price drops by 10% or more, you'll receive an email notification
- Email notifications are sent automatically through Nodemailer

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/[...nextauth]` - NextAuth callback routes (login, logout, session)

### Wishlist
- `GET /api/wishlist` - Get all wishlist items for the authenticated user
- `POST /api/wishlist` - Add a new item to wishlist

## Running in Production

1. **Build the project**:
```bash
npm run build
```

2. **Start the production server**:
```bash
npm start
```

## Environment Variables

```
DATABASE_URL="file:./dev.db"              # SQLite database path
NEXTAUTH_SECRET="your-secret-key"         # NextAuth encryption secret (min 32 chars)
NEXTAUTH_URL="http://localhost:3000"      # Your app's URL
```

## Development Notes

### Database
- Using SQLite for development (lightweight and no setup required)
- For production, consider PostgreSQL or MySQL
- Prisma handles all database operations and migrations

### Authentication
- Using NextAuth.js with Credentials provider
- Passwords are hashed with bcryptjs (10 salt rounds)
- Sessions are JWT-based

### Styling
- Tailwind CSS v4 for all UI components
- Responsive design that works on mobile, tablet, and desktop

## Troubleshooting

### Port 3000 already in use
```bash
# On macOS/Linux
lsof -ti:3000 | xargs kill -9

# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Database issues
```bash
# Reset the database
rm dev.db
npx prisma migrate dev
```

### Clear cache
```bash
rm -rf .next
npm run dev
```

## Support

For issues or questions, please refer to the official documentation:
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

This project is private and created for personal use.

## Author

Created by Mona Mohammadi

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

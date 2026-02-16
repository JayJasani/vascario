# Firebase Setup Guide

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or select an existing project
3. Follow the setup wizard:
   - Enter a project name (e.g., "vascario")
   - Enable/disable Google Analytics (optional)
   - Click **"Create project"**

## Step 2: Enable Firestore Database

1. In your Firebase project, go to **Firestore Database** in the left sidebar
2. Click **"Create database"**
3. Choose **"Start in production mode"** (you can change security rules later)
4. Select a location for your database (choose closest to your users)
5. Click **"Enable"**

## Step 3: Generate Service Account Key

1. In Firebase Console, click the **gear icon** ⚙️ next to "Project Overview"
2. Select **"Project settings"**
3. Go to the **"Service accounts"** tab
4. Click **"Generate new private key"**
5. A JSON file will download - **keep this file secure!** It contains your service account credentials

## Step 4: Configure Your Application

You have two options to use the service account key:

### Option A: Environment Variable (Recommended for Production)

1. Open the downloaded JSON file
2. Copy the entire JSON content
3. Set it as an environment variable:

**For local development (.env.local):**
```bash
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"your-project-id",...}'
```

**For Docker:**
Add to your `docker-compose.yml`:
```yaml
environment:
  FIREBASE_SERVICE_ACCOUNT_KEY: '{"type":"service_account",...}'
```

**For production (Vercel/Netlify/etc):**
Add as a secret environment variable in your hosting platform's dashboard.

### Option B: Service Account File (Recommended for Local Development)

1. Save the downloaded JSON file as `firebase-service-account.json` in your project root
2. Add `firebase-service-account.json` to `.gitignore` (IMPORTANT - never commit this file!)
3. Set the environment variable:

**For local development (.env.local):**
```bash
GOOGLE_APPLICATION_CREDENTIALS=./firebase-service-account.json
```

**For Docker:**
Mount the file and set the path:
```yaml
volumes:
  - ./firebase-service-account.json:/app/firebase-service-account.json
environment:
  GOOGLE_APPLICATION_CREDENTIALS: /app/firebase-service-account.json
```

## Step 5: Update .gitignore

Make sure your `.gitignore` includes:
```
firebase-service-account.json
.env.local
.env
```

## Step 6: Set Up Firestore Indexes

Firebase automatically creates **single-field indexes** for all fields, so you only need to create **composite indexes** when you combine a `where` clause with an `orderBy` on a different field.

### Required Composite Indexes:

1. Go to **Firestore Database** → **Indexes** tab
2. Click **"Create Index"**
3. Create these indexes:

**Index 1: Products by Active Status (REQUIRED)**
- Collection ID: `products`
- Fields to index:
  - Field 1: `isActive` → **Ascending**
  - Field 2: `createdAt` → **Descending**
- Query scope: **Collection**

**Index 2: Orders by Status (REQUIRED)**
- Collection ID: `orders`
- Fields to index:
  - Field 1: `status` → **Ascending**
  - Field 2: `createdAt` → **Descending**
- Query scope: **Collection**

### Single-Field Indexes (Auto-created):

These are automatically created by Firebase, so **you don't need to create them manually**:
- `products.createdAt` (for ordering products)
- `orders.createdAt` (for ordering orders)
- `stockLevels.productId` (for filtering by product)
- `orderItems.orderId` (for filtering by order)

**Note:** If Firebase shows a warning like "this index is not necessary", it means Firebase will automatically handle it with single-field indexing. Only create composite indexes when you see an error message with a direct link to create the index.

## Step 7: Test Your Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start your development server:
   ```bash
   npm run dev
   ```

3. Check the console for any Firebase initialization errors

## Troubleshooting

### Error: "Firebase Admin initialization warning"
- Make sure `FIREBASE_SERVICE_ACCOUNT_KEY` or `GOOGLE_APPLICATION_CREDENTIALS` is set correctly
- Verify the JSON is valid (no extra commas, proper quotes)

### Error: "Missing or insufficient permissions"
- Make sure Firestore is enabled in your Firebase project
- Check that your service account has the correct permissions (should have "Firebase Admin SDK Administrator Service Agent" role)

### Error: "Index not found"
- When you run a query that needs a composite index, Firebase will show an error with a direct link
- Click the link in the error message - it will pre-fill the index creation form
- Wait for indexes to finish building (can take a few minutes)
- Firebase automatically creates single-field indexes, so you only need composite indexes for queries that combine `where` + `orderBy` on different fields

## Security Notes

⚠️ **IMPORTANT:**
- Never commit your service account key to version control
- Never expose your service account key in client-side code
- Rotate your keys if they're accidentally exposed
- Use environment variables or secure secret management in production

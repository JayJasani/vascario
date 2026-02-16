# Next Steps - Getting Your App Running with Firebase

## ✅ Checklist

### 1. Install Dependencies
```bash
npm install
```
This will install Firebase and Firebase Admin SDK packages.

### 2. Set Up Environment Variables

Create a `.env.local` file in your project root:

**Option A: Using Service Account JSON as Environment Variable**
```bash
# Copy the entire JSON from your Firebase service account key file
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"your-project-id","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}'

# Admin secret (for admin authentication)
ADMIN_SECRET=vascario-admin-2026
```

**Option B: Using Service Account File (Easier for Local Dev)**
1. Save your downloaded service account JSON file as `firebase-service-account.json` in project root
2. Add to `.env.local`:
```bash
GOOGLE_APPLICATION_CREDENTIALS=./firebase-service-account.json
ADMIN_SECRET=vascario-admin-2026
```

### 3. Verify Firestore is Enabled

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Firestore Database**
4. Make sure it shows "Cloud Firestore" (not "Realtime Database")
5. If you see "Get started", click it and create the database

### 4. Create Required Indexes

Go to **Firestore Database** → **Indexes** tab and create:

**Index 1: Products**
- Collection: `products`
- Fields: `isActive` (Ascending), `createdAt` (Descending)
- Scope: Collection

**Index 2: Orders**
- Collection: `orders`
- Fields: `status` (Ascending), `createdAt` (Descending)
- Scope: Collection

⏳ **Note:** Index creation can take a few minutes. You can start testing while they build.

### 5. Test Your Setup

```bash
npm run dev
```

Open your browser console and check for:
- ✅ No Firebase initialization errors
- ✅ No "index not found" errors (if you see these, wait for indexes to finish building)

### 6. Test Database Operations

#### Test Storefront (Viewing Products)
1. Visit `http://localhost:3000`
2. Check if products load (if you have any)
3. If no products, you'll need to add some via admin panel

#### Test Admin Panel
1. Visit `http://localhost:3000/admin/login`
2. Login with your admin secret
3. Try creating a product:
   - Go to "Drops" section
   - Fill out product form
   - Submit and check Firebase Console → Firestore to see if it appears

### 7. Add Sample Data (Optional)

If you want to test with sample data, you can:

1. Go to Firebase Console → Firestore Database
2. Manually add a test product:
   - Click "Start collection"
   - Collection ID: `products`
   - Document ID: (auto-generate)
   - Add fields:
     - `name` (string): "Test T-Shirt"
     - `description` (string): "A test product"
     - `price` (number): 29.99
     - `images` (array): ["https://example.com/image.jpg"]
     - `colors` (array): ["#000000", "#FFFFFF"]
     - `sizes` (array): ["S", "M", "L"]
     - `isActive` (boolean): true
     - `createdAt` (timestamp): (current time)
     - `updatedAt` (timestamp): (current time)

### 8. Fix Checkout to Save Orders (Currently Missing)

The checkout page currently doesn't save orders to Firebase. You'll need to:

1. Create a server action to handle order creation
2. Update the checkout page to call this action
3. Save order items and designs

Would you like me to implement the checkout order saving functionality?

## 🐛 Troubleshooting

### "Firebase Admin initialization warning"
- Check your `.env.local` file exists and has correct variable names
- Verify the JSON is valid (no extra commas, proper quotes)
- Make sure you're using `FIREBASE_SERVICE_ACCOUNT_KEY` OR `GOOGLE_APPLICATION_CREDENTIALS` (not both)

### "Index not found" errors
- Go to Firestore → Indexes
- Wait for indexes to finish building (status will change from "Building" to "Enabled")
- Or click the error link in your app - Firebase provides a direct link to create missing indexes

### "Missing or insufficient permissions"
- Make sure Firestore is enabled in your Firebase project
- Check that your service account has proper permissions (should be automatic)

### Products not showing
- Check Firestore Console to see if products exist
- Verify `isActive` field is set to `true`
- Check browser console for errors

## 🚀 You're Ready!

Once you've completed these steps, your app should be fully functional with Firebase! 

**Next:** Consider implementing order creation in checkout, or start adding products through the admin panel.

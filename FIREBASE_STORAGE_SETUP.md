# Firebase Storage Setup Guide

## Overview
The admin panel now supports direct image uploads instead of requiring image URLs. Images are uploaded to Firebase Storage and automatically made publicly accessible.

## Setup Steps

### 1. Enable Firebase Storage

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Storage** in the left sidebar
4. Click **"Get started"**
5. Choose **"Start in production mode"** (you can adjust rules later)
6. Select a location (same as Firestore is recommended)
7. Click **"Done"**

### 2. Configure Storage Rules

1. Go to **Storage** → **Rules** tab
2. Update the rules to allow public read access:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null; // Only authenticated admins can write
    }
  }
}
```

**Note:** For development, you can use:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true; // ⚠️ Only for development!
    }
  }
}
```

### 3. Set Environment Variable (Optional)

If your storage bucket name differs from the default, add to `.env.local`:

```bash
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
```

The default is automatically set to `{project-id}.appspot.com` based on your service account.

### 4. Test Image Upload

1. Go to `/admin/drops`
2. Click **"+ New Drop"**
3. Click **"+ Upload Images"**
4. Select one or more image files
5. Images will upload and appear as thumbnails
6. Fill out the rest of the form and submit

## How It Works

1. **Upload**: Images are uploaded to Firebase Storage in the `products/` folder
2. **Naming**: Files are named with timestamp and random string: `products/{timestamp}-{random}.{ext}`
3. **Public Access**: Files are automatically made publicly accessible
4. **URLs**: Public URLs are generated and saved to Firestore with the product

## Image Requirements

- **Formats**: JPG, PNG, WebP (any image format)
- **Size**: No hard limit, but large files may take longer to upload
- **Multiple**: You can upload multiple images per product

## Troubleshooting

### "Upload failed" error
- Check Firebase Storage is enabled
- Verify storage rules allow writes
- Check browser console for detailed error messages

### Images not displaying
- Verify storage rules allow public reads
- Check that images were successfully uploaded (check Firebase Console → Storage)
- Ensure `next.config.ts` includes `storage.googleapis.com` in image domains (already configured)

### Storage quota exceeded
- Check Firebase Console → Usage and billing
- Consider compressing images before upload
- Upgrade Firebase plan if needed

## Security Notes

⚠️ **Important:**
- Storage rules should restrict writes to authenticated admins only
- Public read access is required for images to display on the storefront
- Regularly review uploaded files in Firebase Console
- Consider implementing image optimization/compression before upload

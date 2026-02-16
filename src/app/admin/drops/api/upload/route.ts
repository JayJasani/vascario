import { NextRequest } from "next/server";
import { getStorage } from "firebase-admin/storage";
import { getApps } from "firebase-admin/app";
import { initializeApp, cert } from "firebase-admin/app";

// Initialize Firebase Admin if not already initialized
// This will reuse the existing app if already initialized
if (!getApps().length) {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
        ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
        : undefined;

    if (serviceAccount) {
        initializeApp({
            credential: cert(serviceAccount),
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${serviceAccount.project_id}.appspot.com`,
        });
    } else {
        try {
            initializeApp({
                storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
            });
        } catch (error) {
            console.warn("Firebase Admin initialization warning:", error);
        }
    }
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const files = formData.getAll("files") as File[];

        if (!files || files.length === 0) {
            return Response.json({ error: "No files provided" }, { status: 400 });
        }

        const bucket = getStorage().bucket();
        const uploadedUrls: string[] = [];

        for (const file of files) {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // Generate unique filename
            const timestamp = Date.now();
            const randomString = Math.random().toString(36).substring(2, 15);
            const fileExtension = file.name.split(".").pop() || "jpg";
            const fileName = `products/${timestamp}-${randomString}.${fileExtension}`;

            // Upload to Firebase Storage
            const fileRef = bucket.file(fileName);
            await fileRef.save(buffer, {
                metadata: {
                    contentType: file.type,
                },
            });

            // Make file publicly accessible
            await fileRef.makePublic();

            // Get public URL
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
            uploadedUrls.push(publicUrl);
        }

        return Response.json({ urls: uploadedUrls });
    } catch (error) {
        console.error("Upload error:", error);
        return Response.json(
            { error: "Failed to upload images", details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}

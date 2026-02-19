import { NextRequest } from "next/server";
import { getStorage } from "firebase-admin/storage";
import { getApps } from "firebase-admin/app";
import { initializeApp, cert } from "firebase-admin/app";

// Initialize Firebase Admin if not already initialized
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
        const file = formData.get("file") as File;
        const key = formData.get("key") as string; // "onboard1", "onboard2", "tshirtCloseup"

        if (!file) {
            return Response.json({ error: "No file provided" }, { status: 400 });
        }

        if (!key) {
            return Response.json({ error: "No key provided" }, { status: 400 });
        }

        const bucket = getStorage().bucket();
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Determine file type
        const isVideo = file.type.startsWith("video/");
        const isImage = file.type.startsWith("image/");
        
        if (!isVideo && !isImage) {
            return Response.json({ error: "File must be a video or image" }, { status: 400 });
        }

        // Generate filename based on key
        const fileExtension = file.name.split(".").pop() || (isVideo ? "webm" : "png");
        const fileName = `static-content/${key}.${fileExtension}`;

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

        return Response.json({ 
            url: publicUrl,
            type: isVideo ? "video" : "image",
            key 
        });
    } catch (error) {
        console.error("Upload error:", error);
        return Response.json(
            { error: "Failed to upload file", details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}

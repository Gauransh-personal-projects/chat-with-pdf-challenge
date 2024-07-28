"use server";

import { adminDb, adminStorage } from "@/firebaseAdmin";
import { indexName } from "@/lib/langchain";
import pineconeClient from "@/lib/pinecone";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function deleteDocument(docId: string) {
  auth().protect();

  const { userId } = await auth();

    await adminDb
    .collection("users")
    .doc(userId!)
    .collection("files")
    .doc(docId)
    .delete();

    await adminStorage
        .bucket(process.env.FIREBASE_STORAGE_BUCKET) // should be your bucket name
        .file(`users/${userId}/files/${docId}`)
        .delete();

    // Delete the embeddings from associated with the document
    const index = await pineconeClient.index(indexName);
    await index.namespace(docId).deleteAll();

    // Revalidate the dashboard page to ensure the documents are up to date
    revalidatePath("/dashboard");
}

'use server';

import { adminDb } from "@/firebaseAdmin";
import { auth } from "@clerk/nextjs/server";
import { Message } from "@/components/Chat";
import { generateLangchainCompletion } from "@/lib/langchain";
// import { generateLangchainCompletion } from "@/lib/langchain";

const FREE_LIMIT = 3;
const PAID_LIMIT = 100;

export async function askQuestion(id: string, question: string) {
    auth().protect();
    const { userId } = await auth();

    const chatRef = await adminDb
        .collection("users")
        .doc(userId!)
        .collection("files")
        .doc(id)
        .collection("chat");


    const chatSnapshot = await chatRef.get();
    const userMessages = chatSnapshot.docs.filter(
        (doc) => doc.data().role === "human"
    );

    // TODO: Limit the number the PRO/FREE users 

    const userMessage: Message = {
        role: "human",
        message: question,
        createdAt: new Date(),
    }

    await chatRef.add(userMessage);

    const reply = await generateLangchainCompletion(id, question);

    const aiMessage: Message = {
        role: "ai",
        message: reply,
        createdAt: new Date(),
    };

    await chatRef.add(aiMessage);

    return { success: true, message: null };
}

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export interface ChatThread {
  _id?: string;
  threadId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messages: {
    id: string;
    role: "user" | "assistant";
    content: string;
    components?: unknown[];
    timestamp: Date;
  }[];
  mood?: string;
}

// GET /api/threads - List all threads
export async function GET() {
  try {
    const db = await getDb();
    const threads = await db
      .collection<ChatThread>("threads")
      .find({})
      .sort({ updatedAt: -1 })
      .project({ threadId: 1, title: 1, createdAt: 1, updatedAt: 1, mood: 1 })
      .toArray();

    return NextResponse.json({ threads });
  } catch (error) {
    console.error("Error fetching threads:", error);
    return NextResponse.json(
      { error: "Failed to fetch threads" },
      { status: 500 }
    );
  }
}

// POST /api/threads - Create new thread
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { threadId, title = "New Conversation" } = body;

    if (!threadId) {
      return NextResponse.json(
        { error: "threadId is required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const now = new Date();

    const thread: ChatThread = {
      threadId,
      title,
      createdAt: now,
      updatedAt: now,
      messages: [],
    };

    const result = await db.collection<ChatThread>("threads").insertOne(thread);

    return NextResponse.json({
      success: true,
      thread: { ...thread, _id: result.insertedId },
    });
  } catch (error) {
    console.error("Error creating thread:", error);
    return NextResponse.json(
      { error: "Failed to create thread" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { auth } from "@/auth";

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
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDb();
    const threads = await db
      .collection<ChatThread>("threads")
      .find({ userId: session.user.id })
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
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    const thread = {
      threadId,
      title,
      createdAt: now,
      updatedAt: now,
      messages: [],
      userId: session.user.id,
    };

    const result = await db.collection("threads").insertOne(thread);

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

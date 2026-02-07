import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { auth } from "@/auth";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/threads/[id] - Get single thread
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const db = await getDb();
    const thread = await db.collection("threads").findOne({ threadId: id, userId: session.user.id });

    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    return NextResponse.json({ thread });
  } catch (error) {
    console.error("Error fetching thread:", error);
    return NextResponse.json(
      { error: "Failed to fetch thread" },
      { status: 500 }
    );
  }
}

// PUT /api/threads/[id] - Update thread
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();
    const { title, messages, mood } = body;

    const db = await getDb();
    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (title !== undefined) updateData.title = title;
    if (messages !== undefined) updateData.messages = messages;
    if (mood !== undefined) updateData.mood = mood;

    const result = await db.collection("threads").updateOne(
      { threadId: id, userId: session.user.id },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating thread:", error);
    return NextResponse.json(
      { error: "Failed to update thread" },
      { status: 500 }
    );
  }
}

// DELETE /api/threads/[id] - Delete thread
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const db = await getDb();
    const result = await db.collection("threads").deleteOne({ threadId: id, userId: session.user.id });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting thread:", error);
    return NextResponse.json(
      { error: "Failed to delete thread" },
      { status: 500 }
    );
  }
}

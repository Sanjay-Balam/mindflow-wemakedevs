import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { auth } from "@/auth";

// GET /api/journals - List journal entries
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDb();
    const journals = await db
      .collection("journals")
      .find({ userId: session.user.id })
      .sort({ timestamp: -1 })
      .toArray();

    return NextResponse.json({ journals });
  } catch (error) {
    console.error("Error fetching journals:", error);
    return NextResponse.json(
      { error: "Failed to fetch journals" },
      { status: 500 }
    );
  }
}

// POST /api/journals - Create a new journal entry
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, mood, tags, source } = body;

    if (!content) {
      return NextResponse.json(
        { error: "content is required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const journal = {
      id: `journal_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      title: title || "Untitled Entry",
      content,
      mood: mood || undefined,
      tags: tags || [],
      timestamp: new Date().toISOString(),
      userId: session.user.id,
      source: source || "journal-page",
    };

    await db.collection("journals").insertOne(journal);

    return NextResponse.json({ success: true, journal });
  } catch (error) {
    console.error("Error saving journal:", error);
    return NextResponse.json(
      { error: "Failed to save journal" },
      { status: 500 }
    );
  }
}

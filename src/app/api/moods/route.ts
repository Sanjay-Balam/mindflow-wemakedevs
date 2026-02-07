import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { auth } from "@/auth";

export interface MoodEntry {
  id: string;
  mood: "great" | "good" | "okay" | "bad" | "terrible";
  emotions: string[];
  triggers?: string[];
  note?: string;
  timestamp: string;
  threadId?: string;
}

// GET /api/moods - List mood entries (with optional days filter)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30", 10);

    const db = await getDb();

    // Calculate date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const moods = await db
      .collection<MoodEntry>("moods")
      .find({
        userId: session.user.id,
        timestamp: { $gte: startDate.toISOString() },
      })
      .sort({ timestamp: -1 })
      .limit(100)
      .toArray();

    return NextResponse.json({ moods });
  } catch (error) {
    console.error("Error fetching moods:", error);
    return NextResponse.json(
      { error: "Failed to fetch moods" },
      { status: 500 }
    );
  }
}

// POST /api/moods - Save a new mood entry
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { mood, emotions, triggers, note, timestamp, threadId } = body;

    if (!mood) {
      return NextResponse.json(
        { error: "mood is required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const moodEntry = {
      id: `mood_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      mood,
      emotions: emotions || [],
      triggers: triggers || undefined,
      note: note || undefined,
      timestamp: timestamp || new Date().toISOString(),
      threadId,
      userId: session.user.id,
    };

    await db.collection("moods").insertOne(moodEntry);

    return NextResponse.json({
      success: true,
      mood: moodEntry,
    });
  } catch (error) {
    console.error("Error saving mood:", error);
    return NextResponse.json(
      { error: "Failed to save mood" },
      { status: 500 }
    );
  }
}

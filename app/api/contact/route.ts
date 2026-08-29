import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend-fetch";

const API_BASE_URL =
  process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(request: NextRequest) {
  try {
    if (!API_BASE_URL) {
      throw new Error("Missing API_BASE_URL");
    }

    const body = await request.json();

    // backendFetch adds the client IP the platform resolved; x-forwarded-for
    // and x-real-ip off the incoming request are spoofable and must not become
    // the backend's rate-limit key.
    const res = await backendFetch(`${API_BASE_URL}/api/v1/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Failed to submit contact form" },
      { status: 500 }
    );
  }
}

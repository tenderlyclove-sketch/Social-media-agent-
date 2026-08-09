import { NextRequest, NextResponse } from "next/server";
import { orchestrate } from "./orchestrator";

export async function POST(req: NextRequest) {
  try {

    const body = await req.json();

    const message =
      body.message ??
      body.prompt ??
      "";

    if (!message.trim()) {

      return NextResponse.json(
        {
          success: false,
          reply: "No message received."
        },
        {
          status: 400
        }
      );

    }

    const result = await orchestrate(message);

    return NextResponse.json(result);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        reply: "Internal Server Error"
      },
      {
        status: 500
      }
    );

  }
}
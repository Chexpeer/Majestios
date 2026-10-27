import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    status: "ok",
    application: "MajestiOS",
    stage: "prototype",
    databaseConnected: false,
  });
}

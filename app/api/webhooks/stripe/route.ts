import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.text();
  const cookieStore = await cookies();


  return NextResponse.json({ body, cookieStore });
}

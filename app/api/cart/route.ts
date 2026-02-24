import { NextResponse, NextRequest } from "next/server";
import { getCurrentAppUser } from "@/lib/auth";
import { cartController } from "@/lib/controllers/CartController";

export async function GET() {
  const user = await getCurrentAppUser();
  if (!user) return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
  const cart = await cartController.getByUser(String(user._id));
  return NextResponse.json({ success: true, data: cart });
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentAppUser();
    if (!user) return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    const body = await request.json();
    const { presetId, price } = body;
    if (!presetId) return NextResponse.json({ success: false, error: "Missing presetId" }, { status: 400 });
    const cart = await cartController.addItem(String(user._id), String(presetId), Number(price ?? 0));
    return NextResponse.json({ success: true, data: cart });
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentAppUser();
    if (!user) return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    const url = new URL(request.url);
    const presetId = url.searchParams.get("presetId");
    if (presetId) {
      const cart = await cartController.removeItem(String(user._id), presetId);
      return NextResponse.json({ success: true, data: cart });
    } else {
      const cart = await cartController.clearCart(String(user._id));
      return NextResponse.json({ success: true, data: cart });
    }
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}


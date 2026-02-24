import { NextResponse, NextRequest } from "next/server";
import { getCurrentAppUser } from "@/lib/auth";
import { orderController } from "@/lib/controllers/OrderController";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentAppUser();
    if (!user) return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    // For mock payment we simply create the order and mark it paid
    const order = await orderController.createOrderFromCart(String(user._id));
    return NextResponse.json({ success: true, data: order });
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}


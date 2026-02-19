import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { connectToDatabase } from "@/lib/mongoose";
import { OrderModel } from "@/models/Order";
import { UserModel } from "@/models/User";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ success: false, error: "Webhook misconfigured" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const presetIds = (session.metadata?.presetIds ?? "").split(",").filter(Boolean);

    await connectToDatabase();
    await OrderModel.create({
      userId,
      presets: presetIds,
      totalPrice: (session.amount_total ?? 0) / 100,
      stripeSessionId: session.id,
      status: "paid"
    });

    await UserModel.findByIdAndUpdate(userId, { $addToSet: { purchasedPresets: { $each: presetIds } } });
  }

  return NextResponse.json({ received: true });
}

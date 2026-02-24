import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { connectToDatabase } from "@/lib/mongoose";
import { ordersController } from "@/lib/controllers/OrdersController";
import { usersController } from "@/lib/controllers/UsersController";

export async function POST(request: Request) {
  const body = await request.text();
  const headerStore = await headers();
  const signature = headerStore.get("stripe-signature");

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
    await ordersController.create({
      userId,
      presets: presetIds,
      totalPrice: (session.amount_total ?? 0) / 100,
      stripeSessionId: session.id,
      status: "paid"
    });

    await usersController.addToSet(userId, "purchasedPresets", presetIds);
  }

  return NextResponse.json({ received: true });
}

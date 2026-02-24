import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { connectToDatabase } from "@/lib/mongoose";
import { presetsController } from "@/lib/controllers/PresetsController";
import { getCurrentAppUser } from "@/lib/auth";

export async function POST(request: Request) {
  await connectToDatabase();
  const user = await getCurrentAppUser();
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const { presetId } = await request.json();
  const preset = await presetsController.getById(presetId);
  if (!preset || !preset.isPublished) {
    return NextResponse.json({ success: false, error: "Preset unavailable" }, { status: 404 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/presets/${presetId}`,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(preset.price * 100),
          product_data: {
            name: preset.title,
            description: preset.description
          }
        }
      }
    ],
    metadata: {
      userId: String((user as any)._id ?? user.email ?? "user"),
      presetIds: String(preset._id)
    }
  });

  return NextResponse.json({ success: true, data: { checkoutUrl: session.url } });
}

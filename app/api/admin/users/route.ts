import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { connectToDatabase } from "@/lib/controllers/db";
import UserModel, { ROLES, type UserRole } from "@/models/User";

export async function GET() {
  try {
    await requireAdmin();
    await connectToDatabase();
    const users = await UserModel.find({}).sort({ createdAt: -1 }).lean().exec();
    return NextResponse.json({
      success: true,
      data: users.map((u) => ({
        _id: String(u._id),
        email: u.email,
        name: u.name,
        image: u.image,
        role: u.role,
        createdAt: u.createdAt,
      })),
    });
  } catch {
    return NextResponse.json({ success: false, error: "Not authorized" }, { status: 403 });
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { userId, role } = body as { userId: string; role: string };
    if (!userId || !role) {
      return NextResponse.json({ success: false, error: "Missing userId or role" }, { status: 400 });
    }
    if (!ROLES.includes(role as UserRole)) {
      return NextResponse.json({ success: false, error: "Invalid role" }, { status: 400 });
    }
    await connectToDatabase();
    const user = await UserModel.findByIdAndUpdate(userId, { role }, { new: true }).lean().exec();
    if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    return NextResponse.json({
      success: true,
      data: { _id: String(user._id), email: user.email, role: user.role },
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 403 });
  }
}

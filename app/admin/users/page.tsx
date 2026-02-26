import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { connectToDatabase } from "@/lib/controllers/db";
import UserModel from "@/models/User";
import { AdminUsersTable } from "@/components/AdminUsersTable";

export default async function AdminUsersPage() {
  await requireAdmin();
  await connectToDatabase();
  const users = await UserModel.find({}).sort({ createdAt: -1 }).lean().exec();
  const serialized = users.map((u) => ({
    _id: String(u._id),
    email: u.email,
    name: u.name ?? null,
    image: u.image ?? null,
    role: u.role,
  }));

  return (
    <>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>Admin Users</h2>
        <Link href="/admin/presets">Presets</Link>
      </div>
      <AdminUsersTable users={serialized} />
    </>
  );
}

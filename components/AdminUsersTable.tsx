"use client";

import { Select, Table } from "antd";
import { ROLES, type AppRole } from "@/lib/constants";

type UserRow = { _id: string; email: string; name: string | null; image: string | null; role: string };

export function AdminUsersTable({ users }: { users: UserRow[] }) {
  const handleRoleChange = async (userId: string, role: string) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data?.error ?? "Failed to update role");
        return;
      }
      window.location.reload();
    } catch (e) {
      alert("Failed to update role");
    }
  };

  return (
    <Table
      rowKey="_id"
      dataSource={users}
      columns={[
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "Name", dataIndex: "name", key: "name", render: (v: string | null) => v ?? "—" },
        {
          title: "Role",
          dataIndex: "role",
          key: "role",
          render: (role: string, record: UserRow) => (
            <Select
              value={role}
              style={{ width: 120 }}
              options={ROLES.map((r) => ({ label: r, value: r }))}
              onChange={(v) => handleRoleChange(record._id, v as AppRole)}
            />
          ),
        },
      ]}
      pagination={false}
    />
  );
}

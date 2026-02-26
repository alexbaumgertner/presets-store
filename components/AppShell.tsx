"use client";

import { Layout, Menu, Button, Dropdown } from "antd";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

const { Header, Content } = Layout;

type SessionUser = { id?: string; email?: string | null; name?: string | null; role?: string };

function AuthSlot() {
  const { data: session, status } = useSession();
  const user = session?.user as SessionUser | undefined;

  if (status === "loading") {
    return <Button type="default" disabled>Loading…</Button>;
  }
  if (!session?.user) {
    return (
      <Link href="/signin">
        <Button type="primary">Sign in</Button>
      </Link>
    );
  }
  return (
    <Dropdown
      menu={{
        items: [
          { key: "email", label: user?.email ?? "User", disabled: true },
          { type: "divider" },
          { key: "signout", label: "Sign out", onClick: () => signOut({ callbackUrl: "/" }) },
        ],
      }}
      placement="bottomRight"
    >
      <Button type="default">{user?.email ?? "Account"}</Button>
    </Dropdown>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const user = session?.user as SessionUser | undefined;
  const role = user?.role;
  const isManagerOrAdmin = role === "manager" || role === "admin";
  const isAdmin = role === "admin";

  const menuItems = [
    { key: "presets", label: <Link href="/presets">Presets</Link> },
    { key: "library", label: <Link href="/library">Library</Link> },
    { key: "cart", label: <Link href="/cart">Cart</Link> },
  ];
  if (isManagerOrAdmin) {
    menuItems.push({ key: "admin-presets", label: <Link href="/admin/presets">Admin Presets</Link> });
  }
  if (isAdmin) {
    menuItems.push({ key: "admin-users", label: <Link href="/admin/users">Admin Users</Link> });
  }

  return (
    <Layout>
      <Header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Menu
          mode="horizontal"
          theme="dark"
          style={{ flex: 1, minWidth: 0 }}
          items={menuItems}
        />
        <AuthSlot />
      </Header>
      <Content style={{ width: "100%" }}>
        <main>{children}</main>
      </Content>
    </Layout>
  );
}

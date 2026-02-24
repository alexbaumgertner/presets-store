"use client";

import { Layout, Menu, Button } from "antd";
import Link from "next/link";

const { Header, Content } = Layout;

export function AppShell({
  children,
  rightSlot,
}: {
  children: React.ReactNode;
  rightSlot: React.ReactNode;
}) {
  return (
    <Layout>
      <Header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Menu
          mode="horizontal"
          theme="dark"
          style={{ flex: 1, minWidth: 0 }}
          items={[
            { key: "presets", label: <Link href="/presets">Presets</Link> },
            { key: "library", label: <Link href="/library">Library</Link> },
            { key: "cart", label: <Link href="/cart">Cart</Link> },
            { key: "admin", label: <Link href="/admin/presets">Admin</Link> },
          ]}
        />
        {rightSlot}
      </Header>
      <Content style={{ width: "100%" }}>
        <main>{children}</main>
      </Content>
    </Layout>
  );
}

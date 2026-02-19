import type { Metadata } from "next";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Button, Layout, Menu } from "antd";
import Link from "next/link";
import "./globals.css";

const { Header, Content } = Layout;

export const metadata: Metadata = {
  title: "Preset Store",
  description: "Marketplace for guitar processor presets"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <AntdRegistry>
            <Layout>
              <Header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Menu
                  mode="horizontal"
                  theme="dark"
                  style={{ flex: 1, minWidth: 0 }}
                  items={[
                    { key: "presets", label: <Link href="/presets">Presets</Link> },
                    { key: "library", label: <Link href="/library">Library</Link> },
                    { key: "admin", label: <Link href="/admin/presets">Admin</Link> }
                  ]}
                />
                <SignedIn>
                  <UserButton />
                </SignedIn>
                <SignedOut>
                  <SignInButton>
                    <Button type="primary">Sign in</Button>
                  </SignInButton>
                </SignedOut>
              </Header>
              <Content>
                <main>{children}</main>
              </Content>
            </Layout>
          </AntdRegistry>
        </body>
      </html>
    </ClerkProvider>
  );
}

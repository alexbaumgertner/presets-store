import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Button } from "antd";
import { AppShell } from "@/components/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Preset Store",
  description: "Marketplace for guitar processor presets",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <AppShell
            rightSlot={
              <Button type="default" disabled>
                Dev user
              </Button>
            }
          >
            {children}
          </AppShell>
        </AntdRegistry>
      </body>
    </html>
  );
}

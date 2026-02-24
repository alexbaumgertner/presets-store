import { connectToDatabase } from "../lib/mongoose";
import { usersController } from "../lib/controllers/UsersController";
import { presetsController } from "../lib/controllers/PresetsController";
import { ordersController } from "../lib/controllers/OrdersController";
import { downloadTokensController } from "../lib/controllers/DownloadTokensController";
import {
  mockUsers,
  mockPresets,
  generateMockOrders,
  generateMockDownloadTokens
} from "./mock-data";
import { writeJSON } from "../lib/controllers/storeFile";

export async function runSeed({ shouldClear }: { shouldClear: boolean }) {
  try {
    console.log("Connecting to database...");
    await connectToDatabase();
    console.log("Connected to database");

    if (shouldClear) {
      console.log("Clearing existing collections...");
      await writeJSON("users.json", []);
      await writeJSON("presets.json", []);
      await writeJSON("orders.json", []);
      await writeJSON("downloadTokens.json", []);
      console.log("Collections cleared");
    }

    // Seed Users
    console.log("Seeding users...");
    const createdUsers = await Promise.all(
      mockUsers.map((user) => usersController.upsert({ email: user.email }, user))
    );
    console.log(`Created ${createdUsers.length} users`);

    // Get admin user ID for preset authorId
    const adminUser = createdUsers.find((u) => u.role === "admin");
    const adminUserId = adminUser?._id || createdUsers[0]._id;

    // Seed Presets
    console.log("Seeding presets...");
    const createdPresets = await Promise.all(
      mockPresets.map((preset) =>
        presetsController.upsert(
          { title: preset.title },
          {
            ...preset,
            authorId: adminUserId
          }
        )
      )
    );
    console.log(`Created ${createdPresets.length} presets`);

    // Seed Orders
    console.log("Seeding orders...");
    const userIds = createdUsers.map((u) => u._id);
    const presetIds = createdPresets.map((p) => p._id);
    const mockOrders = generateMockOrders(userIds, presetIds);

    const createdOrders = await Promise.all(
      mockOrders.map((order) =>
        ordersController.upsert(
          { stripeSessionId: order.stripeSessionId },
          {
            userId: order.userId,
            presets: order.presets,
            totalPrice: order.totalPrice,
            stripeSessionId: order.stripeSessionId,
            status: order.status
          }
        )
      )
    );
    console.log(`Created ${createdOrders.length} orders`);

    // Update users' purchasedPresets based on paid orders
    console.log("Updating user purchased presets...");
    const paidOrders = createdOrders.filter((o) => o.status === "paid");
    for (const order of paidOrders) {
      await usersController.addToSet(order.userId, "purchasedPresets", order.presets);
    }
    console.log("Updated user purchased presets");

    // Seed Download Tokens (only for paid orders)
    console.log("Seeding download tokens...");
    const mockTokens = generateMockDownloadTokens(userIds, presetIds);
    const createdTokens = await Promise.all(
      mockTokens.map((token) =>
        downloadTokensController.create({
          presetId: token.presetId,
          userId: token.userId,
          expiresAt: token.expiresAt
        })
      )
    );
    console.log(`Created ${createdTokens.length} download tokens`);

    console.log("\n✅ Seed completed successfully!");
    console.log(`\nSummary:`);
    console.log(`- Users: ${createdUsers.length}`);
    console.log(`- Presets: ${createdPresets.length}`);
    console.log(`- Orders: ${createdOrders.length}`);
    console.log(`- Download Tokens: ${createdTokens.length}`);
    console.log(`\nAdmin user: ${adminUser?.email}`);
    console.log(`Regular users: ${createdUsers.filter((u) => u.role === "user").map((u) => u.email).join(", ")}`);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

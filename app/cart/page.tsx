import { redirect } from "next/navigation";
import { getCurrentAppUser } from "@/lib/auth";
import { cartController } from "@/lib/controllers/CartController";
import CartView from "@/components/CartView";
import fs from "fs";

export default async function CartPage() {
  const user = await getCurrentAppUser();
  if (!user) redirect("/sign-in");

  const cart = await cartController.getByUser(String(user._id));

  // #region agent log
  // Debug: send minimal cart shape/types to debug ingestion endpoint
  ;(function () {
    try {
      fetch('http://127.0.0.1:7364/ingest/72c0686f-b405-4f98-81f4-77e8261d35c8', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Debug-Session-Id': 'c4a4d1'
        },
        body: JSON.stringify({
          sessionId: 'c4a4d1',
          runId: 'initial',
          hypothesisId: 'A',
          location: 'app/cart/page.tsx:13',
          message: 'cart shape/types',
          data: {
            _id_type: typeof (cart as any)?._id,
            _id_string: String((cart as any)?._id),
            has_items: Array.isArray((cart as any)?.items),
            first_item_presetId_type: typeof (cart as any)?.items?.[0]?.presetId,
            first_item_presetId_string: (cart as any)?.items?.[0]?.presetId ? String((cart as any).items[0].presetId) : null
          },
          timestamp: Date.now()
        })
      }).catch(()=>{});
    } catch (e) {}
  })();
  // #endregion
  // Create a fully plain-serializable cart object to pass to client
  const c: any = cart;
  const serializableCart = {
    ...c,
    _id: c?._id ? String(c._id) : null,
    createdAt: c?.createdAt ? new Date(c.createdAt).toISOString() : undefined,
    updatedAt: c?.updatedAt ? new Date(c.updatedAt).toISOString() : undefined,
    items: (c?.items || []).map((it: any) => ({
      ...it,
      presetId: it?.presetId ? String(it.presetId) : null,
      addedAt: it?.addedAt ? new Date(it.addedAt).toISOString() : undefined,
    })),
  };

  // #region agent log
  ;(function () {
    try {
      fetch('http://127.0.0.1:7364/ingest/72c0686f-b405-4f98-81f4-77e8261d35c8', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Debug-Session-Id': 'c4a4d1'
        },
        body: JSON.stringify({
          sessionId: 'c4a4d1',
          runId: 'post-fix',
          hypothesisId: 'fix-serialize',
          location: 'app/cart/page.tsx:serialize',
          message: 'serializable cart prepared',
          data: {
            _id_type: typeof (serializableCart as any)?._id,
            first_item_presetId_type: typeof (serializableCart as any)?.items?.[0]?.presetId,
            first_item_presetId_value: (serializableCart as any)?.items?.[0]?.presetId ?? null
          },
          timestamp: Date.now()
        })
      }).catch(()=>{});
    } catch (e) {}
  })();
  // #endregion

  // #region agent file-log
  ;(function () {
    try {
      const payload = {
        sessionId: "c4a4d1",
        id: `log_${Date.now()}_file`,
        timestamp: Date.now(),
        location: "app/cart/page.tsx:serialize:filelog",
        message: "writing serializable cart to debug file",
        runId: "file-log",
        hypothesisId: "A-file",
        data: {
          _id_type: typeof (serializableCart as any)?._id,
          first_item_presetId_type: typeof (serializableCart as any)?.items?.[0]?.presetId,
          first_item_presetId_value: (serializableCart as any)?.items?.[0]?.presetId ?? null
        }
      };
      try {
        fs.appendFileSync("/Users/alexbaumgertner/Projects/presets-store/.cursor/debug-c4a4d1.log", JSON.stringify(payload) + "\\n");
      } catch (e) {}
    } catch (e) {}
  })();
  // #endregion

  return (
    <div>
      <CartView cart={serializableCart} />
    </div>
  );
}


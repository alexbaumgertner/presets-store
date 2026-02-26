import { redirect } from "next/navigation";
import { getCurrentAppUser } from "@/lib/auth";
import { cartController } from "@/lib/controllers/CartController";
import CartView from "@/components/CartView";

export default async function CartPage() {
  const user = await getCurrentAppUser();
  if (!user) redirect("/signin");

  const cart = await cartController.getByUser(String(user._id));

  return (
    <div>
      <CartView cart={cart} />
    </div>
  );
}

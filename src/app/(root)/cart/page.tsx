
"use client";

import { useCartStore } from "@/store/cart";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Minus, Plus } from "lucide-react";
import { useState } from "react";

export default function CartPage() {
  const { items, total, removeItem, updateQuantity, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Checkout error: " + (data.error || "Unknown error"));
      }
    } catch (e) {
      console.error(e);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h1 className="text-heading-2">Your Bag is Empty</h1>
        <Link href="/products" className="rounded-full bg-dark-900 px-8 py-3 text-light-100 hover:opacity-90">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-heading-2 mb-8">Bag</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          <ul className="divide-y divide-light-300 border-t border-light-300">
            {items.map((item) => (
              <li key={item.id} className="flex py-6 gap-6">
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-light-300">
                  {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                </div>

                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-body-medium text-dark-900">{item.name}</h3>
                      <p className="mt-1 text-caption text-dark-700">${item.price.toFixed(2)}</p>
                    </div>
                    <p className="text-body-medium text-dark-900">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 rounded-full border border-light-300 hover:border-dark-500"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="text-body w-8 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 rounded-full border border-light-300 hover:border-dark-500"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-dark-700 hover:text-red-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-4">
          <div className="rounded-xl bg-light-100 p-6 border border-light-300 sticky top-24">
            <h2 className="text-heading-3 mb-4">Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-body">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-body">
                <span>Estimated Shipping & Handling</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-body border-t border-light-300 pt-3 font-medium">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            
            <button 
              onClick={handleCheckout}
              disabled={loading}
              className="w-full rounded-full bg-dark-900 py-4 text-body-medium text-light-100 hover:opacity-90 disabled:opacity-50 transition"
            >
              {loading ? "Processing..." : "Checkout with Stripe"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

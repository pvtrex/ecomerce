
"use client";

import { useState } from "react";
import { ShoppingBag, Heart } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { SizePicker } from "@/components";
import ColorSwatches from "@/components/ColorSwatches";

interface ProductActionsProps {
  product: {
    id: string;
    name: string;
  };
  variants: any[];
  displayPrice: number;
}

export default function ProductActions({ product, variants, displayPrice }: ProductActionsProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const handleAddToBag = () => {
    // In a real app, we would get the selected variant based on color and size
    // For now, we'll just add the product with basic info
    addItem({
      id: product.id, // Ideally variant ID
      name: product.name,
      price: displayPrice,
      image: variants[0]?.images[0],
    });
    
    // Optional: show some feedback or open cart
    alert("Added to bag!");
  };

  return (
    <div className="flex flex-col gap-6">
      <ColorSwatches productId={product.id} variants={variants} />
      
      {/* Passing a callback to SizePicker would be better, but for now we'll just show it */}
      <SizePicker />

      <div className="flex flex-col gap-3">
        <button 
          onClick={handleAddToBag}
          className="flex items-center justify-center gap-2 rounded-full bg-dark-900 px-6 py-4 text-body-medium text-light-100 transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-dark-500]"
        >
          <ShoppingBag className="h-5 w-5" />
          Add to Bag
        </button>
        <button className="flex items-center justify-center gap-2 rounded-full border border-light-300 px-6 py-4 text-body-medium text-dark-900 transition hover:border-dark-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-dark-500]">
          <Heart className="h-5 w-5" />
          Favorite
        </button>
      </div>
    </div>
  );
}

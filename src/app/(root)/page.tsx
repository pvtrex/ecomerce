import React from "react";
import { Card } from "@/components";
import { getCurrentUser } from "@/lib/auth/actions";
import { getAllProducts } from "@/lib/actions/product";

export const dynamic = "force-dynamic";

const Home = async () => {
  const user = await getCurrentUser();
  const { products: dbProducts } = await getAllProducts({
    page: 1,
    limit: 6,
    genderSlugs: [],
    brandSlugs: [],
    categorySlugs: [],
    sizeSlugs: [],
    colorSlugs: [],
    priceRanges: [],
    sort: "newest",
  });


  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <section aria-labelledby="latest" className="py-12">
        <h2 id="latest" className="mb-8 text-heading-3 text-dark-900">
          Latest shoes
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {dbProducts.map((p) => (
            <Card
              key={p.id}
              title={p.name}
              subtitle={p.subtitle || "Nike Shoes"}
              imageSrc={p.imageUrl || "/placeholder.png"}
              price={p.minPrice ?? 0}
              href={`/products/${p.id}`}
            />
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;

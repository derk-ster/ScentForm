"use client";

import type { PrimaryCategoryHandle, Product } from "@/types/catalog";
import { ContextMatchQuiz } from "@/components/shop/ContextMatchQuiz";

export function CategoryQuizCta({
  products,
  category,
}: {
  products: Product[];
  category: PrimaryCategoryHandle;
}) {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      <ContextMatchQuiz
        seedProducts={products}
        scope="category"
        category={category}
        triggerLabel="Match me"
      />
      <p className="text-xs text-muted-foreground">
        Not sure where to start? Three quick questions.
      </p>
    </div>
  );
}

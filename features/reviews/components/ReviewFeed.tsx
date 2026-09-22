"use client";

import { cn } from "@/utils/cn";
import { ReviewFeedRow, type ReviewFeedItem } from "./ReviewFeedRow";

export type { ReviewFeedItem };

interface ReviewFeedProps {
  totalCount: number;
  items: ReviewFeedItem[];
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function ReviewFeed({
  totalCount,
  items,
  page,
  pageSize,
  onPageChange,
}: ReviewFeedProps) {
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <section className="rounded-3xl border border-border bg-background p-5 sm:p-8">
      <p className="text-lg font-semibold text-foreground">
        {totalCount} {totalCount === 1 ? "review" : "reviews"}
      </p>

      {items.length === 0 ? (
        <p className="mt-6 text-base text-muted-foreground">No reviews yet.</p>
      ) : (
        <ul className="mt-6 divide-y divide-border">
          {items.map((review, index) => (
            <ReviewFeedRow
              key={review.id}
              review={review}
              priority={index < 2}
            />
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <nav
          aria-label="Reviews pagination"
          className="mt-6 flex items-center justify-center gap-2"
        >
          {Array.from({ length: totalPages }, (_, index) => {
            const pageNumber = index + 1;
            const isActive = pageNumber === page;

            return (
              <button
                key={pageNumber}
                type="button"
                aria-current={isActive ? "page" : undefined}
                onClick={() => onPageChange(pageNumber)}
                className={cn(
                  "inline-flex size-9 items-center justify-center rounded-lg text-sm font-semibold transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-secondary",
                )}
              >
                {pageNumber}
              </button>
            );
          })}
        </nav>
      )}
    </section>
  );
}

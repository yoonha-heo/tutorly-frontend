"use client";

import { Star } from "lucide-react";
import Image from "next/image";

export type ReviewFeedItem = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  name: string;
  imageUrl: string | null;
};

export function ReviewFeedRow({
  review,
  priority,
}: {
  review: ReviewFeedItem;
  priority: boolean;
}) {
  return (
    <li className="py-6 first:pt-0 last:pb-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Image
            src={review.imageUrl ?? "/images/empty-profile.png"}
            alt={review.name}
            width={40}
            height={40}
            priority={priority}
            className="size-10 rounded-full object-cover"
          />
          <p className="truncate font-semibold text-foreground">{review.name}</p>
        </div>
        <time
          dateTime={review.createdAt}
          className="shrink-0 text-sm text-muted-foreground"
        >
          {formatReviewTime(review.createdAt)}
        </time>
      </div>

      <div className="mt-3 flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, index) => {
          const isFilled = index < review.rating;
          return (
            <Star
              key={index}
              className={
                isFilled
                  ? "size-4 fill-yellow-400 text-yellow-400"
                  : "size-4 text-muted-foreground/40"
              }
            />
          );
        })}
      </div>

      {review.comment && (
        <p className="mt-3 text-base leading-7 text-muted-foreground">
          {review.comment}
        </p>
      )}
    </li>
  );
}

function formatReviewTime(createdAt: string) {
  const diffMs = Date.now() - new Date(createdAt).getTime();
  const minutes = Math.max(0, Math.floor(diffMs / 60_000));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years >= 1) return years === 1 ? "1 year ago" : `${years} years ago`;
  if (months >= 1)
    return months === 1 ? "1 month ago" : `${months} months ago`;
  if (days >= 1) return days === 1 ? "1 day ago" : `${days} days ago`;
  if (hours >= 1) return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  if (minutes >= 1)
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  return "Just now";
}

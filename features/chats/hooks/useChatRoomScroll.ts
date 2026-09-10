import { useEffect, useLayoutEffect, useRef } from "react";

export function useChatRoomScroll({
  channelId,
  isListOpen,
  lastMessageId,
  pageCount,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: {
  channelId: string;
  isListOpen: boolean;
  lastMessageId?: string;
  pageCount: number;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => unknown;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const loadOlderRef = useRef<HTMLDivElement>(null);
  const pendingScrollHeightRef = useRef<number | null>(null);

  // WHY: restore scroll before paint so prepended older messages do not jump the viewport
  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    const savedHeight = pendingScrollHeightRef.current;
    if (!scroller || savedHeight == null) return;

    scroller.scrollTop = scroller.scrollHeight - savedHeight;
    pendingScrollHeightRef.current = null;
  }, [pageCount]);

  // WHY: pin after layout/rAF because the room can still be measuring after show/hide
  useLayoutEffect(() => {
    if (!lastMessageId || pendingScrollHeightRef.current != null) return;

    function pinToLatest() {
      const scroller = scrollerRef.current;
      if (!scroller) return;
      scroller.scrollTop = scroller.scrollHeight;
    }

    pinToLatest();
    const frame = requestAnimationFrame(pinToLatest);
    return () => cancelAnimationFrame(frame);
  }, [channelId, lastMessageId, isListOpen]);

  // WHY: IntersectionObserver fires when the top sentinel nears the scroller, not on every scroll
  useEffect(() => {
    const scroller = scrollerRef.current;
    const target = loadOlderRef.current;
    if (!scroller || !target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || !hasNextPage || isFetchingNextPage) {
          return;
        }

        pendingScrollHeightRef.current = scroller.scrollHeight;
        void fetchNextPage();
      },
      { root: scroller, rootMargin: "80px 0px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [channelId, fetchNextPage, hasNextPage, isFetchingNextPage, isListOpen]);

  return { scrollerRef, loadOlderRef };
}

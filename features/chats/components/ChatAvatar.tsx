import Image from "next/image";

export function ChatAvatar({
  src,
  alt,
  size,
}: {
  src: string;
  alt: string;
  size: "md" | "lg";
}) {
  const px = size === "lg" ? 44 : 40;

  return (
    <Image
      src={src}
      alt={alt}
      width={px}
      height={px}
      priority={true}
      className={`shrink-0 rounded-xl object-cover ${size === "lg" ? "size-11" : "size-10"}`}
    />
  );
}

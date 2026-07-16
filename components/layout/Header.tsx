"use client";

import { useMe } from "@/features/auth/hooks/useMe";
import {
  ChevronDown,
  GraduationCap,
  HelpCircle,
  Heart,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  Settings,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface ProfileMenuItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const MAIN_MENU_ITEMS: ProfileMenuItem[] = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "Messages",
    href: "/messages",
    icon: MessageSquare,
  },
  {
    label: "My lessons",
    href: "/lessons",
    icon: GraduationCap,
  },
  {
    label: "Saved tutors",
    href: "/saved-tutors",
    icon: Heart,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

const SECONDARY_MENU_ITEMS: ProfileMenuItem[] = [
  {
    label: "Find tutors",
    href: "/teachers",
    icon: Search,
  },
  {
    label: "Help",
    href: "/help",
    icon: HelpCircle,
  },
];

export default function Header() {
  const { data: me, isLoading } = useMe();

  const pathname = usePathname();
  const router = useRouter();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const desktopMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsProfileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isProfileMenuOpen) return;

    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsProfileMenuOpen(false);
      }
    }

    function handleOutsideClick(event: MouseEvent) {
      const target = event.target as Node;

      if (desktopMenuRef.current && !desktopMenuRef.current.contains(target)) {
        setIsProfileMenuOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscapeKey);
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isProfileMenuOpen]);

  useEffect(() => {
    if (!isProfileMenuOpen) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    if (!isMobile) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isProfileMenuOpen]);

  async function handleLogout() {
    setIsProfileMenuOpen(false);

    /*
     * TODO:
     * 현재 프로젝트의 logout mutation 또는 logout API로 교체.
     *
     * 예:
     * await logoutMutation.mutateAsync();
     */

    router.push("/login");
    router.refresh();
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-xl bg-primary">
                <GraduationCap className="size-5 text-primary-foreground" />
              </div>

              <span className="text-lg font-semibold text-foreground">
                Tutorly
              </span>
            </Link>

            <div className="ml-8 hidden gap-6 md:flex">
              <Link
                href="/teachers"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Find a tutor
              </Link>

              {!isLoading && !me && (
                <Link
                  href="/teachers/login"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Become a tutor
                </Link>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="h-9 w-24 animate-pulse rounded-xl bg-secondary" />
          ) : me ? (
            <div ref={desktopMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen((current) => !current)}
                aria-expanded={isProfileMenuOpen}
                aria-label="Open profile menu"
                className="flex items-center gap-2 rounded-xl p-1.5 transition-colors hover:bg-secondary"
              >
                <UserAvatar
                  name={me.name}
                  profileImage={me.profileImage}
                  size="small"
                />

                <span className="hidden max-w-32 truncate text-sm font-medium text-foreground sm:block">
                  {me.name}
                </span>

                <ChevronDown
                  className={`hidden size-4 text-muted-foreground transition-transform sm:block ${
                    isProfileMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isProfileMenuOpen && (
                <DesktopProfileMenu
                  name={me.name}
                  profileImage={me.profileImage}
                  pathname={pathname}
                  onLogout={handleLogout}
                />
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-xl px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              Login
            </Link>
          )}
        </nav>
      </header>

      {me && isProfileMenuOpen && (
        <MobileProfileMenu
          name={me.name}
          profileImage={me.profileImage}
          pathname={pathname}
          onClose={() => setIsProfileMenuOpen(false)}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}

interface DesktopProfileMenuProps {
  name: string | null;
  profileImage: string | null;
  pathname: string;
  onLogout: () => void;
}

function DesktopProfileMenu({
  name,
  profileImage,
  pathname,
  onLogout,
}: DesktopProfileMenuProps) {
  return (
    <div className="absolute right-0 top-full mt-3 hidden w-72 overflow-hidden rounded-2xl border border-border bg-background p-4 shadow-xl md:block">
      <ProfileMenuHeader name={name} profileImage={profileImage} />

      <div className="my-4 border-t border-border" />

      <nav className="space-y-1">
        {MAIN_MENU_ITEMS.map((item) => (
          <ProfileMenuLink
            key={item.href}
            item={item}
            isActive={isCurrentPath(pathname, item.href)}
          />
        ))}
      </nav>

      <div className="my-4 border-t border-border" />

      <nav className="space-y-1">
        {SECONDARY_MENU_ITEMS.map((item) => (
          <ProfileMenuLink
            key={item.href}
            item={item}
            isActive={isCurrentPath(pathname, item.href)}
          />
        ))}

        <LogoutButton onLogout={onLogout} />
      </nav>
    </div>
  );
}

interface MobileProfileMenuProps {
  name: string | null;
  profileImage: string | null;
  pathname: string;
  onClose: () => void;
  onLogout: () => void;
}

function MobileProfileMenu({
  name,
  profileImage,
  pathname,
  onClose,
  onLogout,
}: MobileProfileMenuProps) {
  return (
    <div className="fixed inset-0 z-[100] md:hidden">
      <button
        type="button"
        aria-label="Close profile menu"
        onClick={onClose}
        className="absolute inset-0 bg-black/35"
      />

      <aside className="absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col overflow-y-auto bg-background px-6 py-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <ProfileMenuHeader name={name} profileImage={profileImage} />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close profile menu"
            className="flex size-10 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-secondary"
          >
            <X className="size-6" />
          </button>
        </div>

        <div className="my-6 border-t border-border" />

        <nav className="space-y-1">
          {MAIN_MENU_ITEMS.map((item) => (
            <ProfileMenuLink
              key={item.href}
              item={item}
              isActive={isCurrentPath(pathname, item.href)}
              mobile
            />
          ))}
        </nav>

        <div className="my-6 border-t border-border" />

        <nav className="space-y-1">
          {SECONDARY_MENU_ITEMS.map((item) => (
            <ProfileMenuLink
              key={item.href}
              item={item}
              isActive={isCurrentPath(pathname, item.href)}
              mobile
            />
          ))}

          <LogoutButton onLogout={onLogout} mobile />
        </nav>
      </aside>
    </div>
  );
}

interface ProfileMenuHeaderProps {
  name: string | null;
  profileImage: string | null;
}

function ProfileMenuHeader({ name, profileImage }: ProfileMenuHeaderProps) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <UserAvatar name={name} profileImage={profileImage} size="large" />

      <p className="truncate text-lg font-semibold text-foreground">
        {name ?? "Tutorly user"}
      </p>
    </div>
  );
}

interface ProfileMenuLinkProps {
  item: ProfileMenuItem;
  isActive: boolean;
  mobile?: boolean;
}

function ProfileMenuLink({
  item,
  isActive,
  mobile = false,
}: ProfileMenuLinkProps) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 rounded-xl font-medium transition-colors ${
        mobile ? "px-4 py-3.5 text-base" : "px-3 py-2.5 text-sm"
      } ${
        isActive
          ? "bg-secondary text-foreground"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      }`}
    >
      <Icon className="size-5 shrink-0" />
      {item.label}
    </Link>
  );
}

interface LogoutButtonProps {
  onLogout: () => void;
  mobile?: boolean;
}

function LogoutButton({ onLogout, mobile = false }: LogoutButtonProps) {
  return (
    <button
      type="button"
      onClick={onLogout}
      className={`flex w-full items-center gap-3 rounded-xl font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground ${
        mobile ? "px-4 py-3.5 text-base" : "px-3 py-2.5 text-sm"
      }`}
    >
      <LogOut className="size-5 shrink-0" />
      Log out
    </button>
  );
}

interface UserAvatarProps {
  name: string | null;
  profileImage: string | null;
  size: "small" | "large";
}

function UserAvatar({ name, profileImage, size }: UserAvatarProps) {
  const sizeClass = size === "large" ? "size-12" : "size-8";

  if (profileImage) {
    return (
      <img
        src={profileImage}
        alt={name ?? "User"}
        className={`${sizeClass} shrink-0 rounded-xl object-cover`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} flex shrink-0 items-center justify-center rounded-xl bg-primary font-semibold text-primary-foreground`}
    >
      {name?.charAt(0).toUpperCase() ?? "U"}
    </div>
  );
}

function isCurrentPath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

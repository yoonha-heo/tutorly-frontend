"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  GraduationCap,
  Home,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  MessageCircle,
  X,
} from "lucide-react";

import { useMe } from "@/features/auth/hooks/useMe";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useChatList } from "@/features/chats/hooks/useChatList";
import type { UserRole } from "@/features/auth/types/auth.types";

export default function Header() {
  const { data: me, isLoading } = useMe();
  const logoutMutation = useLogout();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleClose = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur-md">
      <nav className="h-18 mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        {/* header left */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-xl bg-primary">
              <GraduationCap className="size-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">
              Tutorly
            </span>
          </Link>

          <div className="ml-8 hidden items-center gap-6 md:flex">
            {!isLoading && me?.role !== "TEACHER" && (
              <Link
                href="/teachers"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Find a tutor
              </Link>
            )}

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

        {/* header right */}
        <div>
          {isLoading ? (
            <div className="h-9 w-20 animate-pulse rounded-xl bg-secondary" />
          ) : !me ? (
            <Link
              href="/login"
              className="rounded-xl px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              Login
            </Link>
          ) : (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-xl p-1.5 transition-colors hover:bg-secondary"
              >
                <UserAvatar name={me.name} profileImage={me.profileImage} />
                <span className="hidden max-w-32 truncate text-sm font-medium text-foreground sm:block">
                  {me.name}
                </span>
                <ChevronDown
                  className={`hidden size-4 text-muted-foreground transition-transform sm:block ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Desktop Dropdown */}
              {isOpen && (
                <div className="absolute right-0 top-full mt-3 hidden w-72 overflow-hidden rounded-2xl border border-border bg-background p-4 shadow-xl md:block">
                  <ProfileHeader
                    name={me.name}
                    profileImage={me.profileImage}
                  />
                  <div className="my-4 border-t border-border" />
                  <NavLinks
                    pathname={pathname}
                    onClose={handleClose}
                    role={me.role}
                  />
                  <div className="my-4 border-t border-border" />
                  <LogoutButton
                    onLogout={() => {
                      handleClose();
                      logoutMutation.mutate();
                    }}
                  />
                </div>
              )}

              {/* Mobile Drawer */}
              {isOpen &&
                mounted &&
                createPortal(
                  <div className="fixed inset-0 z-[100] md:hidden">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="absolute inset-0 bg-black/35"
                    />
                    <aside className="absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col overflow-y-auto bg-background px-6 py-5 shadow-2xl">
                      <div className="flex items-center justify-between">
                        <ProfileHeader
                          name={me.name}
                          profileImage={me.profileImage}
                        />
                        <button
                          type="button"
                          onClick={handleClose}
                          className="flex size-10 items-center justify-center rounded-xl transition-colors hover:bg-secondary"
                        >
                          <X className="size-6" />
                        </button>
                      </div>
                      <div className="my-6 border-t border-border" />
                      <NavLinks
                        pathname={pathname}
                        onClose={handleClose}
                        role={me.role}
                        mobile
                      />
                      <div className="my-6 border-t border-border" />
                      <LogoutButton
                        onLogout={() => {
                          handleClose();
                          logoutMutation.mutate();
                        }}
                        mobile
                      />
                    </aside>
                  </div>,
                  document.body,
                )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

/* helper components */

function NavLinks({
  pathname,
  onClose,
  role,
  mobile = false,
}: {
  pathname: string;
  onClose: () => void;
  role: UserRole;
  mobile?: boolean;
}) {
  const items =
    role === "TEACHER"
      ? [
          {
            label: "Dashboard",
            href: "/teachers/dashboard",
            icon: LayoutDashboard,
          },
          { label: "Messages", href: "/chats", icon: MessageCircle },
        ]
      : [
          { label: "Home", href: "/", icon: Home },
          { label: "My lessons", href: "/lessons", icon: GraduationCap },
          { label: "Messages", href: "/chats", icon: MessageCircle },
        ];

  const { data: chats } = useChatList();
  const hasUnread = (chats?.items ?? []).some((item) => item.unreadCount > 0);

  return (
    <nav className="space-y-1">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href ||
          (item.href !== "/" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={`flex items-center gap-3 rounded-xl font-medium transition-colors ${
              mobile ? "px-4 py-3.5 text-base" : "px-3 py-2.5 text-sm"
            } ${isActive ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
          >
            <Icon className="size-5 shrink-0" />
            <span className="relative">
              {item.label}
              {item.href === "/chats" && hasUnread && (
                <span className="absolute top-1 -right-2.5 size-[5px] rounded-full bg-green-500" />
              )}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

function LogoutButton({
  onLogout,
  mobile = false,
}: {
  onLogout: () => void;
  mobile?: boolean;
}) {
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

function ProfileHeader({
  name,
  profileImage,
}: {
  name: string | null;
  profileImage: string | null;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <UserAvatar name={name} profileImage={profileImage} />
      <p className="truncate text-lg font-semibold text-foreground">
        {name ?? "Tutorly user"}
      </p>
    </div>
  );
}

function UserAvatar({
  name,
  profileImage,
}: {
  name: string | null;
  profileImage: string | null;
}) {
  return (
    <Image
      src={profileImage ?? "/images/empty-profile.png"}
      alt={name ?? "User profile"}
      width={32}
      height={32}
      className="size-8 shrink-0 rounded-xl object-cover"
      priority
    />
  );
}

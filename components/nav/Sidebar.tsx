"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarNav, NavItem } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { ChevronDown, MessageSquare } from "lucide-react";
import * as Collapsible from "@radix-ui/react-collapsible";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-dvh w-full lg:w-[260px] border-r border-zinc-800 bg-black/60 backdrop-blur sticky top-0">
      <div className="flex h-14 items-center px-4 border-b border-zinc-800">
        <Link href="/dashboard" className="font-semibold tracking-tight">
          <span className="text-xl">trainly</span>
        </Link>
      </div>

      <nav className="p-2">
        <ul className="space-y-1">
          {sidebarNav.map((item) =>
            item.items?.length ? (
              <li key={item.title}>
                <Collapsible.Root defaultOpen={pathname.startsWith(item.href)}>
                  <Collapsible.Trigger className="w-full">
                    <Row
                      href={item.href}
                      title={item.title}
                      icon={item.icon}
                      active={pathname.startsWith(item.href)}
                      trailing={<ChevronDown className="h-4 w-4 opacity-60" />}
                    />
                  </Collapsible.Trigger>
                  <Collapsible.Content>
                    <ul className="mt-1 pl-9 space-y-1">
                      {item.items.map((sub) => (
                        <li key={sub.href}>
                          <Row
                            href={sub.href}
                            title={sub.title}
                            active={pathname === sub.href}
                          />
                        </li>
                      ))}
                    </ul>
                  </Collapsible.Content>
                </Collapsible.Root>
              </li>
            ) : (
              <li key={item.title}>
                <Row
                  href={item.href}
                  title={item.title}
                  icon={item.icon}
                  active={pathname === item.href}
                />
              </li>
            )
          )}
        </ul>
      </nav>

      <div className="absolute bottom-0 inset-x-0 p-3 border-t border-zinc-800 bg-black/70">
        <Link
          href="/coach"
          className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium bg-zinc-100 text-zinc-900 hover:bg-zinc-200 transition"
        >
          <MessageSquare className="h-4 w-4" />
          Ask Coach
        </Link>
      </div>
    </aside>
  );
}

function Row({
  href,
  title,
  icon: Icon,
  active,
  trailing,
}: {
  href: string;
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  active?: boolean;
  trailing?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center justify-between rounded-lg px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500",
        active
          ? "bg-zinc-100/10 text-white"
          : "text-zinc-300 hover:text-white hover:bg-zinc-100/5"
      )}
    >
      <span className="flex items-center gap-2">
        {Icon ? <Icon className="h-4 w-4 opacity-80" /> : null}
        {title}
      </span>
      {trailing}
    </Link>
  );
}


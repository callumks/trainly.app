"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { PanelLeft } from "lucide-react";

import { cn } from "./utils";

function Sidebar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar"
      className={cn(
        "w-64 shrink-0 border-r bg-card p-4",
        className
      )}
      {...props}
    />
  )
}

export { Sidebar }

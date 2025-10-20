"use client";

import * as React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";

export const HoverCard = HoverCardPrimitive.Root
export const HoverCardTrigger = HoverCardPrimitive.Trigger
export const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <HoverCardPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={"z-50 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none" + (className ? ` ${className}` : '')}
    {...props}
  />
))
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName

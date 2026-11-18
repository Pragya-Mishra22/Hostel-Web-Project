import {
  LayoutDashboard,
  BedDouble,
  Wallet,
  MessageSquareWarning,
  CalendarClock,
  ClipboardCheck,
  Users,
  DoorOpen,
  Home,
  Building2,
  ShieldAlert,
  LogIn,
} from "lucide-react";

/**
 * A Server Component can't pass a component reference (a function) as a
 * prop into a Client Component — only serializable data and already-built
 * elements cross that boundary. Nav/dock item lists are often built in a
 * server layout, so we pass a plain string key here instead and look the
 * icon up inside the client component that actually renders it.
 */
export const ICONS = {
  LayoutDashboard,
  BedDouble,
  Wallet,
  MessageSquareWarning,
  CalendarClock,
  ClipboardCheck,
  Users,
  DoorOpen,
  Home,
  Building2,
  ShieldAlert,
  LogIn,
} as const;

export type IconName = keyof typeof ICONS;

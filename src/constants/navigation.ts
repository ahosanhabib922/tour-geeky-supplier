import {
  LayoutDashboard,
  Box,
  ClipboardList,
  Calendar,
  Users,
  UserCheck,
  Wallet,
  BarChart3,
  Ticket,
  Percent,
  Archive,
  History,
  CheckCircle2,
  BookOpen,
} from "lucide-react";

export const NAV_ITEMS = [
  {
    label: "Main Menu",
    items: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/",
      },
      {
        label: "Product Management",
        icon: Box,
        href: "/products",
        children: [
          { label: "Create own product", href: "/products/create", icon: CheckCircle2 },
          { label: "Our Products", href: "/products/list", icon: History },
          { label: "Affiliate Products", href: "/products/affiliate", icon: History },
          { label: "Availability", href: "/products/availability", icon: History },
          { label: "Archive Products", href: "/products/archive", icon: Archive },
          { label: "Make Special offer", href: "/products/special-offer", icon: Percent },
        ],
      },
      {
        label: "Orders Management",
        icon: ClipboardList,
        href: "/orders",
        children: [
          { label: "All Orders", href: "/orders/list", icon: History },
          { label: "Scan Tickets", href: "/orders/scan", icon: Ticket },
        ],
      },
      {
        label: "Calendar",
        icon: Calendar,
        href: "/calendar",
      },
      {
        label: "Customers",
        icon: Users,
        href: "/customers",
      },
      {
        label: "Suppliers",
        icon: UserCheck,
        href: "/suppliers",
      },
      {
        label: "Finance & Invoicing",
        icon: Wallet,
        href: "/finance",
      },
      {
        label: "Reports",
        icon: BarChart3,
        href: "/reports",
      },
      {
        label: "Site Settings",
        icon: LayoutDashboard,
        href: "/settings",
      },
      {
        label: "Pages CMS",
        icon: ClipboardList,
        href: "/pages",
      },
      {
        label: "Blogs",
        icon: BookOpen,
        href: "/blogs",
      },
    ],
  },
];



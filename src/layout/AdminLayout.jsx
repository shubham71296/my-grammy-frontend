import React, { Suspense } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import PageSpinner from "../components/ui/loader/PageSpinner";
import {
  Menu,
  LayoutDashboard,
  Library,
  List,
  BookOpen,
  Users,
  ShoppingBag,
  LogOut,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import WebsiteLogoImage from "../assets/grammy-icon1.jpg";
import AppDialog from "../components/ui/dialog/AppDialog";
import { Drawer } from "../components/ui/tw/Drawer";
import { Dropdown, DropdownItem } from "../components/ui/tw/Dropdown";
import { cn } from "../lib/cn";

const DRAWER_WIDTH = 260;

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, route: "/admin" },
  { title: "Add Instruments", icon: Library, route: "/admin/addinstruments" },
  { title: "Create Courses", icon: BookOpen, route: "/admin/createcourse" },
  {
    title: "Instruments List",
    icon: List,
    route: "/admin/myinstrumentslist",
  },
  { title: "Courses List", icon: BookOpen, route: "/admin/mycourseslist" },
  { title: "Users", icon: Users, route: "/admin/allusers" },
  { title: "Orders", icon: ShoppingBag, route: "/admin/allorders" },
];

function SidebarNav({ onNavigate }) {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedRoute = location.pathname;

  const isItemSelected = (item) => {
    const itemPath = item.route?.startsWith("/")
      ? item.route
      : `/admin${item.route ? `/${item.route}` : ""}`;

    if (itemPath === "/admin") {
      return (
        selectedRoute === "/admin" || selectedRoute === "/admin/dashboard"
      );
    }
    return (
      selectedRoute === itemPath || selectedRoute.startsWith(`${itemPath}/`)
    );
  };

  return (
    <nav className="flex min-h-0 flex-1 flex-col overflow-y-auto p-2.5 sm:p-3">
      <ul className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const selected = isItemSelected(item);
          return (
            <li key={item.route}>
              <button
                type="button"
                onClick={() => {
                  navigate(item.route);
                  onNavigate?.();
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition sm:gap-3 sm:px-4",
                  selected
                    ? "bg-white text-brand-900 shadow-sm"
                    : "text-white/85 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" />
                {item.title}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function SidebarContent({ onNavigate }) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-brand-900 text-white">
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3.5 sm:py-4">
        <img
          src={WebsiteLogoImage}
          alt="Musically"
          className="h-12 w-12 rounded-2xl object-cover shadow-sm ring-2 ring-white/20"
        />
        <div>
          <p className="text-lg font-bold leading-tight">Grammy</p>
          <p className="text-xs text-white/80">Admin Panel</p>
        </div>
      </div>

      <SidebarNav onNavigate={onNavigate} />

      <div className="mt-auto border-t border-white/10 p-3 sm:p-4">
        <div className="flex justify-between text-xs text-white/70">
          <span>© {new Date().getFullYear()} Musically</span>
          <span>v1.2</span>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => setMobileOpen((s) => !s);
  const closeMobile = () => setMobileOpen(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="flex min-h-screen">
      <header
        className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-brand-900 shadow-[0_4px_30px_rgba(2,2,94,0.22)] md:left-[260px] md:w-[calc(100%-260px)]"
      >
        <div className="flex h-14 items-center gap-2.5 px-3 sm:gap-3 sm:px-4">
          <button
            type="button"
            className="rounded-lg p-2 text-white md:hidden"
            onClick={handleDrawerToggle}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <div className="flex-1" />

          <p className="hidden max-w-[180px] truncate text-sm text-white/90 sm:block">
            {user?.em}
          </p>

          <Dropdown
            align="right"
            trigger={
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white transition hover:scale-105 hover:bg-white/30"
                aria-label="Profile menu"
              >
                {user?.em?.[0]?.toUpperCase() || "A"}
              </button>
            }
          >
            {(close) => (
              <DropdownItem
                danger
                onClick={() => {
                  close();
                  handleLogout();
                }}
              >
                <LogOut size={16} />
                Logout
              </DropdownItem>
            )}
          </Dropdown>
        </div>
      </header>

      <aside
        className="fixed bottom-0 left-0 top-0 z-30 hidden w-[260px] flex-col border-r-2 border-white/25 bg-brand-900 md:flex"
        style={{ width: DRAWER_WIDTH }}
        aria-label="Admin navigation"
      >
        <SidebarContent />
      </aside>

      <Drawer
        open={mobileOpen}
        onClose={closeMobile}
        className="w-[min(100vw-3rem,260px)] border-r-2 border-white/25 bg-brand-900 text-white"
      >
        <SidebarContent onNavigate={closeMobile} />
      </Drawer>

      <main className="page-gradient min-w-0 max-w-full flex-1 overflow-x-hidden pt-14 md:ml-[260px] md:w-[calc(100%-260px)]">
        <div className="min-w-0 max-w-full p-3 sm:p-5 md:p-6 xl:p-8">
          <Suspense fallback={<PageSpinner />}>
            <Outlet />
          </Suspense>
        </div>
      </main>

      <AppDialog />
    </div>
  );
}

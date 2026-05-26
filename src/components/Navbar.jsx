import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Music,
  GraduationCap,
  ShoppingCart,
  ShoppingBag,
  Menu,
  X,
  LogOut,
  User,
  ChevronDown,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import WebsiteLogoImage from "../assets/grammy-icon1.jpg";
import { logout } from "../features/auth/authSlice";
import { Drawer } from "./ui/tw/Drawer";
import { Dropdown, DropdownItem } from "./ui/tw/Dropdown";
import { cn } from "../lib/cn";
import { prefetchRoute, prefetchUserNavRoutes } from "../routes/routePrefetch";
import { useNavProgress } from "../context/NavProgressContext";

/** While navigating, only the clicked item is active (not the previous route). */
function isNavActive(isActive, pendingPath, path) {
  if (pendingPath) return pendingPath === path;
  return isActive;
}

const menuItems = [
  { id: "Home", label: "Home", icon: Home, to: "/user", end: true },
  { id: "Instruments", label: "Instruments", icon: Music, to: "/user/instruments" },
  { id: "Courses", label: "Courses", icon: GraduationCap, to: "/user/courses" },
  { id: "Cart", label: "Cart", icon: ShoppingCart, to: "/user/cart" },
  { id: "MyOrder", label: "My Orders", icon: ShoppingBag, to: "/user/myorders" },
];

function NavLinkItem({ item, cartCount, onNavigate, compact, pendingPath, onPrefetch }) {
  const Icon = item.icon;
  const isCart = item.id === "Cart";

  const handleIntent = () => {
    onPrefetch?.(item.to);
  };

  const handleClick = () => {
    onNavigate?.(item.to);
  };

  return (
    <NavLink
      to={item.to}
      end={item.end}
      onMouseEnter={handleIntent}
      onFocus={handleIntent}
      onTouchStart={handleIntent}
      onClick={handleClick}
      className={({ isActive }) => {
        const active = isNavActive(isActive, pendingPath, item.to);
        return cn(
          "group relative flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-200 ease-out",
          compact
            ? active
              ? "bg-brand-100 text-brand-900 shadow-sm ring-1 ring-brand-200/70"
              : "text-slate-700 hover:-translate-y-0.5 hover:bg-brand-50 hover:text-brand-800 active:translate-y-0 active:bg-brand-100"
            : active
              ? "bg-white text-brand-900 shadow-md shadow-black/10"
              : "text-white/90 hover:bg-white/12 hover:text-white active:bg-white/20"
        );
      }}
    >
      <span className={cn(
        "relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-200",
        compact ? "bg-slate-100 text-slate-600 group-hover:bg-white group-hover:text-brand-700" : ""
      )}>
        <Icon size={18} strokeWidth={2.25} />
        {isCart && cartCount > 0 && !compact && (
          <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-0.5 text-[10px] font-bold text-white ring-2 ring-brand-900/90">
            {cartCount > 9 ? "9+" : cartCount}
          </span>
        )}
      </span>
      <span className={cn(compact ? "inline" : "hidden xl:inline")}>{item.label}</span>
      {isCart && cartCount > 0 && compact && (
        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
          {cartCount > 9 ? "9+" : cartCount}
        </span>
      )}
    </NavLink>
  );
}

export default function Navbar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { count } = useSelector((state) => state.cart);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pendingPath, setPendingPath] = useState(null);
  const { startNav } = useNavProgress();
  const navigate = useNavigate();

  useEffect(() => {
    prefetchUserNavRoutes();
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
    setPendingPath(null);
  }, [location.pathname]);

  const handleNavIntent = (path) => prefetchRoute(path);

  const handleNavClick = (path) => {
    startNav();
    setPendingPath(path);
    setDrawerOpen(false);
  };

  const displayName = user?.em?.split("@")[0] || "User";
  const initial = user?.em?.[0]?.toUpperCase() || "U";

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-brand-900 shadow-[0_4px_30px_rgba(2,2,94,0.22)]">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-2.5 px-3 sm:gap-4 sm:px-4 lg:h-[4.25rem] lg:px-6">
          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white transition hover:bg-white/20 md:hidden"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} strokeWidth={2.25} />
          </button>

          <NavLink
            to="/user"
            end
            onMouseEnter={() => handleNavIntent("/user")}
            onClick={() => handleNavClick("/user")}
            className={({ isActive }) =>
              cn(
                "group flex min-w-0 shrink-0 items-center gap-2 rounded-2xl py-1 pr-1.5 hover:bg-white/5 sm:gap-3 sm:pr-2",
                isNavActive(isActive, pendingPath, "/user") && "bg-white/10"
              )
            }
          >
            <img
              src={WebsiteLogoImage}
              alt="Grammy Music"
              className="h-10 w-10 rounded-xl object-cover shadow-lg ring-2 ring-white/25 transition group-hover:ring-white/40 sm:h-11 sm:w-11"
            />
            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-sm font-bold tracking-tight text-white">Grammy</p>
              <p className="text-[11px] font-medium text-white/55">Music Academy</p>
            </div>
          </NavLink>

          <nav className="hidden flex-1 items-center justify-center md:flex">
            <div className="flex items-center gap-0.5 rounded-2xl border border-white/10 bg-white/[0.06] p-1 backdrop-blur-sm">
              {menuItems.map((item) => (
                <NavLinkItem
                  key={item.id}
                  item={item}
                  cartCount={count}
                  pendingPath={pendingPath}
                  onPrefetch={handleNavIntent}
                  onNavigate={handleNavClick}
                />
              ))}
            </div>
          </nav>

          <div className="ml-auto flex min-w-0 shrink-0 items-center gap-1.5 sm:gap-3">
            <NavLink
              to="/user/cart"
              onMouseEnter={() => handleNavIntent("/user/cart")}
              onClick={() => handleNavClick("/user/cart")}
              className={({ isActive }) =>
                cn(
                  "relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white hover:bg-white/20 md:hidden",
                  isNavActive(isActive, pendingPath, "/user/cart") && "bg-white text-brand-900"
                )
              }
              aria-label="Cart"
            >
              <ShoppingCart size={20} strokeWidth={2.25} />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white ring-2 ring-brand-900">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </NavLink>

            <Dropdown
              align="right"
              trigger={
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 py-1.5 pl-3 pr-1.5 transition hover:bg-white/15"
                >
                  <span className="hidden max-w-[120px] truncate text-sm font-semibold text-white/95 sm:block lg:max-w-[160px]">
                    {displayName}
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-sm font-bold text-white shadow-inner">
                    {initial}
                  </span>
                  <ChevronDown size={16} className="hidden text-white/60 sm:block" />
                </button>
              }
            >
              {(close) => (
                <>
                  <div className="border-b border-slate-100 px-3 py-2.5">
                    <p className="truncate text-sm font-semibold text-navy">{user?.em}</p>
                    <p className="text-xs text-muted">Signed in</p>
                  </div>
                  <DropdownItem
                    onClick={() => {
                      close();
                      handleNavIntent("/user/userprofile");
                      handleNavClick("/user/userprofile");
                      navigate("/user/userprofile");
                    }}
                  >
                    <User size={16} /> My Profile
                  </DropdownItem>
                  <DropdownItem
                    danger
                    onClick={() => {
                      close();
                      dispatch(logout());
                    }}
                  >
                    <LogOut size={16} /> Logout
                  </DropdownItem>
                </>
              )}
            </Dropdown>
          </div>
        </div>
      </header>

      <div className="h-16 lg:h-[4.25rem]" aria-hidden />

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <div className="relative flex min-h-full flex-col overflow-hidden bg-white">
          <div className="relative overflow-hidden bg-brand-900 px-4 pb-5 pt-4 text-white">
            <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-14 left-6 h-28 w-28 rounded-full bg-brand-600/30 blur-2xl" />
            <div className="relative flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
              <img
                src={WebsiteLogoImage}
                alt=""
                className="h-12 w-12 shrink-0 rounded-2xl object-cover shadow-lg ring-2 ring-white/30"
              />
              <div className="min-w-0">
                <p className="truncate text-lg font-bold leading-tight">Grammy</p>
                <p className="text-xs text-white/70">Instruments & courses</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15 transition-all duration-200 hover:rotate-90 hover:bg-white/25"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>
            <p className="relative mt-3 truncate rounded-xl bg-white/10 px-3 py-2 text-xs font-medium text-white/85 ring-1 ring-white/10">
              {user?.em}
            </p>
          </div>
        <nav className="flex flex-col gap-1.5 p-3 pt-4">
          {menuItems.map((item) => (
            <NavLinkItem
              key={item.id}
              item={item}
              cartCount={count}
              pendingPath={pendingPath}
              onPrefetch={handleNavIntent}
              onNavigate={handleNavClick}
              compact
            />
          ))}
        </nav>
        <div className="mt-auto border-t border-slate-200 bg-slate-50/80 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-white py-2.5 text-sm font-bold text-danger shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-50 hover:shadow-md active:translate-y-0"
            onClick={() => {
              setDrawerOpen(false);
              dispatch(logout());
            }}
          >
            <LogOut size={18} /> Sign out
          </button>
        </div>
        </div>
      </Drawer>
    </>
  );
}

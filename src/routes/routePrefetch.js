/** Preload lazy route chunks for faster navbar navigation */
const USER_ROUTE_LOADERS = {
  "/user": () => import("../pages/user/Home"),
  "/user/instruments": () => import("../pages/user/Instruments"),
  "/user/courses": () => import("../pages/user/Courses"),
  "/user/cart": () => import("../pages/user/Cart"),
  "/user/myorders": () => import("../pages/user/MyOrders"),
  "/user/userprofile": () => import("../pages/user/UserProfile"),
};

const prefetched = new Set();

export function prefetchRoute(path) {
  const loader = USER_ROUTE_LOADERS[path];
  if (!loader || prefetched.has(path)) return;
  prefetched.add(path);
  loader();
}

export function prefetchUserNavRoutes() {
  Object.keys(USER_ROUTE_LOADERS).forEach(prefetchRoute);
}

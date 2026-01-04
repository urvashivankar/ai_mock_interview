import { clerkMiddleware ,createRouteMatcher} from "@clerk/nextjs/server";


const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/forum(.*)',
]);

/*
export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});
*/
export default function middleware() {
  return;
}
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
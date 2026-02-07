export { auth as middleware } from "@/auth";

export const config = {
  matcher: ["/chat/:path*", "/journal/:path*", "/api/((?!auth).*)"],
};

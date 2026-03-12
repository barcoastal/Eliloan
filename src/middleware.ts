export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/admin/dashboard/:path*", "/admin/applications/:path*", "/admin/settings/:path*"],
};

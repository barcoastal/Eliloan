import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#f8f8f6]">
      <AdminSidebar userName={session.user?.name || session.user?.email || "Admin"} />
      <main className="flex-1 p-6 overflow-auto ml-[220px] transition-all duration-200">{children}</main>
    </div>
  );
}

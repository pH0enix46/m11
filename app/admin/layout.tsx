import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const isAdmin = user?.role === "admin" || user?.role === "Admin";

  if (!user || !isAdmin) {
    redirect("/login");
  }

  return <div className="admin-root">{children}</div>;
}

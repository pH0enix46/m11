import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black">
      <AdminSidebar />
      <div className="md:ml-64 min-h-screen flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-6 overflow-x-hidden">
          <div className="max-w-8xl mx-auto space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

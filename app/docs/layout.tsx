import Sidebar from "@/app/components/docs/Sidebar";
import MobileSidebar from "@/app/components/docs/MobileSidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex">
        <Sidebar />
        <main className="min-w-0 flex-1 py-10 lg:pl-8 lg:border-l lg:border-border">
          <div className="max-w-3xl">
            <MobileSidebar />
            <article className="docs-content mt-6 lg:mt-0">{children}</article>
          </div>
        </main>
      </div>
    </div>
  );
}

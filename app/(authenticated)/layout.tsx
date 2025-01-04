import UserNavigationBar from "@/components/custom/(user-side)/UserNavigationBar";

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <UserNavigationBar />

      {children}
    </div>
  );
}

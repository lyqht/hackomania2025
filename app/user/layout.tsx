import UserNavigationBar from "@/components/custom/NavigationBar/UserNavigationBar";
import React from "react";
export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <UserNavigationBar />
      {children}
    </div>
  );
}

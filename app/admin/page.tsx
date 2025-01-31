import AdminClient from "@/components/custom/admin/AdminClient";
import { getUser } from "@/utils/supabase/user";
import { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const supabaseUser = (await getUser()) as User;
  if (!supabaseUser || supabaseUser.role !== "admin") {
    redirect("/");
  }

  return <AdminClient />;
}

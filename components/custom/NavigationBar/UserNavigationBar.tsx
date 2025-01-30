"use client";
import styles from "./NavigationBar.module.css";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";

export default function UserNavigationBar() {
  const supabaseClient = createClient();
  const router = useRouter();

  async function handleLogout() {
    await supabaseClient.auth.signOut();
    router.push("/");
  }

  return (
    <div className={`w-screen ${styles.grid} pb-10`}>
      <div className="m-2 bg-hackomania-red p-5 md:mx-20 md:my-10">
        <nav className="hidden flex-row justify-start gap-3 text-white md:flex" id="full-nav">
          <Link className="flex cursor-pointer flex-row items-center gap-2 px-3 py-1" href="/">
            <FaArrowLeft />
            <span>Back to Landing Page</span>
          </Link>
          <button className="ml-auto cursor-pointer px-3 py-1" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </div>
    </div>
  );
}

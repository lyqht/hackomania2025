import { syncPreEventRegistrations } from "@/app/services/eventbrite";
import { getAllUsers } from "@/app/services/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getUser } from "@/utils/supabase/user";
import { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { uploadFile } from "./actions";

const ITEMS_PER_PAGE = 10;

interface UserTableProps {
  users: Awaited<ReturnType<typeof getAllUsers>>;
  currentPage: number;
}

function UserTable({ users, currentPage }: UserTableProps) {
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const displayedUsers = users.slice(startIndex, endIndex);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>GitHub Username</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Team</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Pre-event</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {displayedUsers.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.githubUsername}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.teamName || "No team"}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell className={user.preEventRegistered ? "text-green-600" : "text-red-600"}>
              {user.preEventRegistered ? "✓" : "✗"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
  const createPageURL = (pageNumber: number) => {
    return `?page=${pageNumber}`;
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <a href={currentPage > 1 ? createPageURL(currentPage - 1) : "#"}>
        <Button variant="outline" disabled={currentPage === 1}>
          Previous
        </Button>
      </a>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <a href={currentPage < totalPages ? createPageURL(currentPage + 1) : "#"}>
        <Button variant="outline" disabled={currentPage === totalPages}>
          Next
        </Button>
      </a>
    </div>
  );
}

export default async function AdminPortal({
  searchParams,
}: {
  searchParams: { page?: string; sync?: string };
}) {
  const supabaseUser = (await getUser()) as User;
  const users = await getAllUsers();

  // Check if the user is an admin
  const currentUser = users.find((u) => u.id === supabaseUser.id);
  if (!currentUser || currentUser.role !== "admin") {
    redirect("/");
  }

  // Handle sync action
  if (searchParams.sync === "true") {
    await syncPreEventRegistrations();
    redirect("/admin");
  }

  const currentPage = Number(searchParams.page) || 1;
  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col gap-8 p-5 md:p-20">
      <div>
        <h1 className="mb-4 text-2xl font-bold md:text-4xl">HackOMania 2025 Admin Portal</h1>
        <div className="flex flex-col gap-4">
          <form action={uploadFile}>
            <div className="flex items-center gap-2">
              <span>Main Event Registrations</span>
              <Input type="file" name="file" accept=".xlsx,.xls,.csv" className="max-w-xs" />
              <Button type="submit" variant="outline">
                Upload CSV
              </Button>
            </div>
          </form>
          <form action="/admin">
            <div className="flex items-center gap-2">
              <span>Pre-event Registrations</span>
              <input type="hidden" name="sync" value="true" />
              <Button type="submit" variant="outline">
                Sync from Eventbrite
              </Button>
            </div>
          </form>
        </div>
      </div>

      <div className="rounded-lg border border-neutral-400 p-4">
        <h2 className="mb-4 text-xl font-semibold">Users</h2>
        <Suspense fallback={<div>Loading users...</div>}>
          <UserTable users={users} currentPage={currentPage} />
          <div className="mt-4">
            <Pagination totalPages={totalPages} currentPage={currentPage} />
          </div>
        </Suspense>
      </div>
    </div>
  );
}

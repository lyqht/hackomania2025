"use client";

import { UserInfo } from "@/app/services/user";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, Loader2, Search, UserPlus, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ExportUsersAsExcelButton } from "./ExportUsersAsExcelButton";
import { UserActions } from "./UserActions";

const ITEMS_PER_PAGE = 10;

export type SearchType = "username" | "email" | "team" | "name";
const SEARCH_TYPE_LABELS: Record<SearchType, string> = {
  username: "GitHub Username",
  email: "Email",
  team: "Team",
  name: "Name",
};

interface UserTableProps {
  users: UserInfo[];
  onSetTeamLeader: (userId: string) => Promise<void>;
  onRemoveUser: (userId: string) => Promise<void>;
  onEditUser: (userId: string, data: Partial<UserInfo>) => Promise<void>;
  onNavigateToTeam: (teamName: string) => void;
}

function UserTable({
  users,
  onSetTeamLeader,
  onRemoveUser,
  onEditUser,
  onNavigateToTeam,
}: UserTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>GitHub Username</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Team</TableHead>
          <TableHead>Pre-event</TableHead>
          <TableHead>Main Event</TableHead>
          <TableHead className="w-[50px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={`${user.id}-${user.teamId || "no-team"}`}>
            <TableCell>
              {user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : "Not provided"}
            </TableCell>
            <TableCell>{user.githubUsername}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              {user.teamName ? (
                <button
                  onClick={() => onNavigateToTeam(user.teamName!)}
                  className="text-blue-600 hover:underline"
                >
                  {user.teamName}
                </button>
              ) : (
                "No team"
              )}
            </TableCell>
            <TableCell className={user.preEventRegistered ? "text-green-600" : "text-red-600"}>
              {user.preEventRegistered ? "✓" : "✗"}
            </TableCell>
            <TableCell className={user.mainEventRegistered ? "text-green-600" : "text-red-600"}>
              {user.mainEventRegistered ? "✓" : "✗"}
            </TableCell>
            <TableCell>
              <UserActions
                user={user}
                onSetTeamLeader={onSetTeamLeader}
                onRemoveUser={onRemoveUser}
                onEditUser={onEditUser}
              />
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
  onPageChange: (page: number) => void;
}

function Pagination({ totalPages, currentPage, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </Button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
}

const createUserSchema = z.object({
  email: z.string().email(),
  githubUsername: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(["participant", "admin"]).default("participant"),
});

interface CreateUserDialogProps {
  users: UserInfo[];
  onCreateUser: (data: z.infer<typeof createUserSchema>) => Promise<void>;
}

function CreateUserDialog({ users, onCreateUser }: CreateUserDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof createUserSchema>>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      role: "participant",
    },
  });

  const onSubmit = async (data: z.infer<typeof createUserSchema>) => {
    const existingUser = users.find(
      (user) => user.githubUsername.toLowerCase() === data.githubUsername.toLowerCase(),
    );

    if (existingUser) {
      form.setError("githubUsername", {
        type: "manual",
        message: "This GitHub username already exists",
      });
      return;
    }

    await onCreateUser(data);
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Participants will be automatically registered for the main event.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="githubUsername"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="participant">Participant</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Create User</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

interface UserManagementProps {
  users: UserInfo[];
  isLoading: boolean;
  isUploading: boolean;
  isSyncing: boolean;
  searchType: SearchType;
  searchQuery: string;
  onSearchTypeChange: (type: SearchType) => void;
  onSearchQueryChange: (query: string) => void;
  onUploadFile: (formData: FormData) => Promise<void>;
  onSyncEventbrite: () => Promise<void>;
  onSetTeamLeader: (userId: string) => Promise<void>;
  onRemoveUser: (userId: string) => Promise<void>;
  onEditUser: (userId: string, data: Partial<UserInfo>) => Promise<void>;
  onNavigateToTeam: (teamName: string) => void;
  onCreateUser: (data: z.infer<typeof createUserSchema>) => Promise<void>;
}

export default function UserManagement({
  users,
  isLoading,
  isUploading,
  // isSyncing,
  searchType,
  searchQuery,
  onSearchTypeChange,
  onSearchQueryChange,
  onUploadFile,
  // onSyncEventbrite,
  onSetTeamLeader,
  onRemoveUser,
  onEditUser,
  onNavigateToTeam,
  onCreateUser,
}: UserManagementProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchOpen, setSearchOpen] = useState(false);
  const [hideUnregisteredUsers, setHideUnregisteredUsers] = useState(false);
  const [hideUsersWithTeams, setHideUsersWithTeams] = useState(false);

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    if (!searchQuery && !hideUnregisteredUsers && !hideUsersWithTeams) return users;

    return users.filter((user) => {
      // Apply main event registration filter
      if (hideUnregisteredUsers && !user.mainEventRegistered) {
        return false;
      }

      // Apply team filter
      if (hideUsersWithTeams && user.teamName) {
        return false;
      }

      // Apply search filter
      if (!searchQuery) return true;

      const query = searchQuery.toLowerCase();
      const fullName = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();

      switch (searchType) {
        case "username":
          return user.githubUsername.toLowerCase().includes(query);
        case "email":
          return user.email.toLowerCase().includes(query);
        case "team":
          return user.teamName?.toLowerCase().includes(query);
        case "name":
          return (
            fullName.includes(query) ||
            (user.firstName?.toLowerCase() || "").includes(query) ||
            (user.lastName?.toLowerCase() || "").includes(query)
          );
        default:
          return true;
      }
    });
  }, [users, searchQuery, searchType, hideUnregisteredUsers, hideUsersWithTeams]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const displayedUsers = filteredUsers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Get unique teams for team search
  const uniqueTeams = useMemo(() => {
    const teams = new Set<string>();
    users.forEach((user) => {
      if (user.teamName) teams.add(user.teamName);
    });
    return Array.from(teams).sort();
  }, [users]);

  return (
    <div className="rounded-lg border border-neutral-400 p-4">
      <div className="mb-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">
              Users{" "}
              {filteredUsers.length > 0 && (
                <span className="text-sm text-neutral-500">({filteredUsers.length})</span>
              )}
            </h2>
            <CreateUserDialog users={users} onCreateUser={onCreateUser} />
          </div>
          <ExportUsersAsExcelButton users={filteredUsers} />
        </div>

        <div className="mb-6 space-y-4">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              await onUploadFile(formData);
            }}
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <span>Main Event Registrations</span>
              <Input
                type="file"
                name="file"
                accept=".xlsx,.xls,.csv"
                className="max-w-xs"
                disabled={isUploading}
                required
              />
              <Button type="submit" variant="outline" disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload CSV"
                )}
              </Button>
            </div>
          </form>

          {/* <form
            onSubmit={async (e) => {
              e.preventDefault();
              await onSyncEventbrite();
            }}
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <span>Pre-event Registrations</span>
              <Button type="submit" variant="outline" disabled={isSyncing}>
                {isSyncing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  "Sync from Eventbrite"
                )}
              </Button>
            </div>
          </form> */}
          <hr className="w-full" />
        </div>

        {!isLoading && (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor="search-type">Search by:</label>
              {/* Search type dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-[180px] justify-between">
                    {SEARCH_TYPE_LABELS[searchType]}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {Object.entries(SEARCH_TYPE_LABELS).map(([type, label]) => (
                    <DropdownMenuItem
                      key={type}
                      onSelect={() => {
                        onSearchTypeChange(type as SearchType);
                        onSearchQueryChange("");
                      }}
                    >
                      <Check
                        className={`mr-2 h-4 w-4 ${
                          type === searchType ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      {label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Search input */}
              <Popover open={searchOpen} onOpenChange={setSearchOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={searchOpen}
                    className="w-full justify-between sm:w-[300px]"
                  >
                    {searchQuery || `Search by ${SEARCH_TYPE_LABELS[searchType].toLowerCase()}...`}
                    <div className="flex items-center">
                      {searchQuery && (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            onSearchQueryChange("");
                          }}
                          className="mr-2 cursor-pointer text-neutral-500 hover:text-neutral-700"
                        >
                          <X className="h-4 w-4" />
                        </div>
                      )}
                      <Search className="h-4 w-4 shrink-0 opacity-50" />
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <div className="relative">
                      <CommandInput
                        placeholder={`Search by ${SEARCH_TYPE_LABELS[searchType].toLowerCase()}...`}
                        value={searchQuery}
                        onValueChange={onSearchQueryChange}
                      />
                      {searchQuery && (
                        <div
                          onClick={() => onSearchQueryChange("")}
                          className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-neutral-500 hover:text-neutral-700"
                        >
                          <X className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <CommandList>
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup>
                        {searchType === "team" &&
                          uniqueTeams.map((team) => (
                            <CommandItem
                              key={`team-${team}`}
                              value={team}
                              onSelect={(value) => {
                                onSearchQueryChange(value);
                                setSearchOpen(false);
                              }}
                            >
                              {team}
                            </CommandItem>
                          ))}
                        {searchType === "username" &&
                          Array.from(new Set(users.map((u) => u.githubUsername))).map(
                            (username) => {
                              const user = users.find((u) => u.githubUsername === username);
                              if (!user) return null;
                              return (
                                <CommandItem
                                  key={`username-${user.id}`}
                                  value={user.githubUsername}
                                  onSelect={(value) => {
                                    onSearchQueryChange(value);
                                    setSearchOpen(false);
                                  }}
                                >
                                  {user.githubUsername}
                                </CommandItem>
                              );
                            },
                          )}
                        {searchType === "email" &&
                          Array.from(new Set(users.map((u) => u.email))).map((email) => {
                            const user = users.find((u) => u.email === email);
                            if (!user) return null;
                            return (
                              <CommandItem
                                key={`email-${user.id}`}
                                value={user.email}
                                onSelect={(value) => {
                                  onSearchQueryChange(value);
                                  setSearchOpen(false);
                                }}
                              >
                                {user.email}
                              </CommandItem>
                            );
                          })}
                        {searchType === "name" &&
                          Array.from(
                            new Set(
                              users.map((u) => `${u.firstName || ""} ${u.lastName || ""}`.trim()),
                            ),
                          ).map((name) => {
                            if (!name) return null;
                            const user = users.find(
                              (u) => `${u.firstName || ""} ${u.lastName || ""}`.trim() === name,
                            );
                            if (!user) return null;
                            return (
                              <CommandItem
                                key={`name-${user.id}`}
                                value={name}
                                onSelect={(value) => {
                                  onSearchQueryChange(value);
                                  setSearchOpen(false);
                                }}
                              >
                                {name}
                              </CommandItem>
                            );
                          })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="hideUnregisteredUsers"
                  checked={hideUnregisteredUsers}
                  onCheckedChange={(checked) => setHideUnregisteredUsers(checked as boolean)}
                />
                <label
                  htmlFor="hideUnregisteredUsers"
                  className="text-sm text-neutral-500 hover:text-neutral-700"
                >
                  Hide users not registered for main event
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="hideUsersWithTeams"
                  checked={hideUsersWithTeams}
                  onCheckedChange={(checked) => setHideUsersWithTeams(checked as boolean)}
                />
                <label
                  htmlFor="hideUsersWithTeams"
                  className="text-sm text-neutral-500 hover:text-neutral-700"
                >
                  Hide users with teams
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {isLoading ? (
        <div>Loading users...</div>
      ) : (
        <>
          <UserTable
            users={displayedUsers}
            onSetTeamLeader={onSetTeamLeader}
            onRemoveUser={onRemoveUser}
            onEditUser={onEditUser}
            onNavigateToTeam={onNavigateToTeam}
          />
          <div className="mt-4">
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
}

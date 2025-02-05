"use client";

import {
  editUser,
  removeUser,
  setTeamLeader,
  syncEventbrite,
  uploadFile,
} from "@/app/services/admin";
import { getAllUsersWithoutPagination, UserInfo } from "@/app/services/user";
import { toast, Toaster } from "sonner";
import ChallengeManagement from "./ChallengeManagement";
import TeamManagement from "./TeamManagement";
import UserManagement from "./UserManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { SearchType } from "./UserManagement";

export default function AdminClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [allUsers, setAllUsers] = useState<UserInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchType, setSearchType] = useState<SearchType>(
    (searchParams.get("searchType") as SearchType) || "username",
  );
  const [searchQuery, setSearchQuery] = useState(searchParams.get("searchQuery") || "");
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "challenges");

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Clear search state
    setSearchQuery("");
    setSearchType("username");

    // Update URL with only the tab parameter
    const params = new URLSearchParams();
    params.set("tab", value);
    router.push(`/admin?${params.toString()}`);
  };

  // Update URL when search changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery) {
      params.set("searchQuery", searchQuery);
      params.set("searchType", searchType);
    } else {
      params.delete("searchQuery");
      params.delete("searchType");
    }
    router.push(`/admin?${params.toString()}`);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, searchType]);

  // Add navigation functions
  const navigateToTeam = (teamName: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", "teams");
    params.set("searchQuery", teamName);
    router.push(`/admin?${params.toString()}`);
    setActiveTab("teams");
    setSearchQuery(teamName);
  };

  const navigateToUser = (username: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", "users");
    params.set("searchType", "username");
    params.set("searchQuery", username);
    router.push(`/admin?${params.toString()}`);
    setActiveTab("users");
    setSearchType("username");
    setSearchQuery(username);
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const result = await getAllUsersWithoutPagination();
      setAllUsers(result || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setAllUsers([]);
      toast.error("Failed to fetch users");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSetTeamLeader = async (userId: string) => {
    try {
      const result = await setTeamLeader(userId);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      // Update the user in the state
      setAllUsers((prevUsers) =>
        prevUsers.map((user) => {
          if (user.id === userId) {
            return { ...user, teamRole: "leader" };
          }
          if (user.teamId === user.teamId) {
            // Reset other users in the same team to member
            return user.teamRole === "leader" ? { ...user, teamRole: "member" } : user;
          }
          return user;
        }),
      );
    } catch {
      toast.error("Failed to update team leader");
    }
  };

  const handleRemoveUser = async (userId: string) => {
    try {
      const result = await removeUser(userId);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      // Remove user from the state
      setAllUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch {
      toast.error("Failed to remove user");
    }
  };

  const handleEditUser = async (userId: string, data: Partial<UserInfo>) => {
    try {
      const result = await editUser(userId, data);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      // Update user in the state
      setAllUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === userId ? { ...user, ...data } : user)),
      );
    } catch {
      toast.error("Failed to update user");
    }
  };

  const handleUploadFile = async (formData: FormData) => {
    setIsUploading(true);
    try {
      const result = await uploadFile(formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("CSV uploaded successfully");
        await fetchUsers(); // Refresh the user list after upload
      }
    } catch (error) {
      toast.error(`Failed to upload CSV: ${error}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSyncEventbrite = async () => {
    setIsSyncing(true);
    try {
      const result = await syncEventbrite();
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Synced with Eventbrite successfully");
        await fetchUsers();
      }
    } catch (error) {
      toast.error(`Failed to sync with Eventbrite: ${error}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSearchTypeChange = (type: SearchType) => {
    setSearchType(type);
  };

  return (
    <div className="flex flex-col gap-8 p-5 md:p-20">
      <Toaster />
      <div>
        <h1 className="mb-4 text-2xl font-bold md:text-4xl">HackOMania 2025 Admin Portal</h1>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="challenges">
          <ChallengeManagement />
        </TabsContent>

        <TabsContent value="teams">
          <TeamManagement
            onNavigateToUser={navigateToUser}
            searchQuery={activeTab === "teams" ? searchQuery : undefined}
            onSearchQueryChange={setSearchQuery}
          />
        </TabsContent>

        <TabsContent value="users">
          <UserManagement
            users={allUsers}
            isLoading={isLoading}
            isUploading={isUploading}
            isSyncing={isSyncing}
            searchType={searchType}
            searchQuery={searchQuery}
            onSearchTypeChange={handleSearchTypeChange}
            onSearchQueryChange={setSearchQuery}
            onUploadFile={handleUploadFile}
            onSyncEventbrite={handleSyncEventbrite}
            onSetTeamLeader={handleSetTeamLeader}
            onRemoveUser={handleRemoveUser}
            onEditUser={handleEditUser}
            onNavigateToTeam={navigateToTeam}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

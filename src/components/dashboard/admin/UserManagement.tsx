
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UserList from "./components/UserList";
import UserFilter from "./components/UserFilter";
import type { AdminUser } from "./types/adminTypes";

const UserManagement = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log("Fetching users data...");
      
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      console.log("Fetched profiles:", profiles);
      
      // Transform profiles into AdminUser type
      const transformedUsers: AdminUser[] = profiles.map(profile => ({
        id: profile.id,
        email: null, // We can't get emails without admin access
        full_name: profile.full_name,
        phone_number: profile.phone_number,
        role: profile.role || "user",
        created_at: profile.created_at,
        last_sign_in_at: null,
        status: profile.status || "active" // Default to active if status not set
      }));

      setUsers(transformedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to load users data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId: string, newStatus: string) => {
    try {
      console.log("Updating user status:", userId, newStatus);
      const { error } = await supabase
        .from("profiles")
        .update({ status: newStatus })
        .eq("id", userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User status updated successfully",
      });
      
      fetchUsers();
    } catch (error) {
      console.error("Error updating user status:", error);
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <Card className="animate-fade-up">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">User Management</CardTitle>
        <CardDescription>
          Monitor user activity and manage account statuses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <UserFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterStatus={filterStatus}
            onFilterChange={setFilterStatus}
            onRefresh={fetchUsers}
            loading={loading}
          />
          <UserList 
            users={filteredUsers}
            onUpdateStatus={updateUserStatus}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default UserManagement;

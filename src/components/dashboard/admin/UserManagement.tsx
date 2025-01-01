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
  const [filterRole, setFilterRole] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log("Fetching users data...");
      
      // First get profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Then get auth users for email and last sign in
      const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) throw authError;

      // Combine the data
      const combinedUsers: AdminUser[] = profiles?.map(profile => {
        const authUser = authUsers.find(u => u.id === profile.id);
        return {
          ...profile,
          email: authUser?.email || null,
          last_sign_in_at: authUser?.last_sign_in_at || null,
        };
      }) || [];

      console.log("Fetched profiles:", combinedUsers);
      setUsers(combinedUsers);
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

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      console.log("Updating user role:", userId, newRole);
      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User role updated successfully",
      });
      
      fetchUsers();
    } catch (error) {
      console.error("Error updating user role:", error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !filterRole || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <Card className="animate-fade-up">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">User Management</CardTitle>
        <CardDescription>
          Manage system users and their roles
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <UserFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterRole={filterRole}
            onFilterChange={setFilterRole}
            onRefresh={fetchUsers}
            loading={loading}
          />
          <UserList 
            users={filteredUsers}
            onUpdateRole={updateUserRole}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default UserManagement;
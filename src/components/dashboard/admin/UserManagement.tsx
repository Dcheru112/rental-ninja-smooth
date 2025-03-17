
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UserList from "./components/UserList";
import UserFilter from "./components/UserFilter";
import UserDetailsDialog from "./components/UserDetailsDialog";
import type { AdminUser } from "./types/adminTypes";

const UserManagement = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log("Fetching users data...");
      
      // Try to fetch users from auth.users for emails (only works with admin access)
      let emails: Record<string, string> = {};
      
      try {
        const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
        
        if (!authError && authData && authData.users) {
          // Process each user safely with proper type checking
          if (Array.isArray(authData.users)) {
            authData.users.forEach(user => {
              if (user && typeof user === 'object' && 'id' in user && 'email' in user && typeof user.id === 'string' && typeof user.email === 'string') {
                emails[user.id] = user.email;
              }
            });
          }
        }
      } catch (error) {
        console.warn("Could not fetch emails from auth.users (requires admin access)");
      }
      
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      console.log("Fetched profiles:", profiles);
      
      // Transform profiles into AdminUser type
      const transformedUsers: AdminUser[] = profiles.map(profile => ({
        id: profile.id,
        email: emails[profile.id] || null, // Add email if available
        full_name: profile.full_name,
        phone_number: profile.phone_number,
        role: profile.role || "user",
        created_at: profile.created_at,
        last_sign_in_at: null,
        status: profile.status
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
      
      // Update the user status in the database
      const { error } = await supabase
        .from("profiles")
        .update({ status: newStatus })
        .eq("id", userId);

      if (error) {
        console.error("Supabase update error:", error);
        throw error;
      }

      console.log("Successfully updated status in database");

      // Update the local state to immediately reflect the change
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );

      // If the user details dialog is open and showing this user, update it too
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({ ...selectedUser, status: newStatus });
      }

      toast({
        title: "Success",
        description: `User status updated to ${newStatus}`,
      });
    } catch (error) {
      console.error("Error updating user status:", error);
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (user: AdminUser) => {
    setSelectedUser(user);
    setDetailsOpen(true);
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
            onViewDetails={handleViewDetails}
          />
          <UserDetailsDialog 
            user={selectedUser}
            open={detailsOpen}
            onOpenChange={setDetailsOpen}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default UserManagement;

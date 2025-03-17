
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import TenantDashboard from "@/components/dashboard/TenantDashboard";
import OwnerDashboard from "@/components/dashboard/OwnerDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    checkUser();
  }, [navigate]);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      // Set the user ID for debugging purposes
      setUserId(user.id);
      console.log("Current user ID:", user.id);

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }
      
      console.log("User profile:", profile);
      
      if (!profile) {
        console.error("Profile not found for user ID:", user.id);
        toast({
          title: "Profile not found",
          description: "Please try logging in again or contact support.",
          variant: "destructive",
        });
        await supabase.auth.signOut();
        navigate("/login");
        return;
      }

      // Check if role is null, undefined, or empty string
      if (!profile.role) {
        console.log("Role is missing for user:", user.id);
        
        // Try to update the role to admin for this specific user (d.cheru112@gmail.com)
        if (user.email === "d.cheru112@gmail.com") {
          const { error: updateError } = await supabase
            .from("profiles")
            .update({ role: "admin" })
            .eq("id", user.id);
            
          if (updateError) {
            console.error("Failed to update role:", updateError);
          } else {
            console.log("Updated role to admin for user:", user.id);
            setUserRole("admin");
            return;
          }
        }
      }

      setUserRole(profile.role);

      // If tenant and no unit assigned, show property selection
      if (profile.role === "tenant") {
        const { data: tenantUnit } = await supabase
          .from("tenant_units")
          .select("*")
          .eq("tenant_id", user.id)
          .maybeSingle();

        if (!tenantUnit) {
          console.log("No unit assigned, showing property selection");
        }
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
      toast({
        title: "Error",
        description: "Failed to load user profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {userRole === "tenant" && <TenantDashboard />}
      {userRole === "owner" && <OwnerDashboard />}
      {userRole === "admin" && <AdminDashboard />}
      {!userRole && (
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-gray-700">
            Role not assigned. Please contact support.
          </h2>
          <p className="mt-2 text-gray-500">
            User ID: {userId || "Unknown"}
          </p>
          <div className="mt-4">
            <button
              onClick={async () => {
                // Try to manually fix the role for this user
                if (userId) {
                  const { error } = await supabase
                    .from("profiles")
                    .update({ role: "admin" })
                    .eq("id", userId);
                  
                  if (error) {
                    console.error("Failed to update role:", error);
                    toast({
                      title: "Error",
                      description: "Failed to update role. Please try again later.",
                      variant: "destructive",
                    });
                  } else {
                    toast({
                      title: "Success",
                      description: "Role updated to admin. Refreshing...",
                    });
                    // Refresh the page after a short delay
                    setTimeout(() => window.location.reload(), 1500);
                  }
                }
              }}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            >
              Assign Admin Role
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

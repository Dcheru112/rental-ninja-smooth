
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import TenantDashboard from "@/components/dashboard/TenantDashboard";
import OwnerDashboard from "@/components/dashboard/OwnerDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, [navigate]);

  const checkUser = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      // Fetch user profile
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }
      
      // Handle missing profile
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

      // Set user role from profile
      setUserRole(profile.role);

      // Special case for tenant without assigned unit
      if (profile.role === "tenant") {
        const { data: tenantUnit } = await supabase
          .from("tenant_units")
          .select("*")
          .eq("tenant_id", user.id)
          .maybeSingle();

        if (!tenantUnit) {
          console.log("No unit assigned to tenant");
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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading your dashboard...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {userRole === "tenant" && <TenantDashboard />}
      {userRole === "owner" && <OwnerDashboard />}
      {userRole === "admin" && <AdminDashboard />}
      {!userRole && (
        <div className="text-center py-8 max-w-md mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">
              Role Not Assigned
            </h2>
            <p className="text-gray-600 mb-4">
              Your account doesn't have a role assigned yet. Please contact the system administrator
              or sign in with an account that has the appropriate permissions.
            </p>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                navigate("/login");
              }}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

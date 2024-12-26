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

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (error) throw error;
      
      if (!profile) {
        toast({
          title: "Profile not found",
          description: "Please try logging in again or contact support.",
          variant: "destructive",
        });
        await supabase.auth.signOut();
        navigate("/login");
        return;
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
        </div>
      )}
    </div>
  );
};

export default Dashboard;
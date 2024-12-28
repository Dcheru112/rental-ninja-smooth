import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import AdminDashboardContent from "./admin/AdminDashboardContent";
import type { Statistics, PropertyOwner } from "./admin/types";

const AdminDashboard = () => {
  const [owners, setOwners] = useState<PropertyOwner[]>([]);
  const [statistics, setStatistics] = useState<Statistics>({
    totalProperties: 0,
    totalTenants: 0,
    totalMaintenanceRequests: 0,
    totalPayments: 0,
    pendingMaintenanceRequests: 0,
    occupancyRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      console.log("Fetching admin dashboard data");

      // Fetch property owners with property counts
      const { data: ownerProfiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name")
        .eq("role", "owner");

      if (profilesError) throw profilesError;

      const ownersWithProperties = await Promise.all(
        (ownerProfiles || []).map(async (owner) => {
          const { count } = await supabase
            .from("properties")
            .select("*", { count: "exact", head: true })
            .eq("owner_id", owner.id);

          return {
            id: owner.id,
            full_name: owner.full_name || "Unknown",
            properties_count: count || 0,
          };
        })
      );

      setOwners(ownersWithProperties);

      // Fetch overall statistics
      const [
        { count: propertiesCount },
        { count: tenantsCount },
        { count: maintenanceCount },
        { count: pendingMaintenanceCount },
        { count: paymentsCount },
      ] = await Promise.all([
        supabase.from("properties").select("*", { count: "exact", head: true }),
        supabase.from("tenant_units").select("*", { count: "exact", head: true }),
        supabase.from("maintenance_requests").select("*", { count: "exact", head: true }),
        supabase.from("maintenance_requests")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending"),
        supabase.from("payments").select("*", { count: "exact", head: true }),
      ]);

      // Calculate occupancy rate
      const { data: properties } = await supabase
        .from("properties")
        .select("units");

      const totalUnits = properties?.reduce((sum, p) => sum + p.units, 0) || 0;
      const occupancyRate = totalUnits > 0 
        ? ((tenantsCount || 0) / totalUnits) * 100 
        : 0;

      setStatistics({
        totalProperties: propertiesCount || 0,
        totalTenants: tenantsCount || 0,
        totalMaintenanceRequests: maintenanceCount || 0,
        totalPayments: paymentsCount || 0,
        pendingMaintenanceRequests: pendingMaintenanceCount || 0,
        occupancyRate,
      });

    } catch (error) {
      console.error("Error fetching admin dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <AdminDashboardContent
        statistics={statistics}
        owners={owners}
        onRefresh={fetchDashboardData}
      />
    </div>
  );
};

export default AdminDashboard;
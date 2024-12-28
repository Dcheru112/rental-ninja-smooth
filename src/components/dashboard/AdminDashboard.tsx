import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PropertyOwner {
  id: string;
  full_name: string;
  properties_count: number;
}

interface Statistics {
  totalProperties: number;
  totalTenants: number;
  totalMaintenanceRequests: number;
  totalPayments: number;
  pendingMaintenanceRequests: number;
  occupancyRate: number;
}

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

  const chartData = owners.map(owner => ({
    name: owner.full_name,
    properties: owner.properties_count,
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Properties</CardTitle>
            <CardDescription>Total properties in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{statistics.totalProperties}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tenants</CardTitle>
            <CardDescription>Total active tenants</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{statistics.totalTenants}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Occupancy Rate</CardTitle>
            <CardDescription>Overall occupancy percentage</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {statistics.occupancyRate.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="owners">Property Owners</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Properties by Owner</CardTitle>
              <CardDescription>Distribution of properties among owners</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="properties" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="owners">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Owner Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Properties Count
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {owners.map((owner) => (
                  <tr key={owner.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {owner.full_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {owner.properties_count}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Property } from "@/types/property";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PropertyHeader from "./property/PropertyHeader";
import PropertyOverview from "./property/PropertyOverview";
import TenantsTable from "./property/TenantsTable";
import MaintenanceTable from "./property/MaintenanceTable";
import PaymentsTable from "./property/PaymentsTable";

interface PropertyDashboardProps {
  property: Property;
  onBack: () => void;
}

const PropertyDashboard = ({ property, onBack }: PropertyDashboardProps) => {
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [payments, setPayments] = useState([]);
  const [tenants, setTenants] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchPropertyData();
  }, [property.id]);

  const fetchPropertyData = async () => {
    try {
      // Fetch maintenance requests
      const { data: requests, error: requestsError } = await supabase
        .from("maintenance_requests")
        .select("*")
        .eq("property_id", property.id)
        .order("created_at", { ascending: false });

      if (requestsError) throw requestsError;
      setMaintenanceRequests(requests || []);

      // Fetch payments
      const { data: paymentData, error: paymentsError } = await supabase
        .from("payments")
        .select("*")
        .eq("property_id", property.id)
        .order("payment_date", { ascending: false });

      if (paymentsError) throw paymentsError;
      setPayments(paymentData || []);

      // Fetch tenants with their profiles
      const { data: tenantData, error: tenantsError } = await supabase
        .from("tenant_units")
        .select(`
          tenant_id,
          unit_number,
          profiles (
            full_name
          )
        `)
        .eq("property_id", property.id);

      if (tenantsError) throw tenantsError;
      
      const formattedTenants = tenantData?.map(t => ({
        id: t.tenant_id,
        full_name: t.profiles?.full_name || 'Unknown',
        unit_number: t.unit_number
      })) || [];
      
      setTenants(formattedTenants);
    } catch (error) {
      console.error("Error fetching property data:", error);
      toast({
        title: "Error",
        description: "Failed to load property data",
        variant: "destructive",
      });
    }
  };

  const pendingMaintenanceCount = maintenanceRequests.filter(r => r.status === 'pending').length;

  return (
    <div className="container mx-auto px-4 py-8">
      <PropertyHeader property={property} onBack={onBack} />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tenants">Tenants</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <PropertyOverview 
            property={property}
            tenantCount={tenants.length}
            pendingMaintenanceCount={pendingMaintenanceCount}
          />
        </TabsContent>

        <TabsContent value="tenants">
          <TenantsTable tenants={tenants} />
        </TabsContent>

        <TabsContent value="maintenance">
          <MaintenanceTable requests={maintenanceRequests} />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentsTable payments={payments} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PropertyDashboard;
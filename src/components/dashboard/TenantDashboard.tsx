import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import PropertySelection from "./PropertySelection";
import TenantHeader from "./tenant/TenantHeader";
import TenantActions from "./tenant/TenantActions";
import TenantMaintenanceRequest from "./tenant/TenantMaintenanceRequest";
import TenantPayments from "./tenant/TenantPayments";
import type { Property } from "@/types/property";

interface TenantUnit {
  property: Property;
  unit_number: string;
}

interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
}

const TenantDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [tenantUnit, setTenantUnit] = useState<TenantUnit | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    checkTenantUnit();
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*");

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast({
        title: "Error",
        description: "Failed to load properties",
        variant: "destructive",
      });
    }
  };

  const fetchMaintenanceRequests = async (propertyId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("maintenance_requests")
        .select("*")
        .eq("tenant_id", user.id)
        .eq("property_id", propertyId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMaintenanceRequests(data || []);
    } catch (error) {
      console.error("Error fetching maintenance requests:", error);
      toast({
        title: "Error",
        description: "Failed to load maintenance requests",
        variant: "destructive",
      });
    }
  };

  const checkTenantUnit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      console.log("Checking tenant unit for user:", user.id);
      const { data: unitData, error: unitError } = await supabase
        .from("tenant_units")
        .select(`
          unit_number,
          properties (*)
        `)
        .eq("tenant_id", user.id)
        .maybeSingle();

      if (unitError) throw unitError;

      if (unitData) {
        console.log("Found tenant unit:", unitData);
        setTenantUnit({
          property: unitData.properties,
          unit_number: unitData.unit_number,
        });
        // Fetch maintenance requests when tenant unit is found
        await fetchMaintenanceRequests(unitData.properties.id);
      } else {
        console.log("No tenant unit found");
      }
    } catch (error) {
      console.error("Error checking tenant unit:", error);
      toast({
        title: "Error",
        description: "Failed to load tenant information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMaintenanceRequestsUpdate = (updatedRequests: MaintenanceRequest[]) => {
    setMaintenanceRequests(updatedRequests);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!tenantUnit) {
    return (
      <PropertySelection
        properties={properties}
        onComplete={() => {
          checkTenantUnit();
          toast({
            title: "Success",
            description: "Property assigned successfully!",
          });
        }}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <TenantHeader
        propertyName={tenantUnit.property.name}
        unitNumber={tenantUnit.unit_number}
        address={tenantUnit.property.address}
      />

      <TenantActions
        unitNumber={tenantUnit.unit_number}
      />

      <div className="space-y-8">
        <TenantMaintenanceRequest 
          requests={maintenanceRequests}
          onRequestsUpdate={handleMaintenanceRequestsUpdate}
        />
        <TenantPayments propertyId={tenantUnit.property.id} />
      </div>
    </div>
  );
};

export default TenantDashboard;
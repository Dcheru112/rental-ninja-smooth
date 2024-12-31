import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import MaintenanceRequestForm from "../MaintenanceRequestForm";
import MaintenanceList from "./MaintenanceList";

interface TenantMaintenanceRequestProps {
  propertyId: string;
}

const TenantMaintenanceRequest = ({ propertyId }: TenantMaintenanceRequestProps) => {
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
  const [maintenanceRequests, setMaintenanceRequests] = useState<any[]>([]);

  useEffect(() => {
    fetchMaintenanceRequests();
    setupMaintenanceSubscription();
  }, [propertyId]);

  const fetchMaintenanceRequests = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      console.log("Fetching maintenance requests for tenant:", user.id);
      const { data: requests, error } = await supabase
        .from("maintenance_requests")
        .select("*")
        .eq("tenant_id", user.id)
        .eq("property_id", propertyId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      console.log("Maintenance requests:", requests);
      setMaintenanceRequests(requests || []);
    } catch (error) {
      console.error("Error fetching maintenance requests:", error);
    }
  };

  const setupMaintenanceSubscription = () => {
    const channel = supabase
      .channel('maintenance_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'maintenance_requests',
          filter: `property_id=eq.${propertyId}`
        }, 
        (payload) => {
          console.log("Maintenance request change detected:", payload);
          fetchMaintenanceRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  return (
    <>
      <MaintenanceList requests={maintenanceRequests} />
      {showMaintenanceForm && (
        <MaintenanceRequestForm
          onClose={() => {
            setShowMaintenanceForm(false);
            fetchMaintenanceRequests();
          }}
        />
      )}
    </>
  );
};

export default TenantMaintenanceRequest;
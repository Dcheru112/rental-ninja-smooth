import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import PropertySelection from "./PropertySelection";
import MaintenanceRequestForm from "./MaintenanceRequestForm";
import PaymentForm from "./PaymentForm";
import TenantHeader from "./tenant/TenantHeader";
import TenantActions from "./tenant/TenantActions";
import MaintenanceList from "./tenant/MaintenanceList";
import PaymentList from "./tenant/PaymentList";
import type { Property } from "@/types/property";

interface TenantUnit {
  property: Property;
  unit_number: string;
}

const TenantDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [tenantUnit, setTenantUnit] = useState<TenantUnit | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [maintenanceRequests, setMaintenanceRequests] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
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
        await fetchTenantData(unitData.properties.id);
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

  const fetchTenantData = async (propertyId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      console.log("Fetching tenant data for property:", propertyId);
      
      // Fetch maintenance requests with real-time subscription
      const { data: requests, error: requestsError } = await supabase
        .from("maintenance_requests")
        .select("*")
        .eq("tenant_id", user.id)
        .eq("property_id", propertyId)
        .order("created_at", { ascending: false });

      if (requestsError) throw requestsError;
      console.log("Maintenance requests:", requests);
      setMaintenanceRequests(requests || []);

      // Set up real-time subscription for maintenance requests
      const maintenanceSubscription = supabase
        .channel('maintenance_changes')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'maintenance_requests',
            filter: `tenant_id=eq.${user.id}` 
          }, 
          () => {
            fetchTenantData(propertyId);
          }
        )
        .subscribe();

      // Fetch payments with real-time subscription
      const { data: paymentData, error: paymentError } = await supabase
        .from("payments")
        .select("*")
        .eq("tenant_id", user.id)
        .eq("property_id", propertyId)
        .order("payment_date", { ascending: false });

      if (paymentError) throw paymentError;
      console.log("Payments:", paymentData);
      setPayments(paymentData || []);

      // Set up real-time subscription for payments
      const paymentSubscription = supabase
        .channel('payment_changes')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'payments',
            filter: `tenant_id=eq.${user.id}` 
          }, 
          () => {
            fetchTenantData(propertyId);
          }
        )
        .subscribe();

      return () => {
        maintenanceSubscription.unsubscribe();
        paymentSubscription.unsubscribe();
      };
    } catch (error) {
      console.error("Error fetching tenant data:", error);
    }
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
        onMaintenanceClick={() => setShowMaintenanceForm(true)}
        onPaymentClick={() => setShowPaymentForm(true)}
      />

      <div className="space-y-8">
        <MaintenanceList requests={maintenanceRequests} />
        <PaymentList payments={payments} />
      </div>

      {showMaintenanceForm && (
        <MaintenanceRequestForm
          onClose={() => {
            setShowMaintenanceForm(false);
            fetchTenantData(tenantUnit.property.id);
          }}
        />
      )}

      {showPaymentForm && (
        <PaymentForm
          onClose={() => {
            setShowPaymentForm(false);
            fetchTenantData(tenantUnit.property.id);
          }}
        />
      )}
    </div>
  );
};

export default TenantDashboard;
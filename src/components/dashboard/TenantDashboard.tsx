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
        setTenantUnit({
          property: unitData.properties,
          unit_number: unitData.unit_number,
        });
        await fetchTenantData(unitData.properties.id);
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

      const { data: requests } = await supabase
        .from("maintenance_requests")
        .select("*")
        .eq("tenant_id", user.id)
        .eq("property_id", propertyId)
        .order("created_at", { ascending: false });

      setMaintenanceRequests(requests || []);

      const { data: paymentData } = await supabase
        .from("payments")
        .select("*")
        .eq("tenant_id", user.id)
        .eq("property_id", propertyId)
        .order("payment_date", { ascending: false });

      setPayments(paymentData || []);
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
          onClose={() => setShowMaintenanceForm(false)}
        />
      )}

      {showPaymentForm && (
        <PaymentForm
          onClose={() => setShowPaymentForm(false)}
        />
      )}
    </div>
  );
};

export default TenantDashboard;
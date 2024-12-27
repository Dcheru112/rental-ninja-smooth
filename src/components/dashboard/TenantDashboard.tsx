import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Wrench, CreditCard } from "lucide-react";
import PropertySelection from "./PropertySelection";
import MaintenanceRequestForm from "./MaintenanceRequestForm";
import PaymentForm from "./PaymentForm";
import type { Property } from "@/types/property";

const TenantDashboard = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasUnit, setHasUnit] = useState(false);
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkTenantUnit();
    fetchProperties();
  }, []);

  const checkTenantUnit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("tenant_units")
        .select("*")
        .eq("tenant_id", user.id)
        .maybeSingle();

      setHasUnit(!!data);
    } catch (error) {
      console.error("Error checking tenant unit:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("name");

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!hasUnit) {
    return (
      <PropertySelection
        properties={properties}
        onComplete={() => setHasUnit(true)}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          <div className="flex items-center space-x-2">
            <Wrench className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Maintenance</h2>
          </div>
          <p className="text-gray-600">Report maintenance issues for your unit</p>
          <Button onClick={() => setShowMaintenanceForm(true)}>
            Report an Issue
          </Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          <div className="flex items-center space-x-2">
            <CreditCard className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Payments</h2>
          </div>
          <p className="text-gray-600">Make rent payments and view history</p>
          <Button onClick={() => setShowPaymentForm(true)}>
            Make a Payment
          </Button>
        </div>
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
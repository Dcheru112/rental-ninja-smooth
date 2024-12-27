import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Wrench, CreditCard, Home } from "lucide-react";
import PropertySelection from "./PropertySelection";
import MaintenanceRequestForm from "./MaintenanceRequestForm";
import PaymentForm from "./PaymentForm";
import type { Property } from "@/types/property";

interface TenantUnit {
  property: Property;
  unit_number: string;
}

const TenantDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [tenantUnit, setTenantUnit] = useState<TenantUnit | null>(null);
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [maintenanceRequests, setMaintenanceRequests] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    checkTenantUnit();
  }, []);

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

      // Fetch maintenance requests
      const { data: requests } = await supabase
        .from("maintenance_requests")
        .select("*")
        .eq("tenant_id", user.id)
        .eq("property_id", propertyId)
        .order("created_at", { ascending: false });

      setMaintenanceRequests(requests || []);

      // Fetch payments
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{tenantUnit.property.name}</h1>
        <p className="text-gray-600">Unit {tenantUnit.unit_number}</p>
        <p className="text-gray-600">{tenantUnit.property.address}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          <div className="flex items-center space-x-2">
            <Home className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">Your Unit</h2>
          </div>
          <p className="text-gray-600">Unit {tenantUnit.unit_number}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          <div className="flex items-center space-x-2">
            <Wrench className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">Maintenance</h2>
          </div>
          <p className="text-gray-600">Report maintenance issues</p>
          <Button onClick={() => setShowMaintenanceForm(true)}>
            Submit Request
          </Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          <div className="flex items-center space-x-2">
            <CreditCard className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">Payments</h2>
          </div>
          <p className="text-gray-600">Make rent payments</p>
          <Button onClick={() => setShowPaymentForm(true)}>
            Make Payment
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Recent Maintenance Requests</h2>
          <div className="space-y-4">
            {maintenanceRequests.slice(0, 5).map((request) => (
              <div key={request.id} className="border-b pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{request.title}</h3>
                    <p className="text-gray-600">{request.description}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    request.status === 'pending' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {request.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(request.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Recent Payments</h2>
          <div className="space-y-4">
            {payments.slice(0, 5).map((payment) => (
              <div key={payment.id} className="border-b pb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">${payment.amount}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(payment.payment_date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    payment.status === 'pending' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {payment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
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
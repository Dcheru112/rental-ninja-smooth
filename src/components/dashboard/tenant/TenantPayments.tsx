import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import PaymentForm from "../PaymentForm";
import PaymentList from "./PaymentList";

interface TenantPaymentsProps {
  propertyId: string;
}

const TenantPayments = ({ propertyId }: TenantPaymentsProps) => {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    fetchPayments();
    setupPaymentSubscription();
  }, [propertyId]);

  const fetchPayments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      console.log("Fetching payments for tenant:", user.id);
      const { data: paymentData, error } = await supabase
        .from("payments")
        .select("*")
        .eq("tenant_id", user.id)
        .eq("property_id", propertyId)
        .order("payment_date", { ascending: false });

      if (error) throw error;
      console.log("Payments:", paymentData);
      setPayments(paymentData || []);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const setupPaymentSubscription = () => {
    const channel = supabase
      .channel('payment_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'payments',
          filter: `property_id=eq.${propertyId}`
        }, 
        (payload) => {
          console.log("Payment change detected:", payload);
          fetchPayments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  return (
    <>
      <PaymentList payments={payments} />
      {showPaymentForm && (
        <PaymentForm
          onClose={() => {
            setShowPaymentForm(false);
            fetchPayments();
          }}
        />
      )}
    </>
  );
};

export default TenantPayments;
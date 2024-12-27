import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { X } from "lucide-react";

interface PaymentFormProps {
  onClose: () => void;
}

const PaymentForm = ({ onClose }: PaymentFormProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      // Get the tenant's unit
      const { data: tenantUnit } = await supabase
        .from("tenant_units")
        .select("property_id")
        .eq("tenant_id", user.id)
        .single();

      if (!tenantUnit) throw new Error("No unit found for tenant");

      const formData = new FormData(e.currentTarget);
      const amount = parseFloat(formData.get("amount") as string);

      const { error } = await supabase
        .from("payments")
        .insert({
          tenant_id: user.id,
          property_id: tenantUnit.property_id,
          amount,
          status: "pending",
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Payment submitted successfully!",
      });
      onClose();
    } catch (error) {
      console.error("Error submitting payment:", error);
      toast({
        title: "Error",
        description: "Failed to submit payment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <h2 className="text-xl font-semibold mb-4">Make a Payment</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="amount">Payment Amount ($)</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              required
              min="0"
              step="0.01"
              placeholder="Enter amount"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Processing..." : "Submit Payment"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
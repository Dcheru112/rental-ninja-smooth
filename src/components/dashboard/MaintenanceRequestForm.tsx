import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { X } from "lucide-react";

interface MaintenanceRequestFormProps {
  onClose: () => void;
}

const MaintenanceRequestForm = ({ onClose }: MaintenanceRequestFormProps) => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Starting maintenance request submission...");
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error("No authenticated user found");
        throw new Error("No authenticated user");
      }

      console.log("Fetching tenant unit for user:", user.id);
      const { data: tenantUnit, error: unitError } = await supabase
        .from("tenant_units")
        .select("property_id")
        .eq("tenant_id", user.id)
        .maybeSingle();

      if (unitError) {
        console.error("Error fetching tenant unit:", unitError);
        throw unitError;
      }

      if (!tenantUnit) {
        console.error("No unit found for tenant");
        throw new Error("No unit found for tenant");
      }

      console.log("Submitting maintenance request with data:", {
        tenant_id: user.id,
        property_id: tenantUnit.property_id,
        title,
        description
      });

      const { error: insertError } = await supabase
        .from("maintenance_requests")
        .insert({
          tenant_id: user.id,
          property_id: tenantUnit.property_id,
          title,
          description,
          status: "pending",
        });

      if (insertError) {
        console.error("Error inserting maintenance request:", insertError);
        throw insertError;
      }

      console.log("Maintenance request submitted successfully");
      toast({
        title: "Success",
        description: "Maintenance request submitted successfully!",
      });
      onClose();
    } catch (error) {
      console.error("Error submitting maintenance request:", error);
      toast({
        title: "Error",
        description: "Failed to submit maintenance request. Please try again.",
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

        <h2 className="text-xl font-semibold mb-4">Submit Maintenance Request</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Issue Title</Label>
            <Input
              id="title"
              required
              placeholder="Brief description of the issue"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="description">Detailed Description</Label>
            <Textarea
              id="description"
              required
              placeholder="Please provide details about the maintenance issue"
              className="h-32"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaintenanceRequestForm;
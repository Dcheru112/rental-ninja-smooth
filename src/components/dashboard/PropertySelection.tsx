import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Property } from "@/types/property";

interface PropertySelectionProps {
  properties: Property[];
  onComplete: () => void;
}

const PropertySelection = ({ properties, onComplete }: PropertySelectionProps) => {
  const [selectedProperty, setSelectedProperty] = useState<string>("");
  const [unitNumber, setUnitNumber] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase.from("tenant_units").insert({
        tenant_id: user.id,
        property_id: selectedProperty,
        unit_number: unitNumber,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your unit has been assigned successfully!",
      });
      
      onComplete();
    } catch (error) {
      console.error("Error assigning unit:", error);
      toast({
        title: "Error",
        description: "Failed to assign unit. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Select Your Property</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Property
          </label>
          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2"
            required
          >
            <option value="">Select a property</option>
            {properties.map((property) => (
              <option key={property.id} value={property.id}>
                {property.name} - {property.address}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Unit Number
          </label>
          <Input
            type="text"
            value={unitNumber}
            onChange={(e) => setUnitNumber(e.target.value)}
            placeholder="Enter your unit number"
            required
          />
        </div>

        <Button type="submit" className="w-full">
          Confirm Selection
        </Button>
      </form>
    </div>
  );
};

export default PropertySelection;
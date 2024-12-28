import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import PropertyList from "../PropertyList";
import type { Property } from "@/types/property";

interface PropertyOwnerDetailsProps {
  ownerId: string;
  ownerName: string;
  onBack: () => void;
}

const PropertyOwnerDetails = ({ ownerId, ownerName, onBack }: PropertyOwnerDetailsProps) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchOwnerProperties();
  }, [ownerId]);

  const fetchOwnerProperties = async () => {
    try {
      console.log("Fetching properties for owner:", ownerId);
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("owner_id", ownerId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      console.log("Owner properties:", data);
      setProperties(data || []);
    } catch (error) {
      console.error("Error fetching owner properties:", error);
      toast({
        title: "Error",
        description: "Failed to load owner properties",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading properties...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Owners
        </Button>
        <h2 className="text-2xl font-bold">{ownerName}'s Properties</h2>
      </div>
      <PropertyList properties={properties} />
    </div>
  );
};

export default PropertyOwnerDetails;
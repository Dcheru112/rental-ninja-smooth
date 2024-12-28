import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import PropertyList from "./PropertyList";
import AddPropertyForm from "./AddPropertyForm";
import PropertyDashboard from "./PropertyDashboard";
import type { Property } from "@/types/property";

const OwnerDashboard = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true); // Start with loading to ensure UI reflects data fetching
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(`Error fetching properties: ${error.message}`);
      }
      
      // Ensure data is an array before setting state
      setProperties(data as Property[] || []);
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast({
        title: "Error",
        description: "Failed to load properties",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddProperty = async (property: { name: string; address: string; units: number }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      const { data, error } = await supabase
        .from("properties")
        .insert({
          ...property,
          owner_id: user.id,
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Error adding property: ${error.message}`);
      }

      toast({
        title: "Success",
        description: "Property added successfully!",
      });
      
      setShowAddProperty(false);
      // Use the spread operator to add the new property at the beginning of the list
      setProperties([data as Property, ...properties]);
    } catch (error) {
      console.error("Error adding property:", error);
      toast({
        title: "Error",
        description: "Failed to add property",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading properties...</div>;
  }

  if (selectedProperty) {
    return (
      <PropertyDashboard 
        property={selectedProperty} 
        onBack={() => setSelectedProperty(null)}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Properties</h1>
        <Button onClick={() => setShowAddProperty(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Property
        </Button>
      </div>

      {showAddProperty && (
        <AddPropertyForm
          onSubmit={handleAddProperty}
          onCancel={() => setShowAddProperty(false)}
        />
      )}

      <PropertyList 
        properties={properties} 
        onPropertyClick={setSelectedProperty}
      />
    </div>
  );
};

export default OwnerDashboard;

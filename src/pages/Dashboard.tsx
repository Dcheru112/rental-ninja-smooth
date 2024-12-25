import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import PropertyList from "@/components/dashboard/PropertyList";
import AddPropertyForm from "@/components/dashboard/AddPropertyForm";
import type { Property } from "@/types/property";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      // Fetch user role from profiles
      const { data: profileData } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      setUserRole(profileData?.role || "tenant");
      fetchProperties();
    };

    checkUser();
  }, [navigate]);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast({
        title: "Error",
        description: "Failed to fetch properties. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddProperty = async (newProperty: { name: string; address: string; units: number }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase.from("properties").insert({
        ...newProperty,
        owner_id: user.id,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Property added successfully!",
      });

      setShowAddForm(false);
      fetchProperties();
    } catch (error) {
      console.error("Error adding property:", error);
      toast({
        title: "Error",
        description: "Failed to add property. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8">Loading properties...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Property Management Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome, {userRole === "landlord" ? "Landlord" : "Tenant"}
          </p>
        </div>
        {userRole === "landlord" && (
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Button>
        )}
      </div>

      {showAddForm && userRole === "landlord" && (
        <AddPropertyForm
          onSubmit={handleAddProperty}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {properties.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-600">
            No properties found
          </h2>
          <p className="text-gray-500 mt-2">
            {userRole === "landlord"
              ? "Click the 'Add Property' button to get started"
              : "No properties are currently available"}
          </p>
        </div>
      ) : (
        <PropertyList properties={properties} />
      )}
    </div>
  );
};

export default Dashboard;
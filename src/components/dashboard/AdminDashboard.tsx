import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface PropertyOwner {
  id: string;
  full_name: string;
  properties_count: number;
}

const AdminDashboard = () => {
  const [owners, setOwners] = useState<PropertyOwner[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPropertyOwners();
  }, []);

  const fetchPropertyOwners = async () => {
    try {
      // First, get all profiles with role 'owner'
      const { data: ownerProfiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name")
        .eq("role", "owner");

      if (profilesError) throw profilesError;

      // Then, for each owner, count their properties
      const ownersWithProperties = await Promise.all(
        (ownerProfiles || []).map(async (owner) => {
          const { count, error: countError } = await supabase
            .from("properties")
            .select("*", { count: "exact", head: true })
            .eq("owner_id", owner.id);

          if (countError) {
            console.error("Error counting properties:", countError);
            return {
              id: owner.id,
              full_name: owner.full_name || "Unknown",
              properties_count: 0,
            };
          }

          return {
            id: owner.id,
            full_name: owner.full_name || "Unknown",
            properties_count: count || 0,
          };
        })
      );

      setOwners(ownersWithProperties);
    } catch (error) {
      console.error("Error fetching property owners:", error);
      toast({
        title: "Error",
        description: "Failed to load property owners",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Property Owners</h1>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Owner Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Properties Count
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {owners.map((owner) => (
              <tr key={owner.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {owner.full_name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {owner.properties_count}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
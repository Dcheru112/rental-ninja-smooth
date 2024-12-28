import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import PropertyOwnerDetails from "./PropertyOwnerDetails";
import AddPropertyOwnerForm from "./AddPropertyOwnerForm";
import type { Statistics, PropertyOwner } from "./types";

interface AdminDashboardContentProps {
  statistics: Statistics;
  owners: PropertyOwner[];
  onRefresh: () => void;
}

const AdminDashboardContent = ({ statistics, owners, onRefresh }: AdminDashboardContentProps) => {
  const [selectedOwner, setSelectedOwner] = useState<PropertyOwner | null>(null);
  const [showAddOwner, setShowAddOwner] = useState(false);

  const chartData = owners.map(owner => ({
    name: owner.full_name,
    properties: owner.properties_count,
  }));

  if (selectedOwner) {
    return (
      <PropertyOwnerDetails
        ownerId={selectedOwner.id}
        ownerName={selectedOwner.full_name}
        onBack={() => setSelectedOwner(null)}
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Properties</CardTitle>
            <CardDescription>Total properties in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{statistics.totalProperties}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tenants</CardTitle>
            <CardDescription>Total active tenants</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{statistics.totalTenants}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Occupancy Rate</CardTitle>
            <CardDescription>Overall occupancy percentage</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {statistics.occupancyRate.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Property Owners</h2>
        <Button onClick={() => setShowAddOwner(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Owner
        </Button>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Properties by Owner</CardTitle>
            <CardDescription>Distribution of properties among owners</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="properties" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

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
                <tr 
                  key={owner.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => setSelectedOwner(owner)}
                >
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

      {showAddOwner && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <AddPropertyOwnerForm
              onClose={() => setShowAddOwner(false)}
              onSuccess={onRefresh}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboardContent;
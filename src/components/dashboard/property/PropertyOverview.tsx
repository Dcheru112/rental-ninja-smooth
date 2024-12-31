import { Card } from "@/components/ui/card";
import { Property } from "@/types/property";

interface PropertyOverviewProps {
  property: Property;
  tenantCount: number;
  pendingMaintenanceCount: number;
  availableUnits: number;
}

const PropertyOverview = ({
  property,
  tenantCount,
  pendingMaintenanceCount,
  availableUnits,
}: PropertyOverviewProps) => {
  const occupancyRate = ((tenantCount / property.units) * 100).toFixed(1);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-500">Total Units</h3>
        <p className="mt-2 text-3xl font-semibold">{property.units}</p>
      </Card>
      
      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-500">Available Units</h3>
        <p className="mt-2 text-3xl font-semibold">{availableUnits}</p>
      </Card>
      
      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-500">Occupancy Rate</h3>
        <p className="mt-2 text-3xl font-semibold">{occupancyRate}%</p>
      </Card>
      
      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-500">Pending Maintenance</h3>
        <p className="mt-2 text-3xl font-semibold">{pendingMaintenanceCount}</p>
      </Card>
    </div>
  );
};

export default PropertyOverview;
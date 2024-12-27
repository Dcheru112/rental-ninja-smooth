import { Property } from "@/types/property";

interface PropertyOverviewProps {
  property: Property;
  tenantCount: number;
  pendingMaintenanceCount: number;
}

const PropertyOverview = ({ property, tenantCount, pendingMaintenanceCount }: PropertyOverviewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="font-semibold mb-2">Total Units</h3>
        <p className="text-2xl">{property.units}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="font-semibold mb-2">Active Tenants</h3>
        <p className="text-2xl">{tenantCount}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="font-semibold mb-2">Pending Maintenance</h3>
        <p className="text-2xl">{pendingMaintenanceCount}</p>
      </div>
    </div>
  );
};

export default PropertyOverview;
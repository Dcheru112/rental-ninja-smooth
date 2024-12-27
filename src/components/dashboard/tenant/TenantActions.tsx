import { Home, Wrench, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TenantActionsProps {
  unitNumber: string;
  onMaintenanceClick: () => void;
  onPaymentClick: () => void;
}

const TenantActions = ({ unitNumber, onMaintenanceClick, onPaymentClick }: TenantActionsProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <div className="flex items-center space-x-2">
          <Home className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold">Your Unit</h2>
        </div>
        <p className="text-gray-600">Unit {unitNumber}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <div className="flex items-center space-x-2">
          <Wrench className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold">Maintenance</h2>
        </div>
        <p className="text-gray-600">Report maintenance issues</p>
        <Button onClick={onMaintenanceClick}>
          Submit Request
        </Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <div className="flex items-center space-x-2">
          <CreditCard className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold">Payments</h2>
        </div>
        <p className="text-gray-600">Make rent payments</p>
        <Button onClick={onPaymentClick}>
          Make Payment
        </Button>
      </div>
    </div>
  );
};

export default TenantActions;
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import MaintenanceRequestForm from "../MaintenanceRequestForm";
import PaymentForm from "../PaymentForm";

interface TenantActionsProps {
  unitNumber: string;
}

const TenantActions = ({ unitNumber }: TenantActionsProps) => {
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  return (
    <div className="grid gap-4 md:grid-cols-2 my-8">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Maintenance Request</h3>
        <p className="text-gray-600 mb-4">
          Submit a maintenance request for your unit {unitNumber}
        </p>
        <Button onClick={() => setShowMaintenanceForm(true)}>
          Submit Request
        </Button>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Make a Payment</h3>
        <p className="text-gray-600 mb-4">
          Submit your rent payment for unit {unitNumber}
        </p>
        <Button onClick={() => setShowPaymentForm(true)}>
          Make Payment
        </Button>
      </Card>

      {showMaintenanceForm && (
        <MaintenanceRequestForm
          onClose={() => setShowMaintenanceForm(false)}
        />
      )}

      {showPaymentForm && (
        <PaymentForm
          onClose={() => setShowPaymentForm(false)}
        />
      )}
    </div>
  );
};

export default TenantActions;
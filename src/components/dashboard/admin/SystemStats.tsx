import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import PaymentManagement from "./PaymentManagement";
import MaintenanceManagement from "./MaintenanceManagement";

interface SystemStatsProps {
  statistics: {
    totalProperties: number;
    totalTenants: number;
    totalMaintenanceRequests: number;
    totalPayments: number;
    pendingMaintenanceRequests: number;
    occupancyRate: number;
  };
}

const SystemStats = ({ statistics }: SystemStatsProps) => {
  const [showPayments, setShowPayments] = useState(false);
  const [showMaintenance, setShowMaintenance] = useState(false);

  const userDistributionData = [
    { name: "Properties", value: statistics.totalProperties, color: "#0EA5E9" },
    { name: "Tenants", value: statistics.totalTenants, color: "#22C55E" },
    {
      name: "Pending Requests",
      value: statistics.pendingMaintenanceRequests,
      color: "#7E69AB",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-up">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>System Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {userDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {userDistributionData.map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold" style={{ color: item.color }}>
                  {item.value}
                </div>
                <div className="text-sm text-muted-foreground">{item.name}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Occupancy Rate</span>
                <span className="text-sm font-medium">
                  {statistics.occupancyRate.toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${statistics.occupancyRate}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Maintenance Resolution</span>
                <span className="text-sm font-medium">
                  {statistics.totalMaintenanceRequests > 0
                    ? (
                        ((statistics.totalMaintenanceRequests -
                          statistics.pendingMaintenanceRequests) /
                          statistics.totalMaintenanceRequests) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-secondary rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      statistics.totalMaintenanceRequests > 0
                        ? ((statistics.totalMaintenanceRequests -
                            statistics.pendingMaintenanceRequests) /
                            statistics.totalMaintenanceRequests) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div className="pt-4">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setShowPayments(true)}
                  className="bg-accent/10 p-4 rounded-lg hover:bg-accent/20 transition-colors"
                >
                  <div className="text-lg font-semibold">
                    {statistics.totalPayments}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Payments
                  </div>
                </button>
                <button
                  onClick={() => setShowMaintenance(true)}
                  className="bg-accent/10 p-4 rounded-lg hover:bg-accent/20 transition-colors"
                >
                  <div className="text-lg font-semibold">
                    {statistics.pendingMaintenanceRequests}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Pending Requests
                  </div>
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {showPayments && <PaymentManagement onClose={() => setShowPayments(false)} />}
      {showMaintenance && (
        <MaintenanceManagement onClose={() => setShowMaintenance(false)} />
      )}
    </div>
  );
};

export default SystemStats;
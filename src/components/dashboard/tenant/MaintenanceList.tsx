interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
}

interface MaintenanceListProps {
  requests: MaintenanceRequest[];
}

const MaintenanceList = ({ requests }: MaintenanceListProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Recent Maintenance Requests</h2>
      <div className="space-y-4">
        {requests.slice(0, 5).map((request) => (
          <div key={request.id} className="border-b pb-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{request.title}</h3>
                <p className="text-gray-600">{request.description}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                request.status === 'pending' 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {request.status}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {new Date(request.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MaintenanceList;
interface Tenant {
  id: string;
  full_name: string;
  unit_number: string;
}

interface TenantsTableProps {
  tenants: Tenant[];
}

const TenantsTable = ({ tenants }: TenantsTableProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Unit
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tenants.map((tenant) => (
            <tr key={tenant.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {tenant.full_name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {tenant.unit_number}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TenantsTable;
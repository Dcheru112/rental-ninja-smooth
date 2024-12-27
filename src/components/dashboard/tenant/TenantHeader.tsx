interface TenantHeaderProps {
  propertyName: string;
  unitNumber: string;
  address: string;
}

const TenantHeader = ({ propertyName, unitNumber, address }: TenantHeaderProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-2">{propertyName}</h1>
      <p className="text-gray-600">Unit {unitNumber}</p>
      <p className="text-gray-600">{address}</p>
    </div>
  );
};

export default TenantHeader;
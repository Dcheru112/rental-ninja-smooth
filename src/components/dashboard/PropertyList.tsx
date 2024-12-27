import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Property } from "@/types/property";

interface PropertyListProps {
  properties: Property[];
  onPropertyClick?: (property: Property) => void;
}

const PropertyList = ({ properties, onPropertyClick }: PropertyListProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Property Name</TableHead>
            <TableHead className="hidden md:table-cell">Address</TableHead>
            <TableHead className="hidden md:table-cell">Units</TableHead>
            <TableHead className="hidden md:table-cell">Added On</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {properties.map((property) => (
            <TableRow 
              key={property.id}
              className={onPropertyClick ? "cursor-pointer hover:bg-gray-50" : ""}
              onClick={() => onPropertyClick?.(property)}
            >
              <TableCell className="font-medium">{property.name}</TableCell>
              <TableCell className="hidden md:table-cell">{property.address}</TableCell>
              <TableCell className="hidden md:table-cell">{property.units}</TableCell>
              <TableCell className="hidden md:table-cell">
                {new Date(property.created_at).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PropertyList;
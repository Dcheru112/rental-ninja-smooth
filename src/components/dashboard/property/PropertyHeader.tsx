import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Property } from "@/types/property";

interface PropertyHeaderProps {
  property: Property;
  onBack: () => void;
}

const PropertyHeader = ({ property, onBack }: PropertyHeaderProps) => {
  return (
    <div className="mb-6">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Properties
      </Button>
      <h1 className="text-3xl font-bold">{property.name}</h1>
      <p className="text-gray-600">{property.address}</p>
    </div>
  );
};

export default PropertyHeader;
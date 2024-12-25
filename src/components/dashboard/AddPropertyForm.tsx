import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface AddPropertyFormProps {
  onSubmit: (property: { name: string; address: string; units: number }) => void;
  onCancel: () => void;
}

const AddPropertyForm = ({ onSubmit, onCancel }: AddPropertyFormProps) => {
  const [property, setProperty] = useState({
    name: "",
    address: "",
    units: 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(property);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6 animate-fade-up">
      <h2 className="text-xl font-semibold mb-4">Add New Property</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Property Name</Label>
          <Input
            id="name"
            required
            value={property.name}
            onChange={(e) => setProperty({ ...property, name: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            required
            value={property.address}
            onChange={(e) => setProperty({ ...property, address: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="units">Number of Units</Label>
          <Input
            id="units"
            type="number"
            required
            min="1"
            value={property.units}
            onChange={(e) => setProperty({ ...property, units: parseInt(e.target.value) })}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddPropertyForm;
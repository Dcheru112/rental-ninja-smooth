import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";

interface AddPropertyOwnerFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AddPropertyOwnerForm = ({ onClose, onSuccess }: AddPropertyOwnerFormProps) => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create auth user with owner role
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: Math.random().toString(36).slice(-8), // Generate random password
        options: {
          data: {
            full_name: fullName,
            role: 'owner'
          }
        }
      });

      if (authError) throw authError;

      toast({
        title: "Success",
        description: "Property owner account created successfully. They will receive an email to set their password.",
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating property owner:", error);
      toast({
        title: "Error",
        description: "Failed to create property owner account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Add Property Owner</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Owner"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddPropertyOwnerForm;
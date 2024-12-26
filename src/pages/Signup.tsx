import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const Signup = () => {
  const [role, setRole] = useState("tenant");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignUp = async (event: any) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: role,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        toast({
          title: "Success",
          description: "Account created successfully! Please check your email to verify your account.",
        });
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="mb-6">
            <RadioGroup
              defaultValue={role}
              onValueChange={setRole}
              className="flex flex-col space-y-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="tenant" id="tenant" />
                <Label htmlFor="tenant">I am a Tenant</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="owner" id="owner" />
                <Label htmlFor="owner">I am a Property Owner</Label>
              </div>
            </RadioGroup>
          </div>

          <form onSubmit={handleSignUp} className="space-y-6">
            <div>
              <Label htmlFor="email">Email address</Label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
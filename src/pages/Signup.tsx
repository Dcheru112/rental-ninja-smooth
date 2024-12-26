import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const Signup = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("tenant");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Create your account</h2>
          <p className="mt-2 text-gray-600">
            Start managing your properties efficiently
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Select your role</Label>
            <RadioGroup
              defaultValue="tenant"
              onValueChange={setRole}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="tenant" id="tenant" />
                <Label htmlFor="tenant">Tenant</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="owner" id="owner" />
                <Label htmlFor="owner">Property Owner</Label>
              </div>
            </RadioGroup>
          </div>

          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: 'rgb(var(--color-primary))',
                    brandAccent: 'rgb(var(--color-primary))',
                  },
                  radii: {
                    borderRadiusButton: '0.5rem',
                    buttonBorderRadius: '0.5rem',
                    inputBorderRadius: '0.5rem'
                  }
                }
              },
              className: {
                button: 'bg-primary hover:bg-primary/90 text-white rounded-md px-4 py-2 w-full',
                input: 'rounded-md border px-3 py-2 w-full',
                label: 'block text-sm font-medium text-gray-700 mb-1',
                container: 'space-y-4',
              }
            }}
            providers={[]}
            view="sign_up"
            showLinks={true}
            localization={{
              variables: {
                sign_up: {
                  button_label: "Create Account",
                  email_label: "Email",
                  password_label: "Password",
                }
              }
            }}
            redirectTo={`${window.location.origin}/dashboard`}
            authOptions={{
              metaData: {
                role: role
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;
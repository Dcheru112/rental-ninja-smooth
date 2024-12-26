import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();

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
          <h2 className="text-3xl font-bold">Welcome back</h2>
          <p className="mt-2 text-gray-600">
            Sign in to your account
          </p>
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
          view="sign_in"
          showLinks={true}
          redirectTo={`${window.location.origin}/dashboard`}
          localization={{
            variables: {
              sign_in: {
                button_label: "Sign In",
                email_label: "Email",
                password_label: "Password",
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default Login;
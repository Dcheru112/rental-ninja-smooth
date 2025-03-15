
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthError, setIsAuthError] = useState(false);
  const [authErrorMessage, setAuthErrorMessage] = useState("");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        checkUserStatus(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkUserStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("status")
        .eq("id", userId)
        .single();

      if (error) throw error;

      if (data.status === "suspended") {
        // For suspended users, sign them out and show error
        await supabase.auth.signOut();
        setIsAuthError(true);
        setAuthErrorMessage("Your account has been suspended. Please contact an administrator.");
      } else {
        // For active users, navigate to dashboard
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error checking user status:", error);
      // If we can't check status, still allow login
      navigate("/dashboard");
    }
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsAuthError(false);
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // User status will be checked in the onAuthStateChange handler
      toast({
        title: "Success",
        description: "Logged in successfully!",
      });
    } catch (error: any) {
      console.error("Login error:", error);
      setIsAuthError(true);
      setAuthErrorMessage(error.message);
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
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {isAuthError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {authErrorMessage || "Authentication failed. Please try again."}
              </AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1"
              />
            </div>

            <div className="flex items-center justify-between">
              <Link
                to="/reset-password"
                className="text-sm font-medium text-primary hover:text-primary/90"
              >
                Forgot your password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

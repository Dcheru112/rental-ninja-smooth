import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@supabase/supabase-js";

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          console.log("User fetch error (expected if not logged in):", error.message);
          if (error.status === 403) {
            await handleInvalidSession();
          }
          return;
        }
        setUser(user);
      } catch (error) {
        console.error("Error in getUser:", error);
        await handleInvalidSession();
      } finally {
        setIsLoading(false);
      }
    };

    // Initialize auth state
    getUser();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      
      if (event === 'SIGNED_OUT') {
        setUser(null);
        navigate("/");
      } else if (session?.user) {
        setUser(session.user);
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleInvalidSession = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsLoading(false);
      navigate("/login");
      toast({
        title: "Session Expired",
        description: "Please sign in again to continue.",
        variant: "destructive",
      });
    } catch (error) {
      console.error("Error handling invalid session:", error);
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Signout error:", error);
        if (error.status === 403) {
          await handleInvalidSession();
          return;
        }
        throw error;
      }
      navigate("/");
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      console.error("Failed to sign out:", error);
      await handleInvalidSession();
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                className="text-xl font-semibold"
                disabled
              >
                Property Manager
              </Button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="text-xl font-semibold"
              onClick={() => navigate("/")}
            >
              Property Manager
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/dashboard")}
                >
                  Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  disabled={isLoading}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
import { ArrowRight, Building, CreditCard, MessageSquare, Users, Wrench } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: <Building className="h-6 w-6" />,
    title: "Property Management",
    description: "Easily manage multiple properties from one dashboard",
  },
  {
    icon: <CreditCard className="h-6 w-6" />,
    title: "M-Pesa Integration",
    description: "Seamless rent collection via M-Pesa",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Tenant Portal",
    description: "Give tenants access to their own secure portal",
  },
  {
    icon: <Wrench className="h-6 w-6" />,
    title: "Maintenance Requests",
    description: "Track and manage maintenance issues efficiently",
  },
  {
    icon: <MessageSquare className="h-6 w-6" />,
    title: "Communication Hub",
    description: "Stay connected with tenants and service providers",
  },
];

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-accent py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6 sm:space-y-8 animate-fade-down">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              RentalEase: Simplify Your Property Management in Kenya
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto text-gray-100">
              Streamline your rental property management with our all-in-one
              solution designed for Kenyan property owners.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/signup"
                className="bg-white text-primary px-6 sm:px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/features"
                className="bg-primary/20 text-white px-6 sm:px-8 py-3 rounded-md font-semibold hover:bg-primary/30 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Everything You Need to Manage Your Properties
            </h2>
            <p className="mt-4 text-lg sm:text-xl text-gray-600">
              Powerful features designed to make property management effortless
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-primary rounded-2xl p-6 sm:p-8 md:p-16 text-center text-white">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Ready to Simplify Your Property Management?
            </h2>
            <p className="text-lg sm:text-xl mb-8 text-gray-100">
              Join thousands of property owners who trust RentalEase
            </p>
            <Link
              to="/signup"
              className="bg-white text-primary px-6 sm:px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
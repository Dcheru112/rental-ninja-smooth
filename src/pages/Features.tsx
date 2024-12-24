import { Building, CreditCard, MessageSquare, Users, Wrench } from "lucide-react";

const features = [
  {
    icon: <Building className="h-12 w-12" />,
    title: "Property Management",
    description:
      "Manage multiple properties effortlessly from a single dashboard. Track occupancy, lease agreements, and property maintenance with ease.",
  },
  {
    icon: <CreditCard className="h-12 w-12" />,
    title: "M-Pesa Integration",
    description:
      "Seamless rent collection through M-Pesa integration. Automated payment tracking and instant confirmation for both landlords and tenants.",
  },
  {
    icon: <Users className="h-12 w-12" />,
    title: "Tenant Portal",
    description:
      "Provide tenants with their own secure portal to pay rent, submit maintenance requests, and communicate directly with property management.",
  },
  {
    icon: <Wrench className="h-12 w-12" />,
    title: "Maintenance Management",
    description:
      "Streamline maintenance requests with our digital ticketing system. Track repairs, assign tasks, and keep tenants updated on progress.",
  },
  {
    icon: <MessageSquare className="h-12 w-12" />,
    title: "Communication Hub",
    description:
      "Centralized communication platform for property managers, tenants, and service providers. Keep everyone in the loop with instant notifications.",
  },
];

const Features = () => {
  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Powerful Features for Property Management
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Everything you need to manage your properties efficiently
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                <div className="h-20 w-20 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
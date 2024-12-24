import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PricingPage = () => {
  const navigate = useNavigate();
  
  const tiers = [
    {
      name: "Basic",
      price: "KSH 2,000",
      description: "Perfect for managing a single property",
      features: [
        "Single property management",
        "Basic tenant management",
        "Rent collection",
        "Maintenance requests",
        "Email support",
      ],
    },
    {
      name: "Pro",
      price: "KSH 5,000",
      description: "Ideal for multiple properties",
      features: [
        "Up to 5 properties",
        "Advanced tenant management",
        "Automated rent collection",
        "Priority maintenance",
        "24/7 phone support",
        "Financial reporting",
      ],
    },
    {
      name: "Premium",
      price: "KSH 10,000",
      description: "Complete solution for property portfolios",
      features: [
        "Unlimited properties",
        "Advanced analytics",
        "Custom reporting",
        "Dedicated account manager",
        "API access",
        "White-label option",
      ],
    },
  ];

  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">
            Pricing
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Choose the right plan for you
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
          Simple, transparent pricing that grows with your business.
        </p>
        
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier, index) => (
            <div
              key={tier.name}
              className={`flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10 ${
                index === 1 ? "lg:z-10 lg:rounded-b-none" : ""
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-x-4">
                  <h3 className="text-lg font-semibold leading-8 text-gray-900">
                    {tier.name}
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-600">
                  {tier.description}
                </p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">
                    {tier.price}
                  </span>
                  <span className="text-sm font-semibold leading-6 text-gray-600">
                    /month
                  </span>
                </p>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <Check className="h-6 w-5 flex-none text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                className="mt-8"
                onClick={() => navigate("/signup")}
              >
                Get started
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
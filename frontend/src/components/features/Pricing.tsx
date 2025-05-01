import { Button } from "../ui/button";

interface PricingPlanProps {
  title: string;
  price: string;
  features: string[];
  isPopular?: boolean;
  buttonText: string;
  description: string;
}

const PricingPlan: React.FC<PricingPlanProps> = ({
  title,
  price,
  features,
  isPopular,
  buttonText,
  description,
}) => (
  <div
    className={`rounded-lg p-8 bg-card shadow-lg relative transition-all duration-300 hover:scale-105 ${
      isPopular ? "ring-2 ring-primary" : ""
    }`}
  >
    {isPopular && (
      <span className="absolute -top-4 right-8 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm shadow-lg">
        Popular
      </span>
    )}
    <h3 className="text-2xl font-bold text-foreground">{title}</h3>
    <p className="text-muted-foreground mt-2">{description}</p>
    <div className="mt-4">
      <span className="text-4xl font-bold text-foreground">{price}</span>
      {price !== "$0" && <span className="text-muted-foreground">/month</span>}
    </div>
    <ul className="mt-6 space-y-4">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center text-foreground">
          <svg
            className={`h-5 w-5 ${
              isPopular ? "text-primary" : "text-green-500"
            } mr-2`}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M5 13l4 4L19 7"></path>
          </svg>
          {feature}
        </li>
      ))}
    </ul>
    <Button
      className={`w-full mt-8 transition-all duration-300 ${
        isPopular
          ? "bg-primary hover:bg-primary/90"
          : "hover:bg-primary hover:text-primary-foreground"
      }`}
      variant={isPopular ? "default" : "outline"}
    >
      {buttonText}
    </Button>
  </div>
);

export function Pricing() {
  return (
    <section className="mt-20 py-20" id="pricing">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground">
          Simple, Transparent Pricing
        </h2>
        <p className="mt-4 text-muted-foreground">
          Choose the plan that's right for you
        </p>
      </div>
      <div className="mt-16 grid md:grid-cols-2 gap-8 max-w-5xl mx-auto px-4">
        <PricingPlan
          title="Free"
          price="$0"
          description="For personal use"
          features={[
            "Basic URL shortening",
            "Basic click tracking",
            "Standard support",
          ]}
          buttonText="Current Plan"
        />
        <PricingPlan
          title="Premium"
          price="$9.99"
          description="For professionals"
          features={[
            "All Free features, plus:",
            "QR code generation",
            "Advanced analytics",
            "Custom URLs",
            "Priority support",
          ]}
          buttonText="Upgrade Now"
          isPopular
        />
      </div>
    </section>
  );
}

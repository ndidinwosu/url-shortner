import { Star } from "lucide-react";
import { Card, CardContent } from "../ui/card";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Digital Marketing Manager",
    company: "TechCorp",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    quote:
      "ShortKing has revolutionized how we manage our marketing campaigns. The analytics are invaluable!",
  },
  {
    name: "Michael Chen",
    role: "Content Creator",
    company: "CreativeHub",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    quote:
      "The QR code feature is a game-changer for my offline to online content strategy.",
  },
  {
    name: "Emily Rodriguez",
    role: "Social Media Manager",
    company: "SocialBoost",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    quote:
      "Custom URLs have helped us maintain brand consistency across all platforms.",
  },
];

const stats = [
  { number: "1M+", label: "Links Created" },
  { number: "50K+", label: "Active Users" },
  { number: "100M+", label: "Total Clicks" },
  { number: "99.9%", label: "Uptime" },
];

export function SocialProof() {
  return (
    <section className="mt-20 py-16 w-full">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-3xl font-bold">Trusted by Thousands</h2>
        <p className="text-muted-foreground">
          Join the growing community of satisfied ShortKing users
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-3xl font-bold text-primary">{stat.number}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.name} className="overflow-hidden">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-muted-foreground">{testimonial.quote}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

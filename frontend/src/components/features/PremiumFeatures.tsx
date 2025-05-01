import { QrCode, LineChart, Clock, Link2, Crown } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { useTheme } from "../../contexts/theme-context";
import { motion } from "framer-motion";

const features = [
  {
    icon: <QrCode className="h-6 w-6 text-blue-500" />,
    title: "QR Code Generation",
    description:
      "Generate QR codes for your shortened URLs instantly. Perfect for print materials and physical displays.",
  },
  {
    icon: <LineChart className="h-6 w-6 text-green-500" />,
    title: "Advanced Analytics",
    description:
      "Get detailed insights into your links' performance with comprehensive click tracking and analytics.",
  },
  {
    icon: <Clock className="h-6 w-6 text-yellow-500" />,
    title: "Custom Expiry Dates",
    description:
      "Set expiration dates for your links to create urgency or ensure temporary access.",
  },
  {
    icon: <Link2 className="h-6 w-6 text-purple-500" />,
    title: "Custom URLs",
    description:
      "Create branded, memorable links with custom aliases that reflect your brand or campaign.",
  },
];

const cardVariants = {
  initial: {
    opacity: 0,
    y: 50,
  },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -50,
    transition: {
      duration: 0.8,
      ease: "easeIn",
    },
  },
};

const containerVariants = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

export function PremiumFeatures() {
  const { theme } = useTheme();

  return (
    <section className="mt-12 sm:mt-20 py-8 sm:py-16 w-full">
      <motion.div
        className="text-center space-y-4 mb-8 sm:mb-12"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        viewport={{
          once: false,
          amount: 0.1,
          margin: "0px",
        }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
      >
        <div className="flex items-center justify-center gap-2">
          <motion.div
            initial={{ rotate: -180, opacity: 0 }}
            whileInView={{ rotate: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Crown className="h-6 w-6 text-yellow-500" />
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-bold">Upgrade to Premium</h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Get access to powerful features that help you manage, track, and
          optimize your shortened URLs.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12"
        variants={containerVariants}
        initial="initial"
        whileInView="whileInView"
        viewport={{
          once: false,
          amount: 0.1,
          margin: "0px",
        }}
      >
        {features.map((feature) => (
          <motion.div
            key={feature.title}
            variants={cardVariants}
            viewport={{
              once: false,
              amount: 0.1,
            }}
          >
            <Card className="group hover:shadow-lg transition-all duration-200">
              <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <motion.div
                  className="rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-primary/5"
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-lg sm:text-xl font-semibold">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

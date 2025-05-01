import { PremiumFeatures } from "../features/PremiumFeatures";
import { SocialProof } from "../features/SocialProof";
import { URLShortenerForm } from "../url-shortener-form";
import { Footer } from "../layout/Footer";
import { Pricing } from "../features/Pricing";
import { Team } from "../features/Team";
import { FAQ } from "../features/FAQ";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Container } from "../layout/Container";

const fadeInUp = {
  initial: { opacity: 0, y: 50 },
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

const staggerContainer = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const scrollHintVariants = {
  initial: { opacity: 0, y: -10 },
  animate: {
    opacity: [0, 1, 1, 0],
    y: [0, 10, 10, 20],
    transition: {
      duration: 2,
      ease: "easeInOut",
      repeat: Infinity,
      times: [0, 0.2, 0.8, 1],
    },
  },
};

export function LandingPage() {
  return (
    <>
      <Container>
        <motion.section
          className="py-12 sm:py-16 md:py-20 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          <motion.div
            className="text-center space-y-4 sm:space-y-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
          >
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground"
              variants={fadeInUp}
            >
              Shorten Your Links,{" "}
              <span className="text-primary">Expand Your Reach</span>
            </motion.h1>
            <motion.p
              className="text-base sm:text-lg md:text-xl text-foreground/80 max-w-md sm:max-w-xl md:max-w-2xl mx-auto"
              variants={fadeInUp}
            >
              Transform long URLs into concise, shareable links. Track clicks,
              customize your links, and boost your online presence.
            </motion.p>
          </motion.div>
          <motion.div
            className="mt-8 sm:mt-10 md:mt-12 max-w-md sm:max-w-lg md:max-w-2xl mx-auto"
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            <URLShortenerForm />
          </motion.div>

          <motion.div
            className="absolute w-full flex flex-col items-center mt-16 sm:mt-20 mb-4 text-foreground/60"
            variants={scrollHintVariants}
            initial="initial"
            animate="animate"
          >
            <p className="text-sm mb-2">Scroll to explore more</p>
            <ChevronDown className="h-6 w-6" />
          </motion.div>
        </motion.section>

        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="whileInView"
          exit="exit"
          viewport={{
            once: false,
            amount: 0.1,
            margin: "0px",
          }}
          className="rounded-xl p-4 sm:p-6 md:p-8 my-8 md:my-12 lg:my-16"
        >
          <PremiumFeatures />
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="whileInView"
          exit="exit"
          viewport={{
            once: false,
            amount: 0.1,
            margin: "0px",
          }}
          className="rounded-xl p-4 sm:p-6 md:p-8 my-8 md:my-12 lg:my-16"
        >
          <SocialProof />
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="whileInView"
          exit="exit"
          viewport={{
            once: false,
            amount: 0.1,
            margin: "0px",
          }}
          className="rounded-xl p-4 sm:p-6 md:p-8 my-8 md:my-12 lg:my-16"
        >
          <Pricing />
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="whileInView"
          exit="exit"
          viewport={{
            once: false,
            amount: 0.1,
            margin: "0px",
          }}
          className="rounded-xl p-4 sm:p-6 md:p-8 my-8 md:my-12 lg:my-16"
        >
          <Team />
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="whileInView"
          exit="exit"
          viewport={{
            once: false,
            amount: 0.1,
            margin: "0px",
          }}
          className="rounded-xl p-4 sm:p-6 md:p-8 my-8 md:my-12 lg:my-16"
        >
          <FAQ />
        </motion.div>
      </Container>
      <Footer />
    </>
  );
}

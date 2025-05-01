import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const faqs = [
    {
      question: "What is URL shortening?",
      answer:
        "URL shortening is a technique that converts long URLs into shorter, more manageable links. These shortened links redirect to the original URL when accessed, making them easier to share on social media, in messages, or anywhere character count matters.",
    },
    {
      question: "How secure are the shortened URLs?",
      answer:
        "Our shortened URLs are completely secure. We use HTTPS encryption for all links and regularly monitor for any suspicious activity. We also provide detailed analytics so you can track who's accessing your links.",
    },
    {
      question: "Can I customize my shortened URLs?",
      answer:
        "Yes! Premium users can create custom URLs that are more memorable and branded. Instead of random characters, you can choose your own custom text to make the links more meaningful and professional.",
    },
    {
      question: "How long do shortened URLs last?",
      answer:
        "Free shortened URLs are permanent and will not expire. Premium users have additional features to set expiration dates for their links if desired for temporary campaigns or time-sensitive content.",
    },
    {
      question: "What analytics do you provide?",
      answer:
        "We provide comprehensive analytics including click counts, geographic location of visitors, referral sources, and device types. Premium users get access to advanced analytics with detailed insights and custom reporting options.",
    },
  ];

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <section className="py-20" id="faq">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleItem(index)}
                className="w-full flex justify-between items-center p-4 text-left"
                data-testid={`faq-question-${index}`}
              >
                <span
                  className={`font-medium ${
                    openItems.includes(index) ? "text-primary" : ""
                  }`}
                >
                  {faq.question}
                </span>
                <ChevronDown
                  className={`transform transition-transform ${
                    openItems.includes(index) ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openItems.includes(index) && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="p-4 bg-muted/50"
                      data-testid={`faq-answer-${index}`}
                    >
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

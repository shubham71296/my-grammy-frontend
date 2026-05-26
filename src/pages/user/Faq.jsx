import { useState } from "react";
import { ChevronDown, CircleHelp } from "lucide-react";
import { PageShell, PagePanel } from "../../components/ui/tw/PageShell";
import { cn } from "../../lib/cn";

const faqData = [
  {
    question: "What is Grammy?",
    answer:
      "Grammy is a platform where you can explore musical instruments and enroll in high-quality music courses.",
  },
  {
    question: "How do I purchase a course?",
    answer:
      "Simply browse courses, add them to your cart, and complete the checkout process securely.",
  },
  {
    question: "Are courses free with instruments?",
    answer:
      "Yes! Some courses are automatically added for free when you purchase a related instrument.",
  },
  {
    question: "Can I access my courses anytime?",
    answer:
      "Absolutely. Once purchased, your courses are available anytime from your dashboard.",
  },
  {
    question: "How can I contact support?",
    answer:
      "You can reach us through the Contact page or email our support team anytime.",
  },
];

function FaqItem({ question, answer, open, onToggle }) {
  return (
    <div className="mb-2 overflow-hidden rounded-xl bg-white shadow-md">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-2 bg-white px-4 py-3 text-left font-semibold text-slate-800"
      >
        {question}
        <ChevronDown className={cn("h-5 w-5 shrink-0 transition", open && "rotate-180")} />
      </button>
      {open && (
        <div className="border-t border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          {answer}
        </div>
      )}
    </div>
  );
}

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <PageShell narrow className="bg-slate-100">
      <div className="mb-6 rounded-2xl bg-gradient-to-br from-brand-600 to-sky-400 p-6 text-center text-white shadow-lg sm:p-8">
        <CircleHelp className="mx-auto mb-2 h-12 w-12" />
        <h1 className="text-2xl font-bold sm:text-3xl">Frequently Asked Questions</h1>
        <p className="mt-2 text-sm opacity-90 sm:text-base">
          Find answers to common questions about Grammy
        </p>
      </div>

      <PagePanel>
        {faqData.map((faq, index) => (
          <FaqItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            open={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? null : index)}
          />
        ))}
      </PagePanel>
    </PageShell>
  );
};

export default Faq;

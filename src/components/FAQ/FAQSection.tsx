
import React, { useState } from "react";
import Container from "@/components/UI/Container";
import { Plus, Minus } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      question: "How can I get involved?",
      answer: "There are many ways to get involved with JUSTMOVE! You can volunteer for our community programs, participate in advocacy campaigns, attend our events, or contribute to our initiatives. Sign up for our newsletter to stay informed about upcoming opportunities and join our community of changemakers."
    },
    {
      question: "How are donations used?",
      answer: "Your donations directly support our mission for urban mobility justice. Funds are allocated to community programs, advocacy initiatives, educational resources, and operational costs. We maintain full transparency in our financial reporting and ensure that donations are used effectively to create maximum impact."
    },
    {
      question: "Do you offer internships?",
      answer: "Yes! We offer internship opportunities throughout the year for students and young professionals passionate about social justice and urban mobility. Our internships provide hands-on experience in advocacy, community organizing, research, and program development."
    },
    {
      question: "How can I request support?",
      answer: "If you or your community needs support with urban mobility justice issues, please reach out through our support request form on our website. Our team will review your request and connect you with appropriate resources or assistance programs."
    },
    {
      question: "How can I report a social justice issue?",
      answer: "You can report social justice issues related to urban mobility through our secure online reporting system. We take all reports seriously and work with relevant stakeholders to address concerns while maintaining confidentiality when requested."
    }
  ];

  const toggle = (index: number) => setOpenIndex(openIndex === index ? null : index);

  return (
    <section className="py-24 bg-white">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-lg">
              <span className="text-blue-600 font-medium text-sm">FAQ</span>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Answers to Your <span className="text-blue-600">Burning Questions</span>
          </h2>
          <div className="space-y-4">
            {faqItems.map((item, idx) => (
              <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                  onClick={() => toggle(idx)}
                >
                  <span className="text-xl font-medium text-gray-900">
                    {item.question}
                  </span>
                  <span className="ml-6 flex-shrink-0">
                    {openIndex === idx ? (
                      <Minus className="h-6 w-6 text-blue-600" />
                    ) : (
                      <Plus className="h-6 w-6 text-blue-600" />
                    )}
                  </span>
                </button>
                {openIndex === idx && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 text-lg">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default FAQSection;

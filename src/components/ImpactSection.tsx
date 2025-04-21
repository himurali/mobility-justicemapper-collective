
import React from "react";
import {
  Scale,
  FileSpreadsheet,
  Network,
  Brain,
  Factory,
  Building2,
  Users2,
  Vote,
} from "lucide-react";

const impactSteps = [
  {
    number: "01",
    title: "The Demands of Justice",
    subtitle: "Understanding community's mobility transformation needs",
    description:
      "We begin by deeply understanding the community's needs and aspirations for mobility justice, ensuring our approach is grounded in real experiences and challenges.",
    bgColor: "bg-primary-50",
    icon: Scale,
    iconColor: "text-primary-600",
  },
  {
    number: "02",
    title: "VIX Plan Development",
    subtitle: "Vision, Implementation, and Execution Planning",
    description:
      "Creating comprehensive strategies that bridge current mobility gaps while building towards a more equitable and accessible transportation future.",
    bgColor: "bg-primary-600",
    icon: FileSpreadsheet,
    iconColor: "text-white",
    textColor: "text-white",
  },
  {
    number: "03",
    title: "Community Chaining",
    subtitle: "Community's analytical approach to mobility",
    description:
      "Implementing systematic approaches to analyze and address mobility challenges, ensuring solutions are both practical and sustainable.",
    bgColor: "bg-secondary-50",
    icon: Network,
    iconColor: "text-primary-600",
  },
  {
    number: "04",
    title: "Forms of Reasoning",
    subtitle: "Analytical framework for mobility justice",
    description:
      "Developing robust analytical frameworks that help us understand and address complex mobility challenges in our communities.",
    bgColor: "bg-primary-600",
    icon: Brain,
    iconColor: "text-white",
    textColor: "text-white",
  },
  {
    number: "05",
    title: "Community Production",
    subtitle: "Physical and social infrastructure development",
    description:
      "Building and maintaining the physical and social infrastructure needed to support equitable mobility solutions.",
    bgColor: "bg-primary-50",
    icon: Factory,
    iconColor: "text-primary-600",
  },
  {
    number: "06",
    title: "The Materials of Justice",
    subtitle: "Resources for sustainable mobility",
    description:
      "Identifying and mobilizing the resources needed to create lasting positive change in urban mobility systems.",
    bgColor: "bg-secondary-500",
    icon: Building2,
    iconColor: "text-primary-600",
    textColor: "text-primary-600",
  },
  {
    number: "07",
    title: "Public Reasoning",
    subtitle: "Collaborative decision-making processes",
    description:
      "Fostering inclusive dialogue and decision-making processes that ensure all voices are heard and considered.",
    bgColor: "bg-primary-50",
    icon: Users2,
    iconColor: "text-primary-600",
  },
  {
    number: "08",
    title: "Democracy in Action",
    subtitle: "Community engagement and participation",
    description:
      "Empowering communities to actively participate in shaping their mobility future through democratic processes and collective action.",
    bgColor: "bg-primary-600",
    icon: Vote,
    iconColor: "text-white",
    textColor: "text-white",
  },
];

const ImpactSection: React.FC = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Our Approach to{" "}
            <span className="text-primary-600">Mobility Justice</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A systematic framework for understanding and implementing mobility justice in our communities.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {impactSteps.map((step, index) => (
            <div
              key={index}
              className={`${step.bgColor} rounded-2xl p-8 transition-transform hover:scale-[1.02] duration-300`}
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <span className={`text-4xl font-bold ${step.textColor || 'text-gray-900'}`}>
                    {step.number}
                  </span>
                </div>
                <div className="flex-grow">
                  <h3 className={`text-2xl font-semibold mb-2 ${step.textColor || 'text-gray-900'}`}>
                    {step.title}
                  </h3>
                  <p className={`text-lg font-medium mb-2 ${step.textColor ? 'text-white/90' : 'text-primary-600'}`}>
                    {step.subtitle}
                  </p>
                  <p className={`text-base ${step.textColor ? 'text-white/80' : 'text-gray-600'}`}>
                    {step.description}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className={`p-4 rounded-full ${step.textColor ? 'bg-white/10' : 'bg-white'}`}>
                    <step.icon className={`w-8 h-8 ${step.iconColor}`} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default ImpactSection;

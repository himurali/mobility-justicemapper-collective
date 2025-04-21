
import React from "react";
import Container from "./UI/Container";
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
    bgColor: "bg-[#E5DEFF]",
    icon: Scale,
    iconBg: "bg-white",
    textColor: "text-[#221F26]",
    subtitleColor: "text-[#7E69AB]",
    iconColor: "text-[#7E69AB]",
    fontWeight: "font-bold"
  },
  {
    number: "02",
    title: "VIX Plan Development",
    subtitle: "Vision, Implementation, and Execution Planning",
    description:
      "Creating comprehensive strategies that bridge current mobility gaps while building towards a more equitable and accessible transportation future.",
    bgColor: "bg-[#7E69AB]",
    icon: FileSpreadsheet,
    iconBg: "bg-white/20",
    textColor: "text-white",
    subtitleColor: "text-[#D6BCFA]",
    iconColor: "text-white",
    fontWeight: "font-bold"
  },
  {
    number: "03",
    title: "Community Chaining",
    subtitle: "Community's analytical approach to mobility",
    description:
      "Implementing systematic approaches to analyze and address mobility challenges, ensuring solutions are both practical and sustainable.",
    bgColor: "bg-[#FEF7CD]",
    icon: Network,
    iconBg: "bg-white",
    textColor: "text-[#221F26]",
    subtitleColor: "text-[#B2890D]",
    iconColor: "text-[#B2890D]",
    fontWeight: "font-bold"
  },
  {
    number: "04",
    title: "Forms of Reasoning",
    subtitle: "Analytical framework for mobility justice",
    description:
      "Developing robust analytical frameworks that help us understand and address complex mobility challenges in our communities.",
    bgColor: "bg-[#7E69AB]",
    icon: Brain,
    iconBg: "bg-white/20",
    textColor: "text-white",
    subtitleColor: "text-[#D6BCFA]",
    iconColor: "text-white",
    fontWeight: "font-bold"
  },
  {
    number: "05",
    title: "Community Production",
    subtitle: "Physical and social infrastructure development",
    description:
      "Building and maintaining the physical and social infrastructure needed to support equitable mobility solutions.",
    bgColor: "bg-[#E5DEFF]",
    icon: Factory,
    iconBg: "bg-white",
    textColor: "text-[#221F26]",
    subtitleColor: "text-[#7E69AB]",
    iconColor: "text-[#7E69AB]",
    fontWeight: "font-bold"
  },
  {
    number: "06",
    title: "The Materials of Justice",
    subtitle: "Resources for sustainable mobility",
    description:
      "Identifying and mobilizing the resources needed to create lasting positive change in urban mobility systems.",
    bgColor: "bg-[#FDE1D3]",
    icon: Building2,
    iconBg: "bg-white",
    textColor: "text-[#B15C2D]",
    subtitleColor: "text-[#B15C2D]",
    iconColor: "text-[#B15C2D]",
    fontWeight: "font-bold"
  },
  {
    number: "07",
    title: "Public Reasoning",
    subtitle: "Collaborative decision-making processes",
    description:
      "Fostering inclusive dialogue and decision-making processes that ensure all voices are heard and considered.",
    bgColor: "bg-[#E5DEFF]",
    icon: Users2,
    iconBg: "bg-white",
    textColor: "text-[#221F26]",
    subtitleColor: "text-[#7E69AB]",
    iconColor: "text-[#7E69AB]",
    fontWeight: "font-bold"
  },
  {
    number: "08",
    title: "Democracy in Action",
    subtitle: "Community engagement and participation",
    description:
      "Empowering communities to actively participate in shaping their mobility future through democratic processes and collective action.",
    bgColor: "bg-[#7E69AB]",
    icon: Vote,
    iconBg: "bg-white/20",
    textColor: "text-white",
    subtitleColor: "text-[#D6BCFA]",
    iconColor: "text-white",
    fontWeight: "font-bold"
  },
];

const ImpactSection: React.FC = () => {
  return (
    <section className="py-24 bg-[#F1F0FB]">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Our Approach to{" "}
            <span className="text-[#7E69AB]">Mobility Justice</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A systematic framework for understanding and implementing mobility justice in our communities.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {impactSteps.map((step, index) => (
            <div
              key={index}
              className={`${step.bgColor} rounded-2xl p-8 flex flex-col shadow-md transition-transform hover:scale-[1.02] duration-300 h-full`}
            >
              <div className="flex items-start gap-6 w-full h-full">
                <span className={`text-4xl md:text-5xl ${step.fontWeight} mr-2 mt-1 ${step.textColor}`}>
                  {step.number}
                </span>
                <div className="flex-grow flex flex-col min-w-0">
                  <div className="flex items-start gap-2">
                    <h3 className={`text-2xl md:text-2xl font-bold leading-snug mb-0.5 ${step.textColor} mr-1`}>
                      {step.title}
                    </h3>
                  </div>
                  <p className={`text-base md:text-lg font-semibold mb-2 mt-1 ${step.subtitleColor}`}>
                    {step.subtitle}
                  </p>
                  <p className={`text-base mt-1 ${step.textColor === "text-white" ? "text-white/85" : "text-[#555]"} `}>
                    {step.description}
                  </p>
                </div>
                <div className={`flex-shrink-0 ml-3 flex items-center`}>
                  <div className={`p-4 rounded-full ${step.iconBg} flex items-center justify-center`}>
                    <step.icon className={`w-8 h-8 ${step.iconColor}`} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default ImpactSection;

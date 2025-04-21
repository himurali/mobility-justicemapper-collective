import React from "react";
import Container from "@/components/ui/container"; 
import { Button } from "@/components/ui/button";

const CardsSection: React.FC = () => {
  const cards = [
    {
      title: "Driving Change, Transforming Lives",
      description:
        "Our mission is simple: to champion social justice and human rights for all. We are dedicated to creating a world where every individual is treated with dignity, fairness, and respect.",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      type: "text",
    },
    {
      image: "https://images.pexels.com/photos/2990644/pexels-photo-2990644.jpeg",
      title: "Community in Action",
      description: "Join us in our mission to create positive change in urban mobility.",
      bgColor: "bg-amber-50",
      textColor: "text-amber-700",
      type: "image",
    },
    {
      title: "A World of Equity and Opportunity",
      description:
        "Our vision is to build a future where equity and opportunity are not just ideals, but realities for every person, regardless of race, gender, ethnicity, or socioeconomic status.",
      bgColor: "bg-rose-50",
      textColor: "text-rose-600",
      type: "text",
    },
    {
      image: "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg",
      title: "Empowering Communities",
      description:
        "Through grassroots initiatives and community engagement, we're building stronger, more resilient neighborhoods that support sustainable transportation solutions.",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
      type: "image",
    },
    {
      title: "Building Partnerships",
      description:
        "Success comes through collaboration. We partner with organizations, governments, and communities to create lasting positive change in urban mobility.",
      bgColor: "bg-cyan-50",
      textColor: "text-cyan-600",
      type: "text",
    },
    {
      image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg",
      title: "Sustainable Solutions",
      description:
        "Our approach combines environmental responsibility with social justice, ensuring that mobility solutions benefit both people and planet.",
      bgColor: "bg-teal-50",
      textColor: "text-teal-600",
      type: "image",
    },
    {
      title: "Education & Awareness",
      description:
        "Knowledge is power. We provide resources and training to help communities understand and advocate for their transportation rights.",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
      type: "text",
    },
    {
      image: "https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg",
      title: "Collaborative Impact",
      description:
        "Together, we're making transportation accessible for everyone.",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      type: "image",
    },
    {
      title: "Measuring Impact",
      description:
        "We believe in accountability and transparency. Through data-driven analysis, we track and share the real-world impact of our initiatives.",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600",
      type: "text",
    }
  ];

  const renderCard = (card: any, index: number) => {
    if (card.type === "image") {
      return (
        <div
          key={index}
          className={`${card.bgColor} rounded-2xl overflow-hidden transition-transform hover:scale-105 duration-300 shadow-lg`}
        >
          <div className="h-48 overflow-hidden">
            <img
              src={card.image}
              alt={card.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6">
            <h3 className={`${card.textColor} text-xl font-semibold mb-2`}>
              {card.title}
            </h3>
            <p className="text-gray-700">
              {card.description}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div
        key={index}
        className={`${card.bgColor} rounded-2xl p-8 transition-transform hover:scale-105 duration-300`}
      >
        <h3 className={`${card.textColor} text-xl font-semibold mb-4`}>
          {card.title}
        </h3>
        <p className="text-gray-700">
          {card.description}
        </p>
      </div>
    );
  };

  return (
    <section className="py-24 bg-white">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Uniting Hearts, <span className="text-blue-600">Changing Lives</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Together, we're building a movement for equitable urban mobility and social justice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, index) => renderCard(card, index))}
        </div>
      </Container>
    </section>
  );
};

export default CardsSection;

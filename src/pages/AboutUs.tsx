import React from "react";
import { Link } from "react-router-dom";
import { Users, Info, Building2 } from "lucide-react";
import Container from "@/components/UI/Container";
import Header from "@/components/Header";

// Stats, milestones, and highlights remain unchanged
const stats = [
  {
    label: "Years Experience",
    value: "25",
    icon: <Info className="text-primary w-7 h-7" />,
  },
  {
    label: "Total Volunteers",
    value: "9,850+",
    icon: <Users className="text-primary w-7 h-7" />,
  },
  {
    label: "Success Cases",
    value: "9,080+",
    icon: <Building2 className="text-primary w-7 h-7" />,
  },
  {
    label: "People Helped",
    value: "23k+",
    icon: <Users className="text-primary w-7 h-7" />,
  },
];

const milestones = [
  "Early Initiatives.",
  "Expansion.",
  "Global Reach.",
  "Recognition.",
];

const highlights = [
  "Over 5,000 children have benefited.",
  "Planting of over 200,000 trees worldwide.",
  "Installed over 100 water filtration systems.",
  "Successfully provided emergency aid to thousands of families.",
];

const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8F9ED] text-gray-900 flex flex-col">
      <Header />
      {/* Hero Section */}
      <div className="relative w-full">
        {/* Green angled background */}
        <div
          className="absolute top-0 left-0 w-full h-[260px] md:h-[320px] z-0"
          style={{
            background: "#14b85a",
            clipPath:
              "polygon(0 0, 100% 0, 100% 73%, 0 100%)",
          }}
        />
        <Container>
          <nav
            className="relative z-10 flex justify-end md:justify-start pt-4 pb-3 text-white text-base font-medium"
            aria-label="Breadcrumb"
          >
            <Link
              to="/"
              className="hover:underline transition text-white opacity-90"
            >
              Home
            </Link>
            <span className="mx-2 opacity-75">{">"}</span>
            <span className="font-semibold">About Us</span>
          </nav>
          {/* Page Hero Image */}
          <div className="relative z-10 flex justify-center mt-4 mb-0">
            <img
              src="/lovable-uploads/258426fb-1adf-4cdb-a772-3637cad8223b.png"
              alt="About Us team"
              className="rounded-xl shadow-xl w-full max-w-4xl object-cover border-8 border-white min-h-[320px] max-h-[420px]"
              style={{
                background: "#fff",
              }}
            />
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <Container>
        <section className="mt-0 mb-8 flex flex-col items-center animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-extrabold mt-12 mb-5 text-gray-900 text-center" style={{ fontFamily: "Libre Baskerville, serif" }}>
            Dedicated to Transforming Lives Worldwide
          </h1>
          <p className="text-lg md:text-xl max-w-3xl text-center mb-6 text-gray-800 font-normal">
            At <span className="font-semibold">JUSTMOVE</span>, we are a passionate community of changemakers committed to building a better future for underserved populations. We work tirelessly across borders, cultures, and communities to create sustainable solutions in education, healthcare, disaster relief, environmental conservation, and social empowerment. Our belief in the power of community drives every initiative we undertake, ensuring that every voice is heard and every life is valued.
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-6 mb-2 text-center">Inspiring Change for a Brighter Tomorrow</h2>
        </section>
        <section className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-primary mb-3">Our Mission</h3>
            <p className="mb-6">
              We strive to empower communities by providing essential resources, innovative programs, and compassionate support. Our goal is to break down barriers to opportunity, enabling individuals to lead healthier, more educated, and fulfilled lives.
            </p>
            <h3 className="text-xl md:text-2xl font-bold text-primary mb-3">Our Vision</h3>
            <p>
              Imagine a world where every person has access to quality education, clean water, healthcare, and opportunities for growth. We envision a future where communities thrive through resilience, collaboration, and sustainable practices.
            </p>
          </div>
          <div className="flex flex-col gap-6 md:justify-center">
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-6 md:gap-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow p-6 text-center flex flex-col items-center justify-center hover:scale-105 transition-transform border">
                  <div className="mb-2">{stat.icon}</div>
                  <span className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</span>
                  <span className="text-gray-600 text-sm font-medium">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="my-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">From Humble Beginnings to Global Impact</h3>
          <p className="mb-6">
            Founded in 1998, <span className="font-semibold">JUSTMOVE</span> began as a grassroots effort by a small group of passionate individuals determined to make a difference. What started as local community support has now evolved into a global movement dedicated to fostering lasting change.
          </p>
          <div className="mb-6">
            <h4 className="text-xl font-medium text-primary mb-2">Milestones Along Our Journey:</h4>
            <ul className="list-disc list-inside space-y-1 ml-4">
              {milestones.map((milestone, idx) => (
                <li key={idx}>{milestone}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-medium text-primary mb-2">Highlights of Our Achievements:</h4>
            <ul className="list-disc list-inside space-y-1 ml-4">
              {highlights.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
        <div className="mt-10 pb-16">
          <h4 className="text-xl font-semibold text-primary mb-3">Changemaker Volunteers</h4>
          <p className="max-w-prose">
            Our dedicated volunteers are the heart of our movement. Through collective action, skills, and compassion, they help turn our vision into a powerful reality—every day, in every location, for every individual in need.
          </p>
        </div>
      </Container>
    </div>
  );
};

export default AboutUs;

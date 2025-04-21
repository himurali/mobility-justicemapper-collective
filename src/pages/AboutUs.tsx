
import React from "react";
import { Link } from "react-router-dom";
import Container from "@/components/UI/Container";
import Header from "@/components/Header";

const stats = [
  {
    label: "Years Experience",
    value: "25",
  },
  {
    label: "Total Volunteers",
    value: "9,850+",
  },
  {
    label: "Success Cases",
    value: "9,080+",
  },
  {
    label: "People Helped",
    value: "23k+",
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
      {/* HERO SECTION */}
      <div className="relative pb-0 w-full">
        {/* Yellow angled background */}
        <div
          className="absolute top-0 left-0 w-full h-[320px] z-0"
          style={{
            background: "#FEF7CD",
            clipPath: "polygon(0 0, 100% 0, 100% 73%, 0 100%)",
          }}
        />
        <Container>
          {/* Breadcrumb */}
          <nav
            className="relative z-10 flex justify-end md:justify-start pt-4 pb-3 text-gray-900 text-base font-medium"
            aria-label="Breadcrumb"
          >
            <Link
              to="/"
              className="hover:underline transition text-gray-900 opacity-90"
            >
              Home
            </Link>
            <span className="mx-2 opacity-75">{">"}</span>
            <span className="font-semibold">About Us</span>
          </nav>
          {/* Hero Text and Image */}
          <div className="relative z-10 flex flex-col md:flex-row mt-2 md:mt-7 gap-8">
            {/* Text Content */}
            <div className="flex-1 flex flex-col justify-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-5" style={{ fontFamily: "Libre Baskerville, serif" }}>
                About Us
              </h1>
              <p className="text-base md:text-lg text-gray-900 mb-3 md:mb-6">
                <strong>At JUSTMOVE</strong>, we are reimagining how cities move by centering justice, equity, and sustainability in everyday transportation. We believe mobility is a right — not a privilege — and our platform seeks to highlight and correct the deep-rooted inequalities embedded in urban mobility systems.
              </p>
              <p className="text-base md:text-lg text-gray-900 mb-3 md:mb-6">
                We are a collective of urban designers, mobility activists, technologists, planners, and citizens committed to building inclusive cities where walking, cycling, and public transit are not just options — but the most accessible, affordable, and celebrated modes of movement.
              </p>
              <div className="space-y-4 mt-2">
                <div>
                  <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-yellow-700 mb-1">Vision</h2>
                  <p className="text-gray-900">
                    To create just and inclusive cities where every individual, regardless of gender, income, age, or ability, has equal access to safe, sustainable, and dignified mobility.
                  </p>
                </div>
                <div>
                  <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-yellow-700 mb-1">Mission</h2>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-gray-900">
                    <li>
                      To map mobility justice by making visible the lived experiences of people who walk, cycle, or rely on public transport.
                    </li>
                    <li>
                      To empower communities with data, storytelling, and open-access tools to advocate for equitable infrastructure and mobility rights.
                    </li>
                    <li>
                      To challenge the dominance of car-centric urban planning by foregrounding active mobility and public transportation as critical paths to climate resilience, public health, and social justice.
                    </li>
                  </ul>
                </div>
                <div>
                  <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-yellow-700 mb-1">Goals</h2>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-gray-900">
                    <li>
                      <strong>Document Inequity:</strong> Map the availability and quality of pedestrian, cycling, and public transport infrastructure across neighborhoods.
                    </li>
                    <li>
                      <strong>Highlight Injustice:</strong> Surface stories and data that expose how mobility injustice intersects with gender, caste, class, disability, and environmental degradation.
                    </li>
                    <li>
                      <strong>Enable Action:</strong> Provide open, interactive tools that enable planners, policymakers, and communities to advocate for inclusive mobility reforms.
                    </li>
                    <li>
                      <strong>Build Solidarity:</strong> Create a network of local, national, and global collaborators who are reimagining urban futures through the lens of justice and care.
                    </li>
                    <li>
                      <strong>Promote Active Mobility:</strong> Encourage walking and cycling as not only healthy, but socially and ecologically transformative modes of being.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* Hero Image */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <img
                src="/lovable-uploads/258426fb-1adf-4cdb-a772-3637cad8223b.png"
                alt="JUSTMOVE Team"
                className="rounded-xl shadow-xl w-full max-w-xl object-cover border-8 border-white min-h-[276px] max-h-[400px]"
                style={{
                  background: "#fff",
                }}
              />
            </div>
          </div>
        </Container>
      </div>
      {/* Main Content */}
      <Container>
        <section className="my-12 grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-yellow-700 mb-3">Our Impact</h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-6 md:gap-8">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl shadow p-6 text-center flex flex-col items-center justify-center hover:scale-105 transition-transform border"
                >
                  <span className="text-3xl md:text-4xl font-bold text-yellow-700 mb-1">{stat.value}</span>
                  <span className="text-gray-600 text-sm font-medium">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-yellow-700 mb-3">Milestones & Highlights</h3>
            <div className="mb-6">
              <h4 className="text-lg font-medium text-yellow-800 mb-2">Milestones Along Our Journey</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                {milestones.map((milestone, idx) => (
                  <li key={idx}>{milestone}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium text-yellow-800 mb-2">Highlights of Our Achievements</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                {highlights.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
        <div className="mt-10 pb-16">
          <h4 className="text-xl font-semibold text-yellow-700 mb-3">Changemaker Volunteers</h4>
          <p className="max-w-prose">
            Our dedicated volunteers are the heart of our movement. Through collective action, skills, and compassion, they help turn our vision into a powerful reality—every day, in every location, for every individual in need.
          </p>
        </div>
      </Container>
    </div>
  );
};

export default AboutUs;


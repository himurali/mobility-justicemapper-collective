
import React from "react";
import { Link } from "react-router-dom";
import Container from "@/components/UI/Container";
import Header from "@/components/Header";

const goals = [
  {
    title: "Document Inequity",
    desc: "Map the availability and quality of pedestrian, cycling, and public transport infrastructure across neighborhoods.",
  },
  {
    title: "Highlight Injustice",
    desc: "Surface stories and data that expose how mobility injustice intersects with gender, caste, class, disability, and environmental degradation.",
  },
  {
    title: "Enable Action",
    desc: "Provide open, interactive tools that enable planners, policymakers, and communities to advocate for inclusive mobility reforms.",
  },
  {
    title: "Build Solidarity",
    desc: "Create a network of local, national, and global collaborators who are reimagining urban futures through the lens of justice and care.",
  },
  {
    title: "Promote Active Mobility",
    desc: "Encourage walking and cycling as not only healthy, but socially and ecologically transformative modes of being.",
  },
];

const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8F9ED] text-gray-900 flex flex-col">
      <Header />
      {/* HERO SECTION */}
      <div className="relative w-full border-0 p-0 bg-[#FFE11A]">
        <Container>
          {/* Breadcrumb */}
          <nav
            className="flex justify-end md:justify-start pt-4 pb-2 text-gray-900 text-base font-medium"
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
          {/* HERO, ABOUT TEXT, & ROW */}
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 py-6 md:py-12">
            {/* Hero Text */}
            <div className="flex-1 flex flex-col justify-center max-w-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-5" style={{ fontFamily: "Libre Baskerville, serif" }}>
                About Us
              </h1>
              <p className="text-base md:text-lg mb-4">
                <strong>At JUSTMOVE</strong>, we are reimagining how cities move by centering justice, equity, and sustainability in everyday transportation. We believe mobility is a right — not a privilege — and our platform seeks to highlight and correct the deep-rooted inequalities embedded in urban mobility systems.
              </p>
              <p className="text-base md:text-lg mb-4">
                We are a collective of urban designers, mobility activists, technologists, planners, and citizens committed to building inclusive cities where walking, cycling, and public transit are not just options — but the most accessible, affordable, and celebrated modes of movement.
              </p>
            </div>
            {/* Hero Image */}
            <div className="flex-1 flex flex-col items-center justify-center min-w-[220px] max-w-[390px] w-full">
              <img
                src="/lovable-uploads/258426fb-1adf-4cdb-a772-3637cad8223b.png"
                alt="JUSTMOVE Team"
                className="rounded-xl shadow-xl w-full object-cover border-8 border-white min-h-[235px] max-h-[340px] bg-[#1694E0]"
                style={{ background: "#1694E0" }}
              />
            </div>
          </div>
        </Container>
      </div>
      {/* MISSION & VISION IN A SINGLE ROW */}
      <div className="w-full py-9 px-0 bg-[#FFE11A]">
        <Container>
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center justify-center">
            {/* Mission */}
            <div className="flex-1 w-full flex flex-col justify-center bg-transparent">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900" style={{ fontFamily: "Libre Baskerville, serif" }}>
                Our Mission
              </h2>
              <ul className="text-base md:text-lg list-disc list-inside ml-2 space-y-2">
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
            {/* Vision image right side box */}
            <div className="flex-1 w-full flex flex-col justify-center items-center">
              <div className="w-full h-full flex flex-col md:flex-row gap-0">
                <div className="bg-[#1694E0] p-0 m-0 rounded-xl w-full flex items-center justify-center">
                  <img
                    src="/lovable-uploads/c9f6d72e-6031-4acc-9f35-457e359bba37.png"
                    alt="Mission & Vision Visual"
                    className="w-full max-w-xs rounded-xl object-cover h-[250px] min-w-[200px]"
                  />
                </div>
                <div className="hidden md:block w-0 h-0"></div>
              </div>
              <div className="mt-6 bg-transparent w-full">
                <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900" style={{ fontFamily: "Libre Baskerville, serif" }}>
                  Our Vision
                </h2>
                <p className="text-base md:text-lg">
                  To create just and inclusive cities where every individual, regardless of gender, income, age, or ability, has equal access to safe, sustainable, and dignified mobility.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </div>
      {/* GOALS SECTION */}
      <Container>
        <section className="mt-10 mb-8">
          <h3 className="text-2xl md:text-3xl font-extrabold text-yellow-700 mb-3">Our Goals</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {goals.map((goal, i) => (
              <div key={i} className="bg-white rounded-xl shadow hover:scale-105 transition-transform border p-6 flex flex-col">
                <span className="text-lg font-bold text-yellow-700 mb-1">{goal.title}</span>
                <span className="text-gray-900 text-base">{goal.desc}</span>
              </div>
            ))}
          </div>
        </section>
        {/* VOLUNTEERS SMALL CTA */}
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

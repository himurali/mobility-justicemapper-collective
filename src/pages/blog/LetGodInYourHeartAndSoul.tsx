
import React from "react";
import { Link } from "react-router-dom";
import { Calendar, ArrowLeft } from "lucide-react";

// This image would be dynamic per post in a real CMS setup.
const featureImg = "/lovable-uploads/24ac4175-f301-47ad-9ace-3dba49cfa75f.png";

export default function LetGodInYourHeartAndSoul() {
  return (
    <div className="min-h-screen bg-white">
      {/* Feature Image */}
      <div className="relative h-[38vw] min-h-[420px] w-full overflow-hidden">
        <img
          src={featureImg}
          alt="Let God in your Heart and Soul"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" />
        {/* Blog Meta + Title Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-14 md:px-20">
          <Link
            to="/blog"
            className="flex items-center text-white group mb-6 hover:underline"
          >
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </Link>
          <div className="flex items-center gap-6 text-gray-200 text-base mb-2">
            <span className="flex items-center gap-2">
              <Calendar size={18} />
              <span>February 2, 2023</span>
            </span>
            <span className="mx-2">&bull;</span>
            <span>9 min</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">
            Let God in your Heart and Soul
          </h1>
          <p className="text-lg text-gray-200 max-w-2xl">
            Discover the transformative power of faith and the profound impact it can have on your life's journey.
          </p>
        </div>
      </div>
      {/* Blog Content */}
      <div className="bg-white max-w-3xl mx-auto px-6 md:px-12 py-12">
        <h2 className="text-2xl font-bold text-purple-700 mb-6">
          Let God in your Heart and Soul.
        </h2>
        <p className="text-gray-700 mb-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sit amet dui vel felis bibendum malesuada ut ac sem. Ut euismod metus at odio dictum, vitae tincidunt nunc tincidunt. Proin egestas cursus erat, nec pretium lorem porta nec. 
        </p>
        <p className="text-gray-700 mb-8">
          Sed sit amet magna commodo, cursus velit ac, pharetra tortor. Pellentesque sagittis felis commodo, interdum dolor nec, sollicitudin nunc. Etiam sed ultrices mi, nec dictum risus. Aenean dictum, risus a euismod efficitur, massa risus sagittis dolor, non tristique orci diam at augue.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">How faith can impact your life:</h3>
        <ul className="list-disc pl-4 mb-6 text-gray-700">
          <li>Find comfort and strength during challenging times.</li>
          <li>Grow in self-awareness and compassion for others.</li>
          <li>Experience a deeper sense of purpose and meaning.</li>
        </ul>
        <p className="text-gray-700">
          Praesent condimentum tincidunt sagittis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
        </p>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import Aos from "aos";

const Welcome = ({ onClose }) => {
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    Aos.init({ duration: 1400 });
  }, []);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout;
    onClose, 500;
  };
  return (
    <div
      className={`fixed inset-0 bg-gradient-to-l from-emerald-950 to-neutral-900 z-20 flex items-center justify-between transition-transform duration-1000 ease-[cubic-bezier(0.95,0.05,0.795,0.035)] ${
        isLeaving ? "translate-x-full" : "translate-x-0"
      }`}
    >
      <div className="p-6 mt-20 ml-32" data-aos="fade-right">
        <h1 className="text-9xl text-gray-300 font-bold font-[Raleway] mb-12">
          ManageFinance
        </h1>
        <p className="text-gray-400 text-3xl">
          Gerencie suas finanças com facilidade!
        </p>
      </div>
      <button
        data-aos="fade-left"
        onClick={handleClose}
        className="bg-emerald-900 duration-300 mr-12 text-white p-4 rounded-full hover:bg-emerald-700 font-bold"
      >
        <FaArrowRight className="text-xl" />
      </button>
    </div>
  );
};

export default Welcome;

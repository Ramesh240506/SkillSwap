import React, { useEffect } from "react";
import { HeroSection } from "../components/landing/HeroSection";
import { FeaturesSection } from "../components/landing/FeatureSection";
import { Footer } from "../layout/Footer";
import { CTASection } from "../components/landing/CTASection";

const Landing = () => {
  useEffect(() => {
    document.title = "SkillSwap - Home";
    console.log("Landing page loaded");
  }, []);
  return (
    <div className="min-h-screen  items-center justify-center bg-black-900">
      <HeroSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Landing;

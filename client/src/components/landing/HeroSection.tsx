import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Users, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-black min-h-screen flex items-center">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-400/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-sm font-medium mb-8 hover:bg-yellow-400/20 transition-colors">
            <Sparkles className="w-4 h-4" />
            No money, just skills
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
            Learn a Skill.{" "}
            <span className="text-yellow-400">Teach a Skill.</span>{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
                Earn Credits.
              </span>
              {/* <Zap className="absolute -top-2 -right-8 w-8 h-8 text-yellow-400 animate-bounce hidden lg:inline" /> */}
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Join a community where knowledge is currency. Teach what you know, learn what you love, 
            and grow together  no money required.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-0">
            <Link 
              to="/marketplace"
              className="group w-full sm:w-auto bg-yellow-400 text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-500 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/50 flex items-center justify-center"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Explore Skills
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              to="/auth"
              className="group w-full sm:w-auto border-2 border-yellow-400 text-yellow-400 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 hover:text-black transition-all duration-300 flex items-center justify-center"
            >
              <Users className="w-5 h-5 mr-2" />
              Join Community
            </Link>
          </div>

         
        </div>
      </div>
    </section>
  );
}

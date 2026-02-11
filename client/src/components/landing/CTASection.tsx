import { Link } from "react-router-dom";

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-black py-16 sm:py-20 md:py-28 lg:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        {/* Yellow gradient overlays */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
        
        {/* Glowing circles */}
        <div className="absolute top-10 sm:top-20 left-5 sm:left-20 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-yellow-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-20 w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72 bg-yellow-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Diagonal yellow stripes */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute h-px bg-yellow-400 transform -rotate-45"
                style={{
                  width: '200%',
                  top: `${i * 20}%`,
                  left: '-50%'
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container relative px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
        <div className="max-w-4xl mx-auto text-center">
          {/* Icon */}
        

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-yellow-400 mb-4 sm:mb-6 leading-tight">
            Ready to Start Your
            <br className="hidden sm:block" />
            <span className="text-white"> Skill Journey?</span>
          </h2>

          {/* Description */}
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto px-4">
            Join thousands of learners and teachers exchanging skills every day. 
            Your next skill is just a session away.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-5 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-yellow-400/50"
            >
              Get Started Free
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <Link
              to="/how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-5 border-2 border-yellow-400 text-yellow-400 font-semibold rounded-lg hover:bg-yellow-400 hover:text-black transition-all duration-300 hover:scale-105"
            >
              Learn More
            </Link>
          </div>

          {/* Trust Badge */}
          <div className="mt-8 sm:mt-10 md:mt-12 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-400">
            <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <span>
              Free Learn and Teach Sessions for Everyone. No Credit Card Required. Join Now and Start Swapping Skills Today!
            </span>
          </div>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400" />
    </section>
  );
}

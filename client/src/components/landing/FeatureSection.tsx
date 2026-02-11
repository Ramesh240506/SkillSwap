import { 
  ArrowRightLeft, 
  Coins, 
  Star, 
  Shield, 
  Calendar, 
  MessageCircle 
} from "lucide-react";

const features = [
  {
    icon: ArrowRightLeft,
    title: "Skill Exchange",
    description: "Trade your knowledge directly. Teach React, learn Guitar it's that simple.",
  },
  {
    icon: Coins,
    title: "Credit System",
    description: "Earn credits by teaching, spend them on learning. A fair economy for everyone.",
  },
  {
    icon: Star,
    title: "Verified Reviews",
    description: "Build your reputation with authentic feedback from real learning sessions.",
  },
  {
    icon: Shield,
    title: "Safe & Secure",
    description: "Protected sessions with dispute resolution and credit escrow.",
  },
  {
    icon: Calendar,
    title: "Flexible Scheduling",
    description: "Book sessions that fit your schedule. Learn at your own pace.",
  },
  {
    icon: MessageCircle,
    title: "Direct Communication",
    description: "Chat with teachers and learners to clarify details. No middlemen, just direct connection.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-8 md:py-12 lg:py-16 bg-black">
      <div className="container px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            How SkillSwap Works
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            A fair, transparent platform built for learning and growth
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-6 md:p-8 rounded-2xl bg-gray-900 border border-gray-800 hover:border-yellow-400/50 hover:bg-gray-900/80 transition-all duration-300 hover:scale-105"
            >
              {/* Icon */}
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center mb-4 md:mb-6 group-hover:bg-yellow-400 group-hover:border-yellow-400 transition-all duration-300">
                <feature.icon className="w-6 h-6 md:w-7 md:h-7 text-yellow-400 group-hover:text-black transition-colors duration-300" />
              </div>
              
              {/* Title */}
              <h3 className="text-lg md:text-xl font-semibold text-white mb-2 md:mb-3 group-hover:text-yellow-400 transition-colors">
                {feature.title}
              </h3>
              
              {/* Description */}
              <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

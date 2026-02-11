import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { OfferSkills } from "./OfferSkills";
import { getCurrentUser } from "../../services/service";

const DashboardCard = () => {
  const [offerSkillOpen, setOfferSkillOpen] = useState(false);
  
  // Mock user data - in real app would come from auth context
  const [user, setUser] = useState<{ name: string; credits: number }>
  ({ name: "John Doe", credits: 120 });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        if (userData) {
          setUser(prevUser => ({
            ...prevUser,
            name: userData.name,
            credits: userData.credits 
          })); // Assuming credits is part of user data
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
  };
    fetchUser();
  }, []);
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-yellow-400/20 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-yellow-400">
              SkillSwap
            </Link>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-yellow-400/10 border border-yellow-400/30 rounded-lg">
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <span className="font-semibold text-yellow-400">{user.credits} Credits</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-yellow-400 mb-2">
                Welcome back, {user.name}! 👋
              </h1>
              <p className="text-base sm:text-lg text-gray-300">
                Here's what's happening with your skill exchange
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                to="/skills"
                className="inline-flex items-center justify-center px-5 py-3 border-2 border-yellow-400 text-yellow-400 font-semibold rounded-lg hover:bg-yellow-400 hover:text-black transition-all"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Find Skills
              </Link>
              
              <OfferSkills isOpen={offerSkillOpen} onOpenChange={setOfferSkillOpen} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardCard;
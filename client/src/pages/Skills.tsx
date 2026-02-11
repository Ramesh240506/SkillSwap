import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { OfferSkillPayload } from "../types/skills.types";
import { getOfferedSkills } from "../services/service";

// Extended interface for display purposes
interface SkillDisplay extends OfferSkillPayload {
  id: string;
  title: string;
  teacherName: string;
}

const Skills = () => {
  const [mockSkills, setMockSkills] = useState<SkillDisplay[]>([
    {
      id: "1",
      title: "React & TypeScript Masterclass",
      skillName: "React & TypeScript",
      category: "Programming",
      description: "Learn modern React with TypeScript, hooks, and best practices. Build production-ready applications from scratch.",
      experienceLevel: "Expert (10+ years)",
      creditsPerSession: 3,
      sessionDuration: "60",
      totalSessions: 8,
      availableDays: ["monday", "wednesday", "friday"],
      availableTimeSlots: ["18-19", "19-20"],
      prerequisites: "Basic JavaScript knowledge",
      totalCredits: 24,
      rating: 4.9,
      reviewCount: 127,
      teacherName: "Sarah Chen",
    },
    {
      id: "2",
      title: "Guitar for Beginners",
      skillName: "Acoustic Guitar",
      category: "Music",
      description: "Start your musical journey! Learn chords, strumming patterns, and play your favorite songs in just 6 weeks.",
      experienceLevel: "Intermediate (3-5 years)",
      creditsPerSession: 2,
      sessionDuration: "45",
      totalSessions: 6,
      availableDays: ["tuesday", "thursday", "saturday"],
      availableTimeSlots: ["16-16.75", "17-17.75"],
      prerequisites: "None - complete beginners welcome",
      totalCredits: 12,
      rating: 5.0,
      reviewCount: 89,
      teacherName: "Mike Johnson",
    },
    {
      id: "3",
      title: "UI/UX Design Fundamentals",
      skillName: "UI/UX Design",
      category: "Design",
      description: "Master the principles of user-centered design. Learn Figma, wireframing, prototyping, and design systems.",
      experienceLevel: "Advanced (5-10 years)",
      creditsPerSession: 4,
      sessionDuration: "90",
      totalSessions: 10,
      availableDays: ["monday", "tuesday", "wednesday"],
      availableTimeSlots: ["14-15.5", "19-20.5"],
      prerequisites: "Basic design software experience",
      totalCredits: 40,
      rating: 4.8,
      reviewCount: 156,
      teacherName: "Emily Rodriguez",
    },
    {
      id: "4",
      title: "Spanish Conversation Practice",
      skillName: "Spanish Language",
      category: "Languages",
      description: "Improve your conversational Spanish through real-world scenarios and cultural immersion techniques.",
      experienceLevel: "Expert (10+ years)",
      creditsPerSession: 2,
      sessionDuration: "60",
      totalSessions: 12,
      availableDays: ["monday", "wednesday", "friday"],
      availableTimeSlots: ["17-18", "20-21"],
      prerequisites: "Basic Spanish (A2 level)",
      totalCredits: 24,
      rating: 4.7,
      reviewCount: 203,
      teacherName: "Carlos Mendez",
    }
  ]);
  const [filteredSkills, setFilteredSkills] = useState<SkillDisplay[]>(mockSkills);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [ratingFilter, setRatingFilter] = useState("Any Rating");
  const [creditsFilter, setCreditsFilter] = useState("Any Credits");
  const [showFilters, setShowFilters] = useState(false);

  const applyFilters = (
    query: string,
    category: string,
    rating: string,
    credits: string,
  ) => {
    let filtered = [...mockSkills];

    // Search filter
    if (query) {
      filtered = filtered.filter(
        (skill) =>
          skill.skillName.toLowerCase().includes(query.toLowerCase()) ||
          skill.title.toLowerCase().includes(query.toLowerCase()) ||
          skill.category.toLowerCase().includes(query.toLowerCase()) ||
          skill.teacherName.toLowerCase().includes(query.toLowerCase()),
      );
    }

    // Category filter
    if (category !== "All Categories") {
      filtered = filtered.filter((skill) => skill.category === category);
    }

    // Rating filter
    if (rating !== "Any Rating") {
      const minRating =
        rating === "5 Stars Only" ? 5 : rating === "4.5+ Stars" ? 4.5 : 4;
      filtered = filtered.filter((skill) => skill.rating >= minRating);
    }

    // Credits filter
    if (credits !== "Any Credits") {
      if (credits === "1-2 Credits") {
        filtered = filtered.filter((skill) => skill.creditsPerSession <= 2);
      } else if (credits === "3-5 Credits") {
        filtered = filtered.filter(
          (skill) =>
            skill.creditsPerSession >= 3 && skill.creditsPerSession <= 5,
        );
      } else if (credits === "5+ Credits") {
        filtered = filtered.filter((skill) => skill.creditsPerSession >= 5);
      }
    }

    setFilteredSkills(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(query, categoryFilter, ratingFilter, creditsFilter);
  };

  const handleCategoryChange = (category: string) => {
    setCategoryFilter(category);
    applyFilters(searchQuery, category, ratingFilter, creditsFilter);
  };

  const handleRatingChange = (rating: string) => {
    setRatingFilter(rating);
    applyFilters(searchQuery, categoryFilter, rating, creditsFilter);
  };

  const handleCreditsChange = (credits: string) => {
    setCreditsFilter(credits);
    applyFilters(searchQuery, categoryFilter, ratingFilter, credits);
  };
  const navigate=useNavigate();
  useEffect(() => {
    const getSkills = async () => {
      // Fetch skills from backend API
      try {
        console.log("Fetching skills from API...");
        const data = await getOfferedSkills();
        console.log("Raw API response:", data);
        
        // Transform API data to match SkillDisplay interface
        const transformedSkills: SkillDisplay[] = data.map(
          (skill: OfferSkillPayload & { _id?: string; providerId?: { name: string } }) => ({
            id: skill._id || "",
            title: skill.skillName, // Use skillName as title
            skillName: skill.skillName,
            category: skill.category,
            description: skill.description,
            experienceLevel: skill.experienceLevel,
            creditsPerSession: skill.creditsPerSession,
            sessionDuration: skill.sessionDuration,
            totalSessions: skill.totalSessions,
            availableDays: skill.availableDays,
            availableTimeSlots: skill.availableTimeSlots,
            prerequisites: skill.prerequisites,
            totalCredits: skill.totalCredits,
            rating: skill.rating || 0,
            reviewCount: skill.reviewCount || 0,
            teacherName: skill.teacherName || "Anonymous", // Extract from populated provider
          })
        );
        
        console.log("Transformed skills:", transformedSkills);
        setMockSkills(transformedSkills);
        setFilteredSkills(transformedSkills);
      } catch (error) {
        console.error("Error fetching skills:", error);
        if (error instanceof Error) {
          console.error("Error message:", error.message);
        }
        // Keep mock data on error
      }
    };

    getSkills();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/* Header */}
      <header className="border-b border-yellow-400/20 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-yellow-400">
              SkillSwap
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/skills" className="text-yellow-400 font-semibold">
                Skills
              </Link>
              <Link
                to="/how-it-works"
                className="text-gray-300 hover:text-yellow-400 transition"
              >
                How It Works
              </Link>
              <Link
                to="/auth"
                className="text-gray-300 hover:text-yellow-400 transition"
              >
                Sign In
              </Link>
            </nav>
            <button className="md:hidden text-yellow-400">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Page Header */}
          <div className="mb-8 md:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-yellow-400 mb-3">
              Skills Marketplace
            </h1>
            <p className="text-base sm:text-lg text-gray-300">
              Browse {mockSkills.length}+ skills from verified teachers
            </p>
          </div>

          {/* Search Bar with Filter Button */}
          <div className="mb-6 md:mb-8">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="   Search skills, teachers, or categories..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 pl-12 bg-gray-900 border-2 border-yellow-400/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition-colors"
                />
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 sm:px-5 py-3 sm:py-4 bg-gray-900 border-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                  showFilters
                    ? "border-yellow-400 bg-yellow-400/10"
                    : "border-yellow-400/30 hover:border-yellow-400"
                }`}
              >
                <svg
                  className="w-5 h-5 text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                <span className="hidden sm:inline text-yellow-400 font-semibold">
                  Filters
                </span>
              </button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mb-8 md:mb-10 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <select
                value={categoryFilter}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="px-4 py-3 bg-gray-900 border-2 border-yellow-400/30 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors cursor-pointer"
              >
                <option value="All Categories">All Categories</option>
                <option value="Programming">Programming</option>
                <option value="Music">Music</option>
                <option value="Design">Design</option>
                <option value="Languages">Languages</option>
              </select>

              <select
                value={ratingFilter}
                onChange={(e) => handleRatingChange(e.target.value)}
                className="px-4 py-3 bg-gray-900 border-2 border-yellow-400/30 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors cursor-pointer"
              >
                <option value="Any Rating">Any Rating</option>
                <option value="5 Stars Only">5 Stars Only</option>
                <option value="4.5+ Stars">4.5+ Stars</option>
                <option value="4+ Stars">4+ Stars</option>
              </select>

              <select
                value={creditsFilter}
                onChange={(e) => handleCreditsChange(e.target.value)}
                className="px-4 py-3 bg-gray-900 border-2 border-yellow-400/30 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors cursor-pointer"
              >
                <option value="Any Credits">Any Credits</option>
                <option value="1-2 Credits">1-2 Credits</option>
                <option value="3-5 Credits">3-5 Credits</option>
                <option value="5+ Credits">5+ Credits</option>
              </select>
            </div>
          )}

          {/* Skills Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredSkills.map((skill) => (
              <div
                key={skill.id}
                className="bg-gray-900 border-2 border-yellow-400/20 rounded-xl overflow-hidden hover:border-yellow-400 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/20 flex flex-col"
              >
                <div className="p-5 flex flex-col flex-1">
                  {/* Category Badge */}
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 bg-yellow-400/10 text-yellow-400 text-xs font-semibold rounded-full">
                      {skill.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                    {skill.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2 flex-1">
                    {skill.description}
                  </p>

                  {/* Teacher */}
                  <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-800">
                    <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span className="text-black text-sm font-bold">
                        {skill.teacherName.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-300 font-medium">
                        {skill.teacherName}
                      </p>
                      <p className="text-xs text-yellow-400">
                        {skill.experienceLevel}
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm font-semibold text-white">
                        {skill.rating}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({skill.reviewCount})
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4 text-yellow-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      </svg>
                      <span className="text-sm font-semibold text-yellow-400">
                        {skill.totalCredits}
                      </span>
                    </div>
                  </div>

                  {/* Book Button */}
                  <Link
                    to={`/skilldetail/${skill.id}`}
                    className="mt-4 w-full block text-center px-4 py-2.5 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredSkills.length === 0 && (
            <div className="text-center py-16">
              <svg
                className="w-16 h-16 text-yellow-400/50 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-xl text-gray-400 mb-2">No skills found</p>
              <p className="text-gray-500">
                Try adjusting your filters or search query
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Skills;

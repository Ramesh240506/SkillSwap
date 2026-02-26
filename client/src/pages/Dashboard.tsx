
import { Link } from 'react-router-dom';
import { DashboardCard } from '../components/dashboard/DashBoardCard'
import { SessionCard } from '../components/dashboard/SessionCard'
import { CourseCard } from '../components/dashboard/CourseCard'
import { useEffect, useState, useCallback } from 'react';
import { OfferSkills } from '../components/dashboard/OfferSkills';
import { getCurrentUser,  getMyOfferedCourses, getMySessions } from '../services/service';

// Course type for offered courses
interface Course {
  _id: string;
  skillName: string;
  category: string;
  description: string;
  experienceLevel: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  creditsPerSession: number;
  sessionDuration: number;
  totalSessions: number;
  availableDays: string[];
  availableTimeSlots: string[];
  totalCredits: number;
  rating: number;
  reviewCount: number;
  isActive: boolean;
}

const Dashboard = () => {
   const [offerSkillOpen, setOfferSkillOpen] = useState(false);
   const [selectedRole, setSelectedRole] = useState<"teacher" | "learner">("teacher");
    
    // Mock user data - in real app would come from auth context
    const [user, setUser] = useState<{ name: string; credits: number }>
    ({ name: "John Doe", credits: 120 });
  
  // State for offered courses (teacher view)
  const [courses, setCourses] = useState<Course[]>([]);
  
  const [sessions, setSessions] = useState([
    {
      id: "1",
      skillName: "Guitar Basics",
      partnerName: "John Doe",
      status: "active" as const,
      credits: 5,
      role: "learner" as const,
      scheduledDate: "Feb 15, 2026",
      scheduledTime: "2:00 PM"
    },
    {
      id: "2",
      skillName: "Python Programming",
      partnerName: "Jane Smith",
      status: "pending" as const,
      credits: 10,
      role: "teacher" as const,
      scheduledDate: "Feb 18, 2026",
      scheduledTime: "4:30 PM"
    },
    {
      id: "3",
      skillName: "Web Development",
      partnerName: "Mike Wilson",
      status: "in-progress" as const,
      credits: 8,
      role: "learner" as const,
      scheduledDate: "Feb 12, 2026",
      scheduledTime: "Now"
    },
    {
      id: "4",
      skillName: "Spanish Conversation",
      partnerName: "Carlos Rodriguez",
      status: "completed" as const,
      credits: 6,
      role: "learner" as const,
      scheduledDate: "Feb 10, 2026",
      scheduledTime: "3:00 PM"
    }
  ]);

  // Fetch offered courses for teacher view
  const fetchCourses = useCallback(async () => {
    try {
      const coursesData = await getMyOfferedCourses();
      console.log("Fetched courses data:", coursesData);
      setCourses(coursesData.courses  || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  }, []);

  const fetchSessions = useCallback(async () => {
    try {
      const sessionsData = await getMySessions();
      console.log("Fetched sessions data:", sessionsData);
      setSessions(sessionsData.sessions || []);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        if (userData) {
          setUser(prevUser => ({
            ...prevUser,
            name: userData.name,
            credits: userData.credits 
          }));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();
    fetchCourses();
  }, [fetchCourses]);
  
  // Fetch sessions or courses when role changes
  // Fetch sessions or courses when role changes
  useEffect(() => {
    if (selectedRole === "teacher") {
      fetchCourses();
    } else {
      fetchSessions(); 
    }
  }, [selectedRole, fetchCourses,fetchSessions]);    
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
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <DashboardCard
            title="Total Credits Earned"
            value={user.credits}
            subtitle="Keep up the great work!"
            icon="💰"
            trend={{ value: 15, label: "since last week" }}
          />
          <DashboardCard
            title="Active Sessions"
            value={sessions.filter(s => s.status === "active").length}
            subtitle="Sessions currently in progress"
            icon="🎓"
            trend={{ value: -10, label: "since last week" }}
          />
          <DashboardCard
            title="Pending Sessions"
            value={sessions.filter(s => s.status === "pending").length}
            subtitle="Sessions awaiting confirmation"
            icon="⏳"
            trend={{ value: 5, label: "since last week" }}
          />
          <DashboardCard
            title="Completed Sessions"
            value={sessions.filter(s => s.status === "completed").length}
            subtitle="Sessions you've completed"
            icon="✅"
            trend={{ value: 20, label: "since last week" }}
          />
        </div>
        
        {/* Sessions Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-yellow-400">
              {selectedRole === "teacher" ? "Your Courses" : "Your Sessions"}
            </h1>
            
            {/* Role Toggle */}
            <div className="inline-flex rounded-lg border-2 border-yellow-500/30 bg-black/50 p-1">
              <button
                onClick={() => setSelectedRole("teacher")}
                className={`px-6 py-2 rounded-md font-semibold transition-all duration-200 ${
                  selectedRole === "teacher"
                    ? "bg-yellow-500 text-black shadow-lg"
                    : "text-yellow-400 hover:text-yellow-300"
                }`}
              >
                🎓 Teacher
              </button>
              <button
                onClick={() => setSelectedRole("learner")}
                className={`px-6 py-2 rounded-md font-semibold transition-all duration-200 ${
                  selectedRole === "learner"
                    ? "bg-yellow-500 text-black shadow-lg"
                    : "text-yellow-400 hover:text-yellow-300"
                }`}
              >
                📚 Learner
              </button>
            </div>
          </div>
          
          <div className="border-b-2 border-yellow-500/30"></div>
          
          {/* Cards Grid - Show CourseCard for teacher, SessionCard for learner */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {selectedRole === "teacher" ? (
              courses.length > 0 ? (
                courses.map((course) => (
                  <CourseCard 
                    key={course._id}
                    id={course._id}
                    skillName={course.skillName}
                    category={course.category}
                    description={course.description}
                    experienceLevel={course.experienceLevel}
                    creditsPerSession={course.creditsPerSession}
                    sessionDuration={course.sessionDuration}
                    totalSessions={course.totalSessions}
                    availableDays={course.availableDays}
                    availableTimeSlots={course.availableTimeSlots}
                    totalCredits={course.totalCredits}
                    rating={course.rating}
                    reviewCount={course.reviewCount}
                    isActive={course.isActive}
                    onViewDetails={() => console.log(`View details for ${course._id}`)}
                    onEdit={() => console.log(`Edit course ${course._id}`)}
                    onDelete={() => console.log(`Delete course ${course._id}`)}
                  />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-24 h-24 rounded-full bg-yellow-500/10 flex items-center justify-center mb-4">
                    <svg className="w-12 h-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-yellow-400 mb-2">
                    No courses posted yet
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Start sharing your expertise by posting your first course!
                  </p>
                  <button
                    onClick={() => setOfferSkillOpen(true)}
                    className="px-6 py-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition-all"
                  >
                    Post a Course
                  </button>
                </div>
              )
            ) : (
              sessions.length > 0 ? (
                sessions.map((session) => (
                  <SessionCard 
                    key={session.id}
                    id={session.id}
                    skillName={session.skillName}
                    partnerName={session.partnerName}
                    status={session.status}
                    credits={session.credits}
                    role={session.role}
                    scheduledDate={session.scheduledDate}
                    scheduledTime={session.scheduledTime}
                    onViewDetails={() => console.log(`View details for ${session.id}`)}
                    onMessage={() => console.log(`Message ${session.partnerName}`)}
                  />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-24 h-24 rounded-full bg-yellow-500/10 flex items-center justify-center mb-4">
                    <svg className="w-12 h-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-yellow-400 mb-2">
                    No sessions booked yet
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Browse available skills and book your first learning session!
                  </p>
                  <Link
                    to="/skills"
                    className="px-6 py-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition-all"
                  >
                    Browse Skills
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard

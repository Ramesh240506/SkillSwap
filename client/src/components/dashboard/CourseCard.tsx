import { Clock, BookOpen, Star, Calendar, Award, Users, Edit, Trash2 } from "lucide-react";

interface CourseCardProps {
  id: string;
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
  onEdit?: () => void;
  onDelete?: () => void;
  onViewDetails?: () => void;
}

export function CourseCard({
  skillName,
  category,
  description,
  experienceLevel,
  creditsPerSession,
  sessionDuration,
  totalSessions,
  availableDays,
  totalCredits,
  rating,
  reviewCount,
  isActive,
  onEdit,
  onDelete,
  onViewDetails,
}: CourseCardProps) {
  const levelConfig: Record<string, { color: string }> = {
    Beginner: { color: "bg-green-500/20 text-green-400 border-green-500/30" },
    Intermediate: { color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
    Advanced: { color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
    Expert: { color: "bg-red-500/20 text-red-400 border-red-500/30" },
  };

  const currentLevel = levelConfig[experienceLevel] || { color: "bg-gray-500/20 text-gray-400 border-gray-500/30" };

  // Format days for display
  const formatDays = (days: string[]): string => {
    if (days.length === 0) return 'No days set';
    if (days.length <= 3) return days.join(', ');
    return `${days.slice(0, 2).join(', ')} +${days.length - 2} more`;
  };

  return (
    <div className="bg-gradient-to-br from-black via-gray-900 to-black rounded-xl border-2 border-yellow-500/30 hover:border-yellow-500 transition-all duration-300 overflow-hidden hover:shadow-[0_0_30px_rgba(234,179,8,0.3)] group">
      {/* Yellow accent bar */}
      <div className="h-1 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500"></div>
      
      <div className="p-4 sm:p-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 p-0.5 flex-shrink-0">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                <BookOpen className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-white text-base sm:text-lg truncate">
                {category}
              </p>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-xs border ${currentLevel.color}`}>
                  {experienceLevel}
                </span>
                {isActive ? (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-green-500/20 text-green-400 border border-green-500/30">
                    Active
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-gray-500/20 text-gray-400 border border-gray-500/30">
                    Inactive
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Rating */}
          <div className="flex items-center gap-1 self-start bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/30">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-yellow-400 font-bold text-sm">{rating.toFixed(1)}</span>
            <span className="text-gray-400 text-xs">({reviewCount})</span>
          </div>
        </div>

        {/* Course Name */}
        <h4 className="text-lg sm:text-xl font-bold text-yellow-400 mb-2 line-clamp-2 group-hover:text-yellow-300 transition-colors">
          {skillName}
        </h4>

        {/* Description */}
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {description}
        </p>

        {/* Details Section */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-5 pb-4 border-b border-yellow-500/20">
          <div className="flex items-center gap-1.5 text-gray-300 text-xs sm:text-sm">
            <Users className="w-4 h-4 text-yellow-500" />
            <span>{totalSessions} sessions</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-300 text-xs sm:text-sm">
            <Clock className="w-4 h-4 text-yellow-500" />
            <span>{sessionDuration} min each</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-300 text-xs sm:text-sm">
            <Calendar className="w-4 h-4 text-yellow-500" />
            <span>{formatDays(availableDays)}</span>
          </div>
        </div>

        {/* Credits Section */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-1.5 bg-yellow-500/10 px-3 py-1.5 rounded-full border border-yellow-500/30">
            <Award className="w-4 h-4 text-yellow-500" />
            <span className="text-yellow-400 font-bold text-sm">{creditsPerSession}</span>
            <span className="text-gray-400 text-xs">credits/session</span>
          </div>
          <div className="text-right">
            <span className="text-gray-400 text-xs">Total: </span>
            <span className="text-yellow-400 font-bold text-sm">{totalCredits} credits</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col xs:flex-row gap-2">
          <button
            onClick={onViewDetails}
            className="flex-1 bg-yellow-500/10 hover:bg-yellow-500/20 border-2 border-yellow-500 text-yellow-400 font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            View Details
          </button>
          <button
            onClick={onEdit}
            className="flex-1 xs:flex-initial bg-black/50 hover:bg-yellow-500/10 border border-yellow-500/30 hover:border-yellow-500 text-yellow-400 font-medium py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={onDelete}
            className="flex-1 xs:flex-initial bg-black/50 hover:bg-red-500/10 border border-red-500/30 hover:border-red-500 text-red-400 font-medium py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

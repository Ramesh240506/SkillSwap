import { Calendar, Clock, User, MessageCircle, Award } from "lucide-react";

interface SessionCardProps {
  id: string;
  skillName: string;
  partnerName: string | null;
  partnerImage?: string;
  status: "pending" | "active" | "in-progress" | "completed" | "disputed" | string;
  scheduledDate?: string;
  scheduledTime?: string;
  credits: number;
  role: "learner" | "teacher";
  onViewDetails?: () => void;
  onMessage?: () => void;
}

export function SessionCard({
  skillName,
  partnerName,
  partnerImage,
  status,
  scheduledDate,
  scheduledTime,
  credits,
  role,
  onViewDetails,
  onMessage,
}: SessionCardProps) {
  const statusConfig: Record<string, { label: string; color: string }> = {
    pending: { label: "Pending", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
    active: { label: "Accepted", color: "bg-yellow-500 text-black font-semibold" },
    "in-progress": { label: "In Progress", color: "bg-yellow-400 text-black font-semibold animate-pulse" },
    completed: { label: "Completed", color: "bg-green-500/20 text-green-400 border-green-500/30" },
    disputed: { label: "Disputed", color: "bg-red-500/20 text-red-400 border-red-500/30" },
  };

  const currentStatus = statusConfig[status] || { label: status, color: "bg-gray-500/20 text-gray-400 border-gray-500/30" };

  // Format date from ISO string to readable format
  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return '';
    
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr; // Return original if invalid
      
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch {
      return dateStr;
    }
  };

  // Format time from numeric format (e.g., "1080-1200") to readable format
  const formatTime = (timeStr?: string): string => {
    if (!timeStr) return '';
    
    // Check if it's in numeric format like "1080-1200"
    const numericTimeMatch = timeStr.match(/^(\d+)-(\d+)$/);
    if (numericTimeMatch) {
      const startMinutes = parseInt(numericTimeMatch[1]);
      const endMinutes = parseInt(numericTimeMatch[2]);
      
      const formatMinutesToTime = (minutes: number): string => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
        return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
      };
      
      return `${formatMinutesToTime(startMinutes)} - ${formatMinutesToTime(endMinutes)}`;
    }
    
    return timeStr; // Return as-is if not in numeric format
  };

  const formattedDate = formatDate(scheduledDate);
  const formattedTime = formatTime(scheduledTime);

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
                {partnerImage ? (
                  <img src={partnerImage} alt={partnerName || "Partner"} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-6 h-6 text-yellow-500" />
                )}
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-white text-base sm:text-lg truncate">
                {partnerName || "No partner yet"}
              </p>
              <p className="text-xs sm:text-sm text-yellow-500 capitalize font-medium">
                {role === "learner" ? "🎓 Teacher" : "📚 Learner"}
              </p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs sm:text-sm border self-start ${currentStatus.color} whitespace-nowrap`}>
            {currentStatus.label}
          </span>
        </div>

        {/* Skill Name */}
        <h4 className="text-lg sm:text-xl font-bold text-yellow-400 mb-4 line-clamp-2 group-hover:text-yellow-300 transition-colors">
          {skillName}
        </h4>

        {/* Details Section */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-5 pb-4 border-b border-yellow-500/20">
          {formattedDate && (
            <div className="flex items-center gap-1.5 text-gray-300 text-xs sm:text-sm">
              <Calendar className="w-4 h-4 text-yellow-500" />
              <span className="hidden xs:inline">{formattedDate}</span>
              <span className="xs:hidden">{formattedDate.split(',')[0]}</span>
            </div>
          )}
          {formattedTime && (
            <div className="flex items-center gap-1.5 text-gray-300 text-xs sm:text-sm">
              <Clock className="w-4 h-4 text-yellow-500" />
              <span>{formattedTime}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 bg-yellow-500/10 px-2 sm:px-3 py-1 rounded-full border border-yellow-500/30">
            <Award className="w-4 h-4 text-yellow-500" />
            <span className="text-yellow-400 font-bold text-xs sm:text-sm">{credits}</span>
            <span className="text-gray-400 text-xs">credits</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col xs:flex-row gap-2">
         
            <button
              onClick={onMessage}
              className="flex-1 bg-yellow-500/10 hover:bg-yellow-500/20 border-2 border-yellow-500 text-yellow-400 font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <MessageCircle className="w-4 h-4" />
              Message
            </button>
         
          <button
            onClick={onViewDetails}
            className="flex-1 xs:flex-initial bg-black/50 hover:bg-yellow-500/10 border border-yellow-500/30 hover:border-yellow-500 text-yellow-400 font-medium py-2.5 px-4 rounded-lg transition-all duration-200 text-sm sm:text-base"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

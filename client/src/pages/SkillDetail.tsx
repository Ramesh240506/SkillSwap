import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Star,
  Clock,
  User,
  ArrowLeft,
  Calendar as CalendarIcon,
  CheckCircle2,
  MessageSquare,
  Coins,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  format,
  addDays,
  addMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
} from "date-fns";
import { createBooking, getOfferingAvailability } from "../services/service";
import type { SkillApiResponse } from "../types/skills.types";
import { formatTimeSlot } from "../utils/timeFormat";
// API Response interface

// Skill data interface

const dayMap: Record<string, number> = {
  // Abbreviated format
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
  // Full lowercase format (from backend)
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
  // Capitalized format (just in case)
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

const levelColors: Record<string, string> = {
  Beginner: "bg-green-500/20 text-green-400 border-green-500/30",
  Intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Advanced: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Expert: "bg-red-500/20 text-red-400 border-red-500/30",
};

// Custom Calendar Component
interface SimpleCalendarProps {
  selectedDates: Date[];
  onSelect: (date: Date) => void;
  isDisabled: (date: Date) => boolean;
  maxSessions?: number;
}

const SimpleCalendar = ({
  selectedDates,
  onSelect,
  isDisabled,
  maxSessions,
}: SimpleCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  return (
    <div className="p-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
          className="p-1.5 rounded-lg hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-white font-medium text-sm">
          {format(currentMonth, "MMMM yyyy")}
        </span>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-1.5 rounded-lg hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-xs text-zinc-500 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const disabled = isDisabled(day);
          const isSelected = selectedDates.some((selectedDate) =>
            isSameDay(selectedDate, day),
          );
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const reachedLimit = maxSessions
            ? selectedDates.length >= maxSessions && !isSelected
            : false;

          return (
            <button
              key={day.toISOString()}
              onClick={() => !disabled && !reachedLimit && onSelect(day)}
              disabled={disabled || reachedLimit}
              className={`
                aspect-square flex items-center justify-center text-sm rounded-lg transition-all
                ${!isCurrentMonth ? "text-zinc-700" : ""}
                ${disabled || reachedLimit ? "text-zinc-600 cursor-not-allowed" : "hover:bg-yellow-400/20 cursor-pointer"}
                ${isSelected ? "bg-yellow-400 text-black font-semibold hover:bg-yellow-400" : ""}
                ${!disabled && !isSelected && !reachedLimit && isCurrentMonth ? "text-zinc-300" : ""}
              `}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const SkillDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mockSkillsData, setMockSkillsData] = useState<
    Record<string, SkillApiResponse>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [bookedSlots, setBookedSlots] = useState<
    { date: string; timeSlot: string }[]
  >([]);

  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [message, setMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

 useEffect(() => {
  const fetchAvailability = async () => {
    try {
      if (!id) return;

      const data = await getOfferingAvailability(id);

      const offering = data.offering;
      const booked = data.bookedSlots;

      setMockSkillsData({
        [offering._id]: offering,
      });

      setBookedSlots(booked);
    } catch (error) {
      console.error("Error fetching availability:", error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchAvailability();
}, [id]);


  const skill = mockSkillsData[id || "1"];

  const availableDayNumbers = useMemo(() => {
    if (!skill) return [];
    return skill.availableDays.map((day) => dayMap[day]);
  }, [skill]);

 const isDateDisabled = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (date < today) return true;
  if (date > addDays(today, 30)) return true;
  if (!availableDayNumbers.includes(date.getDay())) return true;

  // 🚀 Disable if already booked for selected timeSlot
  if (selectedTimeSlot) {
    const isoDate = date.toISOString();

    const isBooked = bookedSlots.some(
      (slot) =>
        slot.date === isoDate &&
        slot.timeSlot === selectedTimeSlot
    );

    if (isBooked) return true;
  }

  return false;
};


  const totalCredits = skill
    ? skill.creditsPerSession * skill.totalSessions
    : 0;

  const handleSubmit = async () => {
    if (!selectedTimeSlot || selectedDates.length === 0) {
      alert("Please select time and dates");
      return;
    }

    await createBooking({
      offeringId: skill._id,
      sessionDate: selectedDates.map((date) => date.toISOString()),
      timeSlot: selectedTimeSlot,
    });

    setIsSubmitting(true);
    const sessionText =
      selectedDates.length > 1
        ? `${selectedDates.length} sessions`
        : "1 session";
    alert(
      `Request sent for ${sessionText} of ${skill.skillName} to ${skill.teacherName}!`,
    );
    setIsSubmitting(false);
    navigate("/dashboard");
  };

  const handleTimeSlotChange = (slot: string) => {
    setSelectedTimeSlot(slot);
    setSelectedDates([]);
  };

  const handleDateToggle = (date: Date) => {
    setSelectedDates((prev) => {
      const isAlreadySelected = prev.some((selectedDate) =>
        isSameDay(selectedDate, date),
      );
      if (isAlreadySelected) {
        return prev.filter((selectedDate) => !isSameDay(selectedDate, date));
      } else {
        return [...prev, date].sort((a, b) => a.getTime() - b.getTime());
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading skill details...</p>
        </div>
      </div>
    );
  }

  if (!skill) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">
            Skill not found
          </h1>
          <p className="text-zinc-400 mb-4">
            The skill you're looking for doesn't exist.
          </p>
          <Link
            to="/skills"
            className="text-yellow-400 hover:text-yellow-300 underline"
          >
            Back to Skills
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-black/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-yellow-400">
            SkillSwap
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              to="/skills"
              className="text-zinc-400 hover:text-white text-sm"
            >
              Skills
            </Link>
            <Link
              to="/dashboard"
              className="text-zinc-400 hover:text-white text-sm"
            >
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-zinc-400 hover:text-yellow-400 mb-6 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Skill Details - Left */}
          <div className="lg:col-span-3 space-y-6">
            {/* Main Card */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xs text-yellow-400 font-medium uppercase tracking-wider">
                  {skill.category}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full border ${levelColors[skill.experienceLevel]}`}
                >
                  {skill.experienceLevel}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3">
                {skill.skillName}
              </h1>

              <p className="text-zinc-400 text-sm sm:text-base mb-6">
                {skill.description}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
                  <Clock className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                  <p className="text-white font-semibold text-sm">
                    {skill.sessionDuration} min
                  </p>
                  <p className="text-zinc-500 text-xs">per session</p>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
                  <CalendarIcon className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                  <p className="text-white font-semibold text-sm">
                    {skill.totalSessions}
                  </p>
                  <p className="text-zinc-500 text-xs">sessions</p>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 mx-auto mb-1" />
                  <p className="text-white font-semibold text-sm">
                    {skill.rating}
                  </p>
                  <p className="text-zinc-500 text-xs">
                    {skill.reviewCount} reviews
                  </p>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
                  <Coins className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                  <p className="text-white font-semibold text-sm">
                    {skill.creditsPerSession}
                  </p>
                  <p className="text-zinc-500 text-xs">credits/session</p>
                </div>
              </div>
            </div>

            {/* Teacher */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Teacher</h2>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                  <User className="w-6 h-6 text-zinc-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    {skill.teacherName}
                  </h3>
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm text-white">{skill.rating}</span>
                    <span className="text-sm text-zinc-500">
                      ({skill.reviewCount})
                    </span>
                  </div>
                  <p className="text-sm text-zinc-400">{skill.teacherBio}</p>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                Availability
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-zinc-500 mb-2">Days</p>
                  <div className="flex flex-wrap gap-2">
                    {skill.availableDays.map((day) => (
                      <span
                        key={day}
                        className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full text-xs"
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-zinc-500 mb-2">Time Slots</p>
                  <div className="flex flex-wrap gap-2">
                    {skill.availableTimeSlots.map((slot) => (
                      <span
                        key={slot}
                        className="px-3 py-1 border border-zinc-700 text-zinc-300 rounded-full text-xs"
                      >
                        {formatTimeSlot(slot)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Panel - Right */}
          <div className="lg:col-span-2">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 sm:p-6 lg:sticky lg:top-24">
              <h2 className="text-lg font-semibold text-white mb-5">
                Book Sessions
              </h2>

              {/* Step 1: Time Selection */}
              <div className="mb-5">
                <label className="text-sm text-zinc-400 mb-2 block">
                  <span className="inline-flex items-center justify-center w-5 h-5 bg-yellow-400 text-black text-xs font-bold rounded-full mr-2">
                    1
                  </span>
                  Select Time
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {skill.availableTimeSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => handleTimeSlotChange(slot)}
                      className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                        selectedTimeSlot === slot
                          ? "bg-yellow-400 text-black border-yellow-400 font-medium"
                          : "bg-zinc-800 text-zinc-300 border-zinc-700 hover:border-yellow-400/50"
                      }`}
                    >
                      <Clock className="w-3 h-3 inline mr-1" />
                      {formatTimeSlot(slot)}
                    </button>
                  ))}
                </div>
                {selectedTimeSlot && (
                  <p className="text-xs text-yellow-400 mt-2 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {formatTimeSlot(selectedTimeSlot)} selected
                  </p>
                )}
              </div>

              {/* Step 2: Date Selection */}
              <div
                className={`mb-5 transition-opacity duration-300 ${selectedTimeSlot ? "opacity-100" : "opacity-40 pointer-events-none"}`}
              >
                <label className="text-sm text-zinc-400 mb-2 block">
                  <span className="inline-flex items-center justify-center w-5 h-5 bg-yellow-400 text-black text-xs font-bold rounded-full mr-2">
                    2
                  </span>
                  Select Dates ({selectedDates.length}/{skill.totalSessions}{" "}
                  sessions)
                </label>
                {!selectedTimeSlot && (
                  <p className="text-xs text-zinc-500 mb-2">
                    Select a time first
                  </p>
                )}
                {selectedTimeSlot &&
                  selectedDates.length < skill.totalSessions && (
                    <p className="text-xs text-zinc-400 mb-2">
                      Select {skill.totalSessions - selectedDates.length} more
                      date
                      {skill.totalSessions - selectedDates.length > 1
                        ? "s"
                        : ""}
                    </p>
                  )}
                {selectedDates.length === skill.totalSessions && (
                  <p className="text-xs text-green-400 mb-2 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    All {skill.totalSessions} sessions selected!
                  </p>
                )}
                <div className="bg-zinc-800 rounded-lg overflow-hidden">
                  <SimpleCalendar
                    selectedDates={selectedDates}
                    onSelect={handleDateToggle}
                    isDisabled={isDateDisabled}
                    maxSessions={skill.totalSessions}
                  />
                </div>
                {selectedDates.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-zinc-400 font-semibold">
                      Selected dates:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {selectedDates.map((date) => (
                        <span
                          key={date.toISOString()}
                          className="text-xs bg-yellow-400/20 text-yellow-400 px-2 py-1 rounded"
                        >
                          {format(date, "MMM d")}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Message */}
              <div className="mb-5">
                <label className="text-sm text-zinc-400 mb-2 block">
                  <MessageSquare className="w-3 h-3 inline mr-1" />
                  Message (optional)
                </label>
                <textarea
                  placeholder="Introduce yourself..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={2}
                  maxLength={300}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white text-sm placeholder:text-zinc-500 focus:border-yellow-400 focus:outline-none resize-none"
                />
                <p className="text-xs text-zinc-500 mt-1 text-right">
                  {message.length}/300
                </p>
              </div>

              {/* Summary */}
              <div className="bg-zinc-800/50 rounded-lg p-4 mb-5">
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-zinc-400">
                    {skill.creditsPerSession} × {skill.totalSessions} session
                    {skill.totalSessions > 1 ? "s" : ""}
                  </span>
                  <span className="text-yellow-400 font-semibold">
                    {totalCredits} credits
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-zinc-700">
                  <span className="font-semibold text-white">Total</span>
                  <span className="text-yellow-400 font-bold text-lg">
                    {totalCredits} credits
                  </span>
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={
                  selectedDates.length < 1 || !selectedTimeSlot || isSubmitting
                }
                className="w-full py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-yellow-400"
              >
                {isSubmitting
                  ? "Sending..."
                  : selectedDates.length >= 1
                    ? "Send Request"
                    : `Select atleast one date`}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-zinc-500 text-sm">
            © 2026 SkillSwap. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SkillDetail;

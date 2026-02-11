import { useState } from "react";
import { offerSkill } from "../../services/service";

interface OfferSkillsProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const categories = [
  "Programming",
  "Design",
  "Music",
  "Languages",
  "Business",
  "Marketing",
  "Photography",
  "Writing",
  "Fitness",
  "Cooking",
  "Other",
];

const experienceLevels = [
  { value: "Beginner", label: "Beginner (1-2 years)" },
  { value: "Intermediate", label: "Intermediate (3-5 years)" },
  { value: "Advanced", label: "Advanced (5-10 years)" },
  { value: "Expert", label: "Expert (10+ years)" },
];

const sessionDurations = [
  { value: "30", label: "30 minutes" },
  { value: "45", label: "45 minutes" },
  { value: "60", label: "1 hour" },
  { value: "90", label: "1.5 hours" },
  { value: "120", label: "2 hours" },
];

const weekDays = [
  { value: "Monday", label: "Mon" },
  { value: "Tuesday", label: "Tue" },
  { value: "Wednesday", label: "Wed" },
  { value: "Thursday", label: "Thu" },
  { value: "Friday", label: "Fri" },
  { value: "Saturday", label: "Sat" },
  { value: "Sunday", label: "Sun" },
];

// Generate time slots based on session duration
const generateTimeSlots = (durationMinutes: number) => {
  const slots: { value: string; label: string }[] = [];

  const startMinutes = 6 * 60;  // 6:00 AM
  const endMinutes = 22 * 60;   // 10:00 PM

  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    const period = h >= 12 ? "PM" : "AM";
    const displayHour = h % 12 === 0 ? 12 : h % 12;
    return `${displayHour}:${m.toString().padStart(2, "0")} ${period}`;
  };

  for (
    let start = startMinutes;
    start + durationMinutes <= endMinutes;
    start += durationMinutes
  ) {
    const end = start + durationMinutes;

    slots.push({
      value: `${start}-${end}`, // minutes-based (clean)
      label: `${formatTime(start)} - ${formatTime(end)}`,
    });
  }

  return slots;
};


export function OfferSkills({ isOpen, onOpenChange }: OfferSkillsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    skillName: "",
    category: "",
    description: "",
    experienceLevel: "",
    creditsPerSession: 1,
    sessionDuration: "",
    totalSessions: 1,
    availableDays: [] as string[],
    availableTimeSlots: [] as string[],
    prerequisites: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalCredits = formData.creditsPerSession * formData.totalSessions;
  const timeSlots = formData.sessionDuration
    ? generateTimeSlots(parseInt(formData.sessionDuration))
    : [];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleNumberChange = (name: string, value: number) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const toggleDay = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day],
    }));
    if (errors.availableDays) {
      setErrors((prev) => ({ ...prev, availableDays: "" }));
    }
  };

  const toggleTimeSlot = (slot: string) => {
    setFormData((prev) => ({
      ...prev,
      availableTimeSlots: prev.availableTimeSlots.includes(slot)
        ? prev.availableTimeSlots.filter((s) => s !== slot)
        : [...prev.availableTimeSlots, slot],
    }));
    if (errors.availableTimeSlots) {
      setErrors((prev) => ({ ...prev, availableTimeSlots: "" }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (formData.skillName.length < 3) {
      newErrors.skillName = "Skill name must be at least 3 characters";
    }
    if (!formData.category) {
      newErrors.category = "Please select a category";
    }
    if (formData.description.length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    }
    if (!formData.experienceLevel) {
      newErrors.experienceLevel = "Please select your experience level";
    }
    if (formData.creditsPerSession < 1 || formData.creditsPerSession > 10) {
      newErrors.creditsPerSession = "Credits must be between 1 and 10";
    }
    if (!formData.sessionDuration) {
      newErrors.sessionDuration = "Please select session duration";
    }
    if (formData.totalSessions < 1 || formData.totalSessions > 50) {
      newErrors.totalSessions = "Sessions must be between 1 and 50";
    }
    if (formData.availableDays.length === 0) {
      newErrors.availableDays = "Select at least one day";
    }
    if (formData.availableTimeSlots.length === 0) {
      newErrors.availableTimeSlots = "Select at least one time slot";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const payload = { 
        ...formData, 
        totalCredits,
        rating: 0, 
        reviewCount: 0 
      };

      await offerSkill(payload);
      alert(
        `Success! "${formData.skillName}" is now visible in the marketplace.`,
      );

      setFormData({
        skillName: "",
        category: "",
        description: "",
        experienceLevel: "",
        creditsPerSession: 1,
        sessionDuration: "",
        totalSessions: 1,
        availableDays: [],
        availableTimeSlots: [],
        prerequisites: "",
      });

      setErrors({});
      onOpenChange(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Something went wrong. Please try again.");
      }

      console.error("Error offering skill:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => onOpenChange(true)}
        className="flex items-center gap-2 px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition-all"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        Offer a Skill
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto"
          onClick={() => onOpenChange(false)}
        >
          <div
            className="bg-gray-900 border-2 border-yellow-400 rounded-xl w-full max-w-3xl my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="border-b border-gray-800 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-400/10 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    Offer a Skill
                  </h2>
                </div>
                <button
                  onClick={() => onOpenChange(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm">
                Share your expertise with the community. Fill in the details
                below to list your skill.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={onSubmit}
              className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-h-[calc(90vh-180px)] overflow-y-auto"
            >
              {/* Skill Name & Category Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Skill Name
                  </label>
                  <input
                    type="text"
                    name="skillName"
                    value={formData.skillName}
                    onChange={handleChange}
                    placeholder="e.g., React & TypeScript"
                    className={`w-full px-4 py-2.5 sm:py-3 bg-black border-2 rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors text-sm sm:text-base ${
                      errors.skillName
                        ? "border-red-500"
                        : "border-gray-800 focus:border-yellow-400"
                    }`}
                  />
                  {errors.skillName && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">
                      {errors.skillName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 sm:py-3 bg-black border-2 rounded-lg text-white focus:outline-none transition-colors cursor-pointer text-sm sm:text-base ${
                      errors.category
                        ? "border-red-500"
                        : "border-gray-800 focus:border-yellow-400"
                    }`}
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">
                      {errors.category}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe what you'll teach, your teaching style, and what learners can expect..."
                  rows={4}
                  className={`w-full px-4 py-2.5 sm:py-3 bg-black border-2 rounded-lg text-white placeholder-gray-500 focus:outline-none resize-none transition-colors text-sm sm:text-base ${
                    errors.description
                      ? "border-red-500"
                      : "border-gray-800 focus:border-yellow-400"
                  }`}
                />
                <p className="text-gray-500 text-xs mt-1">
                  A detailed description helps learners understand what you
                  offer.
                </p>
                {errors.description && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Experience & Duration Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
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
                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                      />
                    </svg>
                    Your Experience
                  </label>
                  <select
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 sm:py-3 bg-black border-2 rounded-lg text-white focus:outline-none transition-colors cursor-pointer text-sm sm:text-base ${
                      errors.experienceLevel
                        ? "border-red-500"
                        : "border-gray-800 focus:border-yellow-400"
                    }`}
                  >
                    <option value="">Select level</option>
                    {experienceLevels.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                  {errors.experienceLevel && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">
                      {errors.experienceLevel}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Session Duration
                  </label>
                  <select
                    name="sessionDuration"
                    value={formData.sessionDuration}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 sm:py-3 bg-black border-2 rounded-lg text-white focus:outline-none transition-colors cursor-pointer text-sm sm:text-base ${
                      errors.sessionDuration
                        ? "border-red-500"
                        : "border-gray-800 focus:border-yellow-400"
                    }`}
                  >
                    <option value="">Select duration</option>
                    {sessionDurations.map((duration) => (
                      <option key={duration.value} value={duration.value}>
                        {duration.label}
                      </option>
                    ))}
                  </select>
                  {errors.sessionDuration && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">
                      {errors.sessionDuration}
                    </p>
                  )}
                </div>
              </div>

              {/* Credits & Sessions Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
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
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                    Credits Per Session
                  </label>
                  <input
                    type="number"
                    name="creditsPerSession"
                    value={formData.creditsPerSession}
                    onChange={(e) =>
                      handleNumberChange(
                        "creditsPerSession",
                        parseInt(e.target.value) || 1,
                      )
                    }
                    min={1}
                    max={10}
                    className={`w-full px-4 py-2.5 sm:py-3 bg-black border-2 rounded-lg text-white focus:outline-none transition-colors text-sm sm:text-base ${
                      errors.creditsPerSession
                        ? "border-red-500"
                        : "border-gray-800 focus:border-yellow-400"
                    }`}
                  />
                  <p className="text-gray-500 text-xs mt-1">
                    1-10 credits per session
                  </p>
                  {errors.creditsPerSession && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">
                      {errors.creditsPerSession}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Total Sessions
                  </label>
                  <input
                    type="number"
                    name="totalSessions"
                    value={formData.totalSessions}
                    onChange={(e) =>
                      handleNumberChange(
                        "totalSessions",
                        parseInt(e.target.value) || 1,
                      )
                    }
                    min={1}
                    max={50}
                    className={`w-full px-4 py-2.5 sm:py-3 bg-black border-2 rounded-lg text-white focus:outline-none transition-colors text-sm sm:text-base ${
                      errors.totalSessions
                        ? "border-red-500"
                        : "border-gray-800 focus:border-yellow-400"
                    }`}
                  />
                  <p className="text-gray-500 text-xs mt-1">
                    Number of sessions you'll offer
                  </p>
                  {errors.totalSessions && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">
                      {errors.totalSessions}
                    </p>
                  )}
                </div>
              </div>

              {/* Total Credits Calculation */}
              <div className="bg-yellow-400/10 border-2 border-yellow-400/30 rounded-lg p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
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
                        d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="font-semibold text-white text-sm sm:text-base">
                      Total Credits for Full Course
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs sm:text-sm text-gray-400">
                      {formData.creditsPerSession} × {formData.totalSessions}{" "}
                      sessions =
                    </span>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-400 rounded-lg">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-black"
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
                      <span className="font-bold text-black text-sm sm:text-base">
                        {totalCredits}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Available Days */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Available Days
                </label>
                <p className="text-gray-500 text-xs mb-3">
                  Select the days you're available to teach
                </p>
                <div className="flex flex-wrap gap-2">
                  {weekDays.map((day) => {
                    const isChecked = formData.availableDays.includes(
                      day.value,
                    );
                    return (
                      <button
                        key={day.value}
                        type="button"
                        onClick={() => toggleDay(day.value)}
                        className={`px-3 sm:px-4 py-2 rounded-lg border-2 font-medium transition-all text-xs sm:text-sm ${
                          isChecked
                            ? "bg-yellow-400 text-black border-yellow-400"
                            : "bg-black text-white border-gray-800 hover:border-yellow-400"
                        }`}
                      >
                        {day.label}
                      </button>
                    );
                  })}
                </div>
                {errors.availableDays && (
                  <p className="text-red-500 text-xs sm:text-sm mt-2">
                    {errors.availableDays}
                  </p>
                )}
              </div>

              {/* Time Slots */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Preferred Time Slots
                </label>
                <p className="text-gray-500 text-xs mb-3">
                  {formData.sessionDuration
                    ? `Select your available ${formData.sessionDuration}-minute time slots`
                    : "Please select session duration first to see available slots"}
                </p>
                {formData.sessionDuration ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-[200px] overflow-y-auto p-1 bg-black/50 rounded-lg border border-gray-800">
                    {timeSlots.map((slot) => {
                      const isChecked = formData.availableTimeSlots.includes(
                        slot.value,
                      );
                      return (
                        <button
                          key={slot.value}
                          type="button"
                          onClick={() => toggleTimeSlot(slot.value)}
                          className={`p-2 rounded-lg border-2 font-medium transition-all text-xs text-center ${
                            isChecked
                              ? "bg-yellow-400 text-black border-yellow-400"
                              : "bg-black text-white border-gray-800 hover:border-yellow-400"
                          }`}
                        >
                          {slot.label}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 border-2 border-dashed border-gray-700 rounded-lg text-center text-gray-500 text-xs sm:text-sm">
                    Select a session duration above to see time slots
                  </div>
                )}
                {errors.availableTimeSlots && (
                  <p className="text-red-500 text-xs sm:text-sm mt-2">
                    {errors.availableTimeSlots}
                  </p>
                )}
              </div>

              {/* Prerequisites */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Prerequisites (Optional)
                </label>
                <input
                  type="text"
                  name="prerequisites"
                  value={formData.prerequisites}
                  onChange={handleChange}
                  placeholder="e.g., Basic JavaScript knowledge, acoustic guitar..."
                  className="w-full px-4 py-2.5 sm:py-3 bg-black border-2 border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition-colors text-sm sm:text-base"
                />
                <p className="text-gray-500 text-xs mt-1">
                  Any requirements learners should have before starting.
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-2.5 sm:py-3 border-2 border-gray-700 text-white font-semibold rounded-lg hover:border-yellow-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-2.5 sm:py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {isSubmitting ? "Posting..." : "Post Skill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

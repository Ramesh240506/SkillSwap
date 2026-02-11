export interface OfferSkillPayload {
  teacherName: string;
  skillName: string;
  category: string;
  description: string;
  experienceLevel: string;
  creditsPerSession: number;
  sessionDuration: string;
  totalSessions: number;
  availableDays: string[];
  availableTimeSlots: string[];
  prerequisites: string;
  totalCredits: number;
  rating: number;
  reviewCount: number;
}

export interface SkillApiResponse {
  _id: string;
  skillName: string;
  category: string;
  teacherName: string;
  rating: number;
  reviewCount: number;
  experienceLevel: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  creditsPerSession: number;
  totalSessions: number;
  sessionDuration: number;
  description: string;
  availableDays: string[];
  availableTimeSlots: string[];
  teacherBio?: string;
}
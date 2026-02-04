export interface OfferSkillPayload {
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
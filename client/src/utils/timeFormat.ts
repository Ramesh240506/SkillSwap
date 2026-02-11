/**
 * Convert minutes since midnight to human-readable time format
 * @param slot - Time slot in format "startMinutes-endMinutes" (e.g., "1080-1200")
 * @returns Formatted time slot (e.g., "6:00 PM - 8:00 PM")
 */
export const formatTimeSlot = (slot: string): string => {
  const [startMinutes, endMinutes] = slot.split('-').map(Number);
  
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
  };
  
  return `${formatTime(startMinutes)} - ${formatTime(endMinutes)}`;
};

/**
 * Convert minutes since midnight to 24-hour format
 * @param slot - Time slot in format "startMinutes-endMinutes" (e.g., "1080-1200")
 * @returns Formatted time slot in 24-hour format (e.g., "18:00 - 20:00")
 */
export const formatTimeSlot24Hour = (slot: string): string => {
  const [startMinutes, endMinutes] = slot.split('-').map(Number);
  
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };
  
  return `${formatTime(startMinutes)} - ${formatTime(endMinutes)}`;
};

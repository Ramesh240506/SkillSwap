import axios from "axios";
import type { LoginResponse } from "../types/auth.types";
import type { OfferSkillPayload } from "../types/skills.types";

const API_URL = "http://localhost:5000/api";


export const register = async (name: string, email: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/register`, {
    name,
    email,
    password
  });
  return response.data;
}
export const login = async (email: string, password: string)
    : Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(`${API_URL}/auth/login`, {
    email,
    password
  });
  return response.data;
}

export const offerSkill = async (skillData: OfferSkillPayload) => {
  const response = await axios.post(`${API_URL}/createSkills`, skillData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    }
  );
  return response.data;
}

export const getOfferedSkills = async () => {
  try {
    const response = await axios.get(`${API_URL}/getSkills`);
    console.log("getOfferedSkills response:", response.data);
    return response.data;
  } catch (error) {
    console.error("getOfferedSkills error:", error);
    if (axios.isAxiosError(error)) {
      console.error("Status:", error.response?.status);
      console.error("Response data:", error.response?.data);
    }
    throw error;
  }
}
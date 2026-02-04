export interface LoginResponse {
  accessToken: string,
  user:{
    _id: string,
    name: string,
    email: string
  }

}
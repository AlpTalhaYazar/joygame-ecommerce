export interface LoginResponse {
  token: string;
  user: LoginResponseUser;
}

export interface LoginResponseUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  businessStatus: number;
  roles: string[];
}

export interface ForgotPasswordResponse {
  resetToken: string;
  expiryDate: Date;
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  resetToken: string;
  newPassword: string;
}

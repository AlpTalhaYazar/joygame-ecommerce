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

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponseDto {
  token: string;
  user: AuthUserDto;
}

export interface AuthUserDto {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  businessStatus: number;
  roles: string[];
}

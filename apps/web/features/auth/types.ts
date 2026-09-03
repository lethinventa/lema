export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignInResult {
  success: boolean;
  // UC-AUTH-002: generic on purpose — never reveals whether the email or
  // the password was wrong.
  error?: string;
}

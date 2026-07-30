export interface ProfileData {
  name: string;
  email: string;
  password: string;
  location: string;
}

export interface ProfileFormValues {
  name: string;
  location: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface FormErrors {
  name?: string;
  location?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  form?: string;
}

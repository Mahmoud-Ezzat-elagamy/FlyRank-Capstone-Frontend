import { useEffect, useState } from "react";
import type { FormErrors, ProfileData, ProfileFormValues } from "./profile.types";

function createInitialValues(profile: ProfileData): ProfileFormValues {
  return {
    name: profile.name,
    location: profile.location,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };
}

function validatePassword(value: string) {
  return /^(?=.*[A-Z]).{8,}$/.test(value);
}

function validate(values: ProfileFormValues, profile: ProfileData): FormErrors {
  const errors: FormErrors = {};

  if (!values.name.trim()) {
    errors.name = "Name is required.";
  }

  if (!values.location.trim()) {
    errors.location = "Location is required.";
  }

  if (!values.currentPassword.trim()) {
    errors.currentPassword = "Enter your current password to save changes.";
  } else if (values.currentPassword !== profile.password) {
    errors.currentPassword = "Current password is incorrect.";
  }

  const wantsPasswordChange =
    values.newPassword.length > 0 || values.confirmPassword.length > 0;

  if (wantsPasswordChange && !validatePassword(values.newPassword)) {
    errors.newPassword =
      "Password must be at least 8 characters and include one capital letter.";
  }

  if (wantsPasswordChange && !values.confirmPassword) {
    errors.confirmPassword = "Confirm your new password.";
  } else if (wantsPasswordChange && values.newPassword !== values.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}

export function useProfileForm(
  profile: ProfileData,
  onSave: (profile: ProfileData) => void,
) {
  const [values, setValues] = useState(() => createInitialValues(profile));
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    setValues(createInitialValues(profile));
    setErrors({});
    setSuccessMessage("");
  }, [profile]);

  function updateField(field: keyof ProfileFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined, form: undefined }));
  }

  function reset() {
    setValues(createInitialValues(profile));
    setErrors({});
    setSuccessMessage("");
  }

  async function submit() {
    const nextErrors = validate(values, profile);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return false;
    }

    setIsSaving(true);
    setSuccessMessage("");

    await new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });

    onSave({
      ...profile,
      name: values.name.trim(),
      location: values.location.trim(),
      password: values.newPassword.trim() ? values.newPassword : profile.password,
    });

    setIsSaving(false);
    setSuccessMessage("Profile updated successfully.");
    setValues((current) => ({
      ...current,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));

    return true;
  }

  return {
    values,
    errors,
    isSaving,
    successMessage,
    updateField,
    reset,
    submit,
  };
}

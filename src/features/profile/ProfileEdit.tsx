import { useNavigate } from "react-router";
import type { FormEvent } from "react";
import { useProfile } from "./ProfileContext";
import Spinner from "./Spinner";
import { useProfileForm } from "./useProfileForm";

export default function ProfileEdit() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useProfile();
  const form = useProfileForm(profile, updateProfile);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const saved = await form.submit();

    if (saved) {
      navigate("/profile");
    }
  }

  function handleCancel() {
    form.reset();
    navigate("/profile");
  }

  return (
    <section className="profile-page">
      <header className="profile-page__header">
        <p className="profile-page__eyebrow">Edit profile</p>
        <h2>Update your details</h2>
        <p>
          Keep your name and location current. If you change your password,
          first confirm the old one, then type the new password twice.
        </p>
      </header>

      <form className="profile-form" onSubmit={handleSubmit} noValidate>
        <div className="profile-form__grid">
          <label className="profile-field">
            <span>Name</span>
            <input
              type="text"
              value={form.values.name}
              onChange={(event) =>
                form.updateField("name", event.currentTarget.value)
              }
              aria-invalid={Boolean(form.errors.name)}
              aria-describedby={form.errors.name ? "name-error" : undefined}
            />
            {form.errors.name ? (
              <small id="name-error" role="alert">
                {form.errors.name}
              </small>
            ) : null}
          </label>

          <label className="profile-field">
            <span>Email</span>
            <input
              type="email"
              value={profile.email}
              disabled
              aria-disabled="true"
            />
            <small>Email is read only.</small>
          </label>

          <label className="profile-field profile-field--full">
            <span>Location</span>
            <input
              type="text"
              value={form.values.location}
              onChange={(event) =>
                form.updateField("location", event.currentTarget.value)
              }
              aria-invalid={Boolean(form.errors.location)}
              aria-describedby={
                form.errors.location ? "location-error" : undefined
              }
            />
            {form.errors.location ? (
              <small id="location-error" role="alert">
                {form.errors.location}
              </small>
            ) : null}
          </label>

          <label className="profile-field">
            <span>Current password</span>
            <input
              type="password"
              value={form.values.currentPassword}
              onChange={(event) =>
                form.updateField("currentPassword", event.currentTarget.value)
              }
              aria-invalid={Boolean(form.errors.currentPassword)}
              aria-describedby={
                form.errors.currentPassword
                  ? "current-password-error"
                  : undefined
              }
              autoComplete="current-password"
            />
            {form.errors.currentPassword ? (
              <small id="current-password-error" role="alert">
                {form.errors.currentPassword}
              </small>
            ) : null}
          </label>

          <label className="profile-field">
            <span>New password</span>
            <input
              type="password"
              value={form.values.newPassword}
              onChange={(event) =>
                form.updateField("newPassword", event.currentTarget.value)
              }
              aria-invalid={Boolean(form.errors.newPassword)}
              aria-describedby={
                form.errors.newPassword ? "new-password-error" : undefined
              }
              autoComplete="new-password"
            />
            {form.errors.newPassword ? (
              <small id="new-password-error" role="alert">
                {form.errors.newPassword}
              </small>
            ) : (
              <small>At least 8 characters with one capital letter.</small>
            )}
          </label>

          <label className="profile-field">
            <span>Confirm new password</span>
            <input
              type="password"
              value={form.values.confirmPassword}
              onChange={(event) =>
                form.updateField("confirmPassword", event.currentTarget.value)
              }
              aria-invalid={Boolean(form.errors.confirmPassword)}
              aria-describedby={
                form.errors.confirmPassword
                  ? "confirm-password-error"
                  : undefined
              }
              autoComplete="new-password"
            />
            {form.errors.confirmPassword ? (
              <small id="confirm-password-error" role="alert">
                {form.errors.confirmPassword}
              </small>
            ) : null}
          </label>
        </div>

        {form.errors.form ? (
          <p className="profile-form__error" role="alert">
            {form.errors.form}
          </p>
        ) : null}

        {form.successMessage ? (
          <p className="profile-form__success" aria-live="polite">
            {form.successMessage}
          </p>
        ) : null}

        <div className="profile-form__actions">
          <button
            type="button"
            className="profile-button profile-button--ghost"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="profile-button profile-button--primary"
            disabled={form.isSaving}
          >
            {form.isSaving ? (
              <>
                <Spinner />
                Saving...
              </>
            ) : (
              "Save changes"
            )}
          </button>
        </div>
      </form>
    </section>
  );
}

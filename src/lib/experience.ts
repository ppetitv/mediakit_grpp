const EXPERIENCE_LOADED_KEY = "grpp-experience-loaded";

export function hasLoadedExperience() {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(EXPERIENCE_LOADED_KEY) === "1";
}

export function markExperienceLoaded() {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(EXPERIENCE_LOADED_KEY, "1");
}

interface OnboardingStatus {
  profileCompleted: boolean;
  addressCompleted: boolean;
  completedAt?: string;
}

export const onboardingStorage = {
  getStatus: (): OnboardingStatus | null => {
    if (typeof window === "undefined") return null;
    const data = localStorage.getItem("onboardingStatus");
    return data ? JSON.parse(data) : null;
  },

  setProfileCompleted: () => {
    if (typeof window === "undefined") return;
    const status = onboardingStorage.getStatus() || {
      profileCompleted: false,
      addressCompleted: false,
    };
    status.profileCompleted = true;
    status.completedAt = new Date().toISOString();
    localStorage.setItem("onboardingStatus", JSON.stringify(status));
  },

  clearStatus: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("onboardingStatus");
  },
};

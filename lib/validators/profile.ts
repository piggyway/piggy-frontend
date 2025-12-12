export const profileValidators = {
  firstName: (value: string): string => {
    if (!value.trim()) return "First name is required";
    if (value.length < 2) return "First name must be at least 2 characters";
    if (value.length > 50) return "First name must not exceed 50 characters";
    return "";
  },

  lastName: (value: string): string => {
    if (!value.trim()) return "Last name is required";
    if (value.length < 2) return "Last name must be at least 2 characters";
    if (value.length > 50) return "Last name must not exceed 50 characters";
    return "";
  },

  phone: (value: string): string => {
    if (!value) return ""; // Optional field
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(value)) return "Please enter a valid phone number";
    if (value.replace(/\D/g, "").length < 10)
      return "Phone number must be at least 10 digits";
    return "";
  },

  email: (value: string): string => {
    if (!value.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Please enter a valid email address";
    return "";
  },
};

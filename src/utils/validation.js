// Validate email address
export const validateEmail = (email) => {
    // Email validation logic
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  export const validatePassword = (password) => {
    const minLength = 8;
    if (password.length < minLength) {
      return false;
    }
    return true;
  };
  
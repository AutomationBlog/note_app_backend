export const generateVerificationToken = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const generateUserID = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

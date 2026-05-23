// Flowssom Room Code Generator

export const generateRoomCode = (): string => {
  // Using characters that are easy to distinguish (no I, O, 0, 1)
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return code;
};

export const validateRoomCode = (code: string): boolean => {
  const normalized = code.toUpperCase().trim();
  if (normalized.length !== 6) return false;
  
  const validChars = /^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]+$/;
  return validChars.test(normalized);
};

export const normalizeRoomCode = (code: string): string => {
  return code.toUpperCase().trim();
};

export default {
  generateRoomCode,
  validateRoomCode,
  normalizeRoomCode,
};

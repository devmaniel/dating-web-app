// Mock data for testing sign up errors
export const existingEmails = ['test@example.com', 'john@example.com', 'melcomaniel.mm@gmail.com'];

export function checkEmailExists(email: string): boolean {
  return existingEmails.includes(email.toLowerCase());
}


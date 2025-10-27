// Mock data for testing sign up errors
export const existingEmails = ['test@example.com', 'john@example.com', 'melcomaniel.mm@gmail.com'];
export const existingUsernames = ['testuser', 'johndoe', 'melco.maniel'];

export function checkEmailExists(email: string): boolean {
  return existingEmails.includes(email.toLowerCase());
}

export function checkUsernameExists(username: string): boolean {
  return existingUsernames.includes(username.toLowerCase());
}


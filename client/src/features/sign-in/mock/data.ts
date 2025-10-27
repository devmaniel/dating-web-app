export type MockUser = {
  email: string;
  password: string;
  username: string;
};

export const MOCK_USERS: MockUser[] = [
  {
    email: 'johndoe@mail.com',
    password: '!Password123',
    username: 'johndoe',
  },
];

export const validateCredentials = (
  usernameOrEmail: string,
  password: string
): boolean => {
  return MOCK_USERS.some(
    (user) =>
      (user.email === usernameOrEmail || user.username === usernameOrEmail) &&
      user.password === password
  );
};


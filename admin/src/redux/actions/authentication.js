export const SIGN_IN = 'SIGN_IN';
export const signIn = (password) => ({
  type: SIGN_IN,
  route: `/api/admin/login`,
  method: 'POST',
  body: { password },
});

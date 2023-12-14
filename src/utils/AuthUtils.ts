export const getLocalAuthenticationUid = (): string => {
  const uid = window.localStorage.getItem('localAuthenticationUid');
  if (uid === null) {
    const newUid = createRandomString(32);
    window.localStorage.setItem('localAuthenticationUid', newUid);
    return newUid;
  }
  return uid;
};

const createRandomString = (length: number): string => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const randomValues = new Uint32Array(length);
  window.crypto.getRandomValues(randomValues);
  return Array.from(randomValues, (x) => chars[x % chars.length]).join('');
};

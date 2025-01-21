export function decodeJWT(jwtToken: string) {
  const arr = jwtToken.split(".");

  return {
    header: JSON.parse(atob(arr[0])),
    body: JSON.parse(atob(arr[1])),
  };
}

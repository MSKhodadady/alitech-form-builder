export function errLog(location: string, error: any) {
  console.error(`[${location}] - error: ${error}`);
  console.error(error);
}

export function apiErrLog(location: string, status: number, text: string) {
  console.error(`[API][${location}] - status=${status} - text=${text}`);
}

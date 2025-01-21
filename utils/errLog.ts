/**
 * Use this function every where in app for logging errors in `catch` blocks.
 * @param location
 * @param error
 */
export function errLog(location: string, error: any) {
  console.error(`[${location}] - error: ${error}`);
  console.error(error);
}

/**
 * Call this function every where in app for logging unknown api errors.
 * @param location
 * @param status
 * @param text
 */
export function apiErrLog(location: string, status: number, text: string) {
  console.error(`[API][${location}] - status=${status} - text=${text}`);
}

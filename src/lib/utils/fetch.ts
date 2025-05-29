export async function fetchWithRetry(
  url: string,
  maxRetries = 3,
  initialDelay = 1000,
  onRetry?: (attempt: number) => void,
) {
  let delay = initialDelay;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      if (attempt === maxRetries - 1) {
        throw error;
      }
      // Wait for the delay before retrying
      await new Promise((resolve) => setTimeout(resolve, delay));
      // Increase delay exponentially
      delay *= 2;
      // Call the retry callback if provided
      onRetry?.(attempt + 1);
    }
  }
}

export function validatePrompt(value: string): string | null {
  if (!value.trim()) return 'Enter a prompt before sending.';
  if (value.length > 2000) return 'Prompt must be 2000 characters or fewer.';
  return null;
}

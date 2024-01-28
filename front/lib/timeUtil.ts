export function secondToDisplayTime(seconds: number | undefined) {
  if (seconds === undefined || seconds === null) {
    return '--:--';
  }

  const minutes = Math.floor(seconds / 60);
  const second = seconds % 60 | 0;

  return `${minutes}:${second.toString().padStart(2, '0')}`;
}

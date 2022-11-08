export function toDaysMinutesSeconds(totalSeconds: number) {
  const seconds = Math.floor(totalSeconds % 60);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const days = Math.floor(totalSeconds / (3600 * 24));

  const secondsStr = makeHumanReadable(seconds, "second");
  const minutesStr = makeHumanReadable(minutes, "minute");
  const hoursStr = makeHumanReadable(hours, "hour");
  const daysStr = makeHumanReadable(days, "day");

  return `${daysStr}${hoursStr}${minutesStr}${secondsStr}`.replace(/,\s*$/, "");
}

function makeHumanReadable(num: number, singular: string) {
  return num > 0
    ? num + (num === 1 ? ` ${singular}, ` : ` ${singular}s, `)
    : "";
}

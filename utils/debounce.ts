export const Debounce = (cb: (...args: any) => void, delay: number) => {
  let timer: NodeJS.Timeout;
  return (...args: any) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => cb(...args), delay);
  };
};

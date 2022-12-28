export function useInterval(callback: CallableFunction, interval: number): Interval {
  return new Interval(callback, interval);
}

export class Interval {
  private timer?: number;

  constructor(private callback: CallableFunction, private interval: number | undefined) {
  }

  start() {
    this.timer = setInterval(this.callback, this.interval);
  }

  stop() {
    clearInterval(this.timer);
    this.timer = undefined;
  }

  restart(interval = 0) {
    this.stop();

    if (interval) {
      this.interval = interval;
    }

    this.start();
  }
}
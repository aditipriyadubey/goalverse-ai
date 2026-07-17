/**
 * Minimal server-side logger. Exists so `no-console` can be enforced for
 * real (raw `console.log` is banned by lint) while startup/diagnostic
 * messages still have a single, intentional place to go through.
 * Not a logging framework — just an explicit, auditable seam.
 */
export const logger = {
  info: (message: string) => {
    // eslint-disable-next-line no-console
    console.info(message);
  },
  warn: (message: string) => {
    // eslint-disable-next-line no-console
    console.warn(message);
  },
  error: (message: string, err?: unknown) => {
    // eslint-disable-next-line no-console
    console.error(message, err instanceof Error ? err.stack : err);
  },
};
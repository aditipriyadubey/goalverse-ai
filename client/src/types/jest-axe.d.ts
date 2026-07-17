/// <reference types="vitest/globals" />

declare module 'jest-axe' {
  import type { AxeResults } from 'axe-core';

  export interface JestAxeConfigureOptions {
    globalOptions?: Record<string, unknown>;
    impactLevels?: string[];
  }

  export function axe(
    element: Element | Document,
    options?: Record<string, unknown>,
  ): Promise<AxeResults>;

  export function configureAxe(options?: JestAxeConfigureOptions): typeof axe;

  export const toHaveNoViolations: {
    toHaveNoViolations(received: AxeResults): {
      message(): string;
      pass: boolean;
    };
  };
}

// Extend Vitest's expect with the jest-axe matcher so TypeScript knows about
// expect(results).toHaveNoViolations() without needing @types/jest-axe.
interface CustomMatchers<R = unknown> {
  toHaveNoViolations(): R;
}

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}

export function assertIsDefined<T>(val: T): asserts val is NonNullable<T> {
  if (val === undefined || val === null) {
    // throw new AssertionError(
    //   `Expected 'val' to be defined, but received ${val}`
    // );
    throw new Error(`Expected 'val' to be defined, but received ${val}`);
  }
}

export function copyMatrix<A>(base: Array<Array<A>>): Array<Array<A>> {
  const result: Array<Array<A>> = [];
  for (const line of base) {
    result.push([...line]);
  }
  return result;
}

export function nextAlpha(s: string): string {
  const alpha = "abcdefghijklmnopqrstuvwxyz".split("");
  return alpha[alpha.indexOf(s.toLowerCase()) + 1];
}

export function randmStr(): string {
  return Math.random().toString(32).substring(2);
}
export function isUpperCase(c: string): boolean {
  return /^[A-Z]+$/g.test(c);
}

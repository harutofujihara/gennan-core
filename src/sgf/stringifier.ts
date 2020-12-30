import { Properties } from "../types";

export function propertiesToSgf(props: Properties): string {
  let sgf = ";";
  for (const [key, value] of Object.entries(props)) {
    if (value != null) {
      sgf += key + "[" + value.join("][") + "]";
    }
  }
  return sgf;
}

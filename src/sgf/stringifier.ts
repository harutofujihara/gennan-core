import { Properties } from "../types";

export function propertiesToSgf(props: Properties): string {
  let sgf = ";";
  for (const [key, value] of Object.entries(props)) {
    if (value != null && value.length > 0) {
      sgf += key + "[" + value.join("][") + "]";
    }
  }
  return sgf;
}

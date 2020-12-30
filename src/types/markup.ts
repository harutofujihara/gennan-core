import { Property } from "./property";

const Markup = {
  Circle: "Circle",
  Square: "Square",
  Triangle: "Triangle",
  Cross: "Cross",
  Text: "Text",
} as const;
type Markup = typeof Markup[keyof typeof Markup];

function markupToProperty(mk: Markup): Property {
  switch (mk) {
    case Markup.Circle:
      return Property.CR;
    case Markup.Square:
      return Property.SQ;
    case Markup.Triangle:
      return Property.TR;
    case Markup.Cross:
      return Property.MA;
    case Markup.Text:
      return Property.LB;
    default:
      throw new Error("markup is invalid.");
  }
}

export { Markup, markupToProperty };

import { Property } from "./property";

const MarkupSymbol = {
  Circle: "Circle",
  Square: "Square",
  Triangle: "Triangle",
  Cross: "Cross",
} as const;
type MarkupSymbol = typeof MarkupSymbol[keyof typeof MarkupSymbol];

function markupSymbolToProperty(symbol: MarkupSymbol): Property {
  switch (symbol) {
    case MarkupSymbol.Circle:
      return Property.CR;
    case MarkupSymbol.Square:
      return Property.SQ;
    case MarkupSymbol.Triangle:
      return Property.TR;
    case MarkupSymbol.Cross:
      return Property.MA;
    default:
      throw new Error("symbol is invalid.");
  }
}

export { MarkupSymbol, markupSymbolToProperty };

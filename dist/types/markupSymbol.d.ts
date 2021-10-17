import { Property } from "./property";
declare const MarkupSymbol: {
    readonly Circle: "Circle";
    readonly Square: "Square";
    readonly Triangle: "Triangle";
    readonly Cross: "Cross";
};
declare type MarkupSymbol = typeof MarkupSymbol[keyof typeof MarkupSymbol];
declare function markupSymbolToProperty(symbol: MarkupSymbol): Property;
export { MarkupSymbol, markupSymbolToProperty };

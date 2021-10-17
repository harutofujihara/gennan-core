declare const Color: {
    readonly Black: "Black";
    readonly White: "White";
};
declare type Color = typeof Color[keyof typeof Color];
declare function oppositeColor(color: Color): Color;
export { Color, oppositeColor };

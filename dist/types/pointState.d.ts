declare const PointState: {
    readonly Black: "Black";
    readonly White: "White";
    readonly Empty: "Empty";
    readonly Edge: "Edge";
};
declare type PointState = typeof PointState[keyof typeof PointState];
export { PointState };

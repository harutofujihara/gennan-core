const Color = {
  Black: "Black",
  White: "White",
} as const;
type Color = typeof Color[keyof typeof Color];

function oppositeColor(color: Color): Color {
  if (color === Color.Black) return Color.White;
  if (color === Color.White) return Color.Black;
  else return color;
}

export { Color, oppositeColor };

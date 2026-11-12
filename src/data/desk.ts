// Every object on the desk. Positions are the object's centre as a percentage of the stage,
// plus its rotation in degrees: `scatter` is how the desk looks on arrival, `pile` is where
// the objects end up once the pinned scroll finishes.
// `w` is the width in vw on desktop, `wPhone` the width in vw on phones.
// The picture comes from src/assets/desk/<key>.webp, or src/assets/desk-src/<key>.svg if no WebP exists.

export type Spot = [x: number, y: number, rotation: number];

export interface DeskObject {
  key: string;
  label: string;
  w: number;
  wPhone: number;
  scatter: Spot;
  pile: Spot;
  hideOnPhone?: boolean;
  // optional spots used only on phones, where the stage is tall and narrow
  phoneScatter?: Spot;
  phonePile?: Spot;
}

export const desk: DeskObject[] = [
  { key: "laptop", label: "my laptop", w: 20, wPhone: 44, scatter: [50, 76, 2], pile: [88, 34, -12], phonePile: [68, 90, -8] },
  { key: "book", label: "reading: Data Science, by Kelleher and Tierney", w: 10, wPhone: 22, scatter: [10, 22, -8], pile: [40, 60, -14] },
  { key: "glasses", label: "blue light glasses", w: 11, wPhone: 25, scatter: [47, 15, 4], pile: [51, 57, 7] },
  { key: "phone", label: "my phone, my camera", w: 5.5, wPhone: 13, scatter: [86, 76, 12], pile: [61, 62, -9] },
  { key: "airpods", label: "AirPods, always in", w: 5, wPhone: 11, scatter: [27, 50, 28], pile: [47, 68, 40], hideOnPhone: true },
  { key: "note", label: "the only rule", w: 8, wPhone: 19, scatter: [74, 22, 7], pile: [43, 74, -7] },
  { key: "pizza", label: "pizza night", w: 9, wPhone: 20, scatter: [8, 60, -18], pile: [58, 72, 22], hideOnPhone: true },
  { key: "watch", label: "Apple Watch, on Eastern time", w: 4.2, wPhone: 10, scatter: [92, 26, -6], pile: [36, 70, 12] },
  { key: "card", label: "card holder", w: 6, wPhone: 14, scatter: [18, 86, 8], pile: [8, 86, -14], hideOnPhone: true },
  { key: "marker", label: "for the doodles", w: 13, wPhone: 28, scatter: [75, 54, -32], pile: [50, 64, -58], hideOnPhone: true },
  { key: "tea", label: "milk tea, always", w: 8.5, wPhone: 20, scatter: [89, 47, 7], pile: [65, 54, 12], phoneScatter: [22, 62, 7] },
  { key: "bottle", label: "water bottle, trail ready", w: 14, wPhone: 30, scatter: [32, 21, -10], pile: [54, 78, -18] },
];

// Where the watch screen sits on watch.webp, as percentages of the image, so the live time lands on it.
// If you swap the watch for a photo, adjust these four numbers to match your photo's screen.
export const watchFace = { left: 20, top: 28.4, width: 56.4, height: 43.1 };

// Where the steam rises from on tea.webp (the middle of the cup), as percentages of the image.
export const teaSteam = { left: 43, top: 50 };

export const headlineWords = ["question", "clean", "model", "chart"];

import { motionValue } from "framer-motion";

// Page-wide pointer, normalised to -1…1 from the viewport centre.
// Written by <PointerField />, read by anything that should lean toward the cursor.
export const pointer = {
  x: motionValue(0),
  y: motionValue(0),
};

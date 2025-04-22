import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({ storage }).fields([
  { name: "resume", maxCount: 1 },
  { name: "profilePhoto", maxCount: 1 },
  { name: "logo", maxCount: 1 },
]);

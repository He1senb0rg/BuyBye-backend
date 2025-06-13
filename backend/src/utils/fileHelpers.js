import mongoose from "mongoose";
import { getGFSFilesCollection } from "../config/gridfs.js";

export async function mapImageIdsToUrls(imageIds) {
  if (!Array.isArray(imageIds)) return [];

  const gfsFiles = getGFSFilesCollection();

  const imagesWithUrls = await Promise.all(
    imageIds.map(async (img) => {
      // If img is already a URL string, return it directly
      if (typeof img === "string" && (img.startsWith("http") || img.startsWith("/"))) {
        return img;
      }

      // Otherwise, treat as ObjectId
      try {
        const id = typeof img === "string" ? img : img.toString();
        const fileDoc = await gfsFiles.findOne({ _id: new mongoose.Types.ObjectId(id) });
        if (!fileDoc) return null;
        return `/api/files/${fileDoc.filename}`;
      } catch (err) {
        console.error("Failed to process image ID:", img, err);
        return null;
      }
    })
  );

  return imagesWithUrls.filter(Boolean);
}
import mongoose from "mongoose";
import { getGFSFilesCollection } from "../config/gridfs.js";

export async function mapImageIdsToUrls(imageIds) {
  if (!Array.isArray(imageIds)) return [];

  const gfsFiles = getGFSFilesCollection();

  const imagesWithUrls = await Promise.all(
    imageIds.map(async (img) => {
      if (typeof img === "string" && (img.startsWith("http") || img.startsWith("/"))) {
        return { url: img, id: img }; // You can keep the URL and treat it as its own ID if necessary
      }

      try {
        const id = typeof img === "string" ? img : img.toString();
        const fileDoc = await gfsFiles.findOne({ _id: new mongoose.Types.ObjectId(id) });
        if (!fileDoc) return null;
        return {
          url: `api/files/${fileDoc.filename}`,
          id: fileDoc._id.toString(),
        };
      } catch (err) {
        console.error("Failed to process image ID:", img, err);
        return null;
      }
    })
  );

  return imagesWithUrls.filter(Boolean);
}
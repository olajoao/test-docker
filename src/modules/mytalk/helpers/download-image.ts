import { downloadWithAnchorTag } from "./download-image-with-anchor-tag";
import { getImageFromApi } from "./get-image";

function getMimeType(fileName: string) {
  let mimeType = "application/octet-stream";

  const extension = fileName.split(".").pop()?.toLowerCase();

  if (extension === "pdf") {
    mimeType = "application/pdf";
  }
  if (extension === "csv") {
    mimeType = "text/csv";
  }
  if (extension === "xlsx") {
    mimeType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  }
  if (extension === "png") {
    mimeType = "image/png";
  }
  if (extension === "jpg" || extension === "jpeg") {
    mimeType = "image/jpeg";
  }
  if (extension === "webp") {
    mimeType = "image/webp";
  }
  if (extension === "mp4") {
    mimeType = "video/mp4";
  }
  if (extension === "webm") {
    mimeType = "video/webm";
  }

  if (extension === "mp3") {
    mimeType = "audio/mpeg";
  }

  return mimeType;
}

export const handleDownload = async (
  url: string,
  name: string,
  filename: string,
) => {
  const newUrl = new URL(url);
  const authPayloadStorage = atob(localStorage.getItem("app_token") || "{}");
  const authPayload = authPayloadStorage
    ? JSON.parse(authPayloadStorage)
    : null;

  const nyaUrl = authPayload.base_url + newUrl.pathname;
  const mimeType = getMimeType(name);
  const response = await getImageFromApi(nyaUrl);
  const blob = new Blob([response], { type: mimeType });
  const imageUrl = URL.createObjectURL(blob);
  downloadWithAnchorTag(filename, imageUrl);
};

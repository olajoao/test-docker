export function fileType(filenameOrUrl: string) {
  const input = filenameOrUrl.toLowerCase()
  
  const isPdf = () => {
    return ["pdf", "xlsx", "sheet", "spreadsheet", "csv", "xls", "doc", "docx", "ppt", "pptx", "txt"].some((item) =>
      input.includes(item),
    );
  };

  const isImage = () => {
    return ["png", "jpg", "jpeg", "webp", "svg", "gif", "bmp", "avif", "image/"].some((item) =>
      input.includes(item),
    );
  };

  const isVideo = () => {
    return ["mp4", "webm", "ogg", "mov", "m4v", "video/"].some((item) =>
      input.includes(item),
    );
  };

  const isAudio = () => {
    return ["mp3", "wav", "m4a", "aac", "audio/"].some((item) =>
      input.includes(item),
    );
  };

  if (isAudio()) {
    return "audio";
  }
  
  if (isPdf()) {
    return "document";
  }

  if (isImage()) {
    return "image";
  }

  if (isVideo()) {
    return "video";
  }

  return "unknown";
}

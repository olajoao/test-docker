export function isMp3(file: File) {
  return file.type === "audio/mpeg" || file.name.toLowerCase().endsWith(".mp3")
}

export function inferAudioNameFromFile(file: File) {
  return file.name.replace(/\.[^/.]+$/, "")
}

export function toObjectUrl(file: File) {
  return URL.createObjectURL(file)
}

export function revokeObjectUrl(url: string | null | undefined) {
  if (!url) return
  try {
    URL.revokeObjectURL(url)
  } catch {
    // noop
  }
}

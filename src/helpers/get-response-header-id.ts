export function getIdFromResponseHeadersLocation(location?: string): string {
  if (!location) return ''
  // Ex: "/api/resource/123" -> "123"
  const parts = location.split('/').filter(Boolean)
  return parts[parts.length - 1] ?? ''
}

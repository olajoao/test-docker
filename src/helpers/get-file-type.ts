export function fileType(filenameOrUrl: string) {
  const clean = filenameOrUrl.split('?')[0].split('#')[0]
  const ext = clean.split('.').pop()?.toLowerCase() ?? ''

  if (['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'avif'].includes(ext)) return 'img'
  if (['svg'].includes(ext)) return 'svg'
  if (['mp4', 'webm', 'ogg', 'mov', 'm4v'].includes(ext)) return 'video'
  if (['mp3', 'wav', 'm4a', 'ogg', 'aac'].includes(ext)) return 'audio'
  if (['pdf'].includes(ext)) return 'doc'
  if (['txt', 'csv', 'xlsx', 'xls', 'doc', 'docx', 'ppt', 'pptx'].includes(ext)) return 'doc'

  return 'file'
}

export function getIdFromResponseHeadersLocation(location: string) {
  const splited = location.split("/");
  const id = splited[splited.length - 1];
  return id;
}

const ABSOLUTE_URL_RE = /^(https?:)?\/\//i;
const DEFAULT_API_URL = "http://localhost:8080/api";

function getBackendOrigin() {
  const rawApiUrl = (import.meta.env.VITE_API_URL as string | undefined)?.trim() || DEFAULT_API_URL;
  try {
    return new URL(rawApiUrl, window.location.origin).origin;
  } catch {
    return "http://localhost:8080";
  }
}

export function resolveImageUrl(value?: string | null) {
  const imageRef = value?.trim();
  if (!imageRef) return "";
  const backendOrigin = getBackendOrigin();

  if (
    ABSOLUTE_URL_RE.test(imageRef) ||
    imageRef.startsWith("data:") ||
    imageRef.startsWith("blob:")
  ) {
    return imageRef;
  }

  if (imageRef.startsWith("/")) {
    return `${backendOrigin}${imageRef}`;
  }

  if (/[А-Яа-яЁё]/.test(imageRef) || /\s/.test(imageRef)) {
    return "";
  }

  return `${backendOrigin}/images/${imageRef}`;
}

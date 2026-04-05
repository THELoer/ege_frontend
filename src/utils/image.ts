const ABSOLUTE_URL_RE = /^(https?:)?\/\//i;

export function resolveImageUrl(value?: string | null) {
  const imageRef = value?.trim();
  if (!imageRef) return "";

  if (
    ABSOLUTE_URL_RE.test(imageRef) ||
    imageRef.startsWith("data:") ||
    imageRef.startsWith("blob:") ||
    imageRef.startsWith("/images/")
  ) {
    return imageRef;
  }

  if (imageRef.startsWith("/")) {
    return imageRef;
  }

  return `/images/${imageRef}`;
}

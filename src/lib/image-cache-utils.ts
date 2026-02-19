/**
 * Utility functions to ensure consistent caching and preloading for images,
 * whether they come from local assets or Firebase Storage (API).
 */

/**
 * Check if a URL is from Firebase Storage
 */
export function isFirebaseStorageUrl(url: string): boolean {
  return url.startsWith('https://storage.googleapis.com');
}

/**
 * Check if a URL is a local asset
 */
export function isLocalAsset(url: string): boolean {
  return url.startsWith('/') && !url.startsWith('//');
}

/**
 * Get cache priority for an image based on its position
 */
export function getCachePriority(
  isCritical: boolean = false,
  index: number = 0
): 'high' | 'low' | 'auto' {
  if (isCritical || index === 0) {
    return 'high';
  }
  return 'auto';
}

/**
 * Determine if an image should be loaded eagerly or lazily
 */
export function getImageLoadingStrategy(
  isCritical: boolean = false,
  index: number = 0
): 'eager' | 'lazy' {
  if (isCritical || index === 0) {
    return 'eager';
  }
  return 'lazy';
}

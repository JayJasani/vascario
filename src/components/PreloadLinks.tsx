/**
 * Server component to add preload links for critical images in the HTML head.
 * This ensures Firebase Storage (API) images are preloaded for faster loading.
 */
export function PreloadLinks({ images = [] }: { images?: string[] }) {
  return (
    <>
      {images.map((src, index) => (
        <link
          key={`image-preload-${index}`}
          rel="preload"
          as="image"
          href={src}
        />
      ))}
    </>
  );
}

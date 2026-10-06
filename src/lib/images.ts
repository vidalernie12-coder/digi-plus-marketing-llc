import type { ImageMetadata } from 'astro';

const load = async function () {
  let images: Record<string, () => Promise<unknown>> | undefined = undefined;
  try {
    images = import.meta.glob('~/assets/images/**/*.{jpeg,jpg,png,tiff,webp,gif,svg,JPEG,JPG,PNG,TIFF,WEBP,GIF,SVG}');
  } catch (error) {
    // continue regardless of error
  }
  return images;
};

let _images: Record<string, () => Promise<unknown>> | undefined = undefined;

/** Fetch all local images */
export const fetchLocalImages = async () => {
  _images = _images || (await load());
  return _images;
};

/** Find and resolve an image path */
export const findImage = async (
  imagePath?: string | ImageMetadata | null
): Promise<string | ImageMetadata | undefined | null> => {
  // Not string
  if (typeof imagePath !== 'string') {
    return imagePath;
  }

  // Absolute paths
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('/')) {
    return imagePath;
  }

  // Relative paths or not "~/assets/"
  if (!imagePath.startsWith('~/assets/images')) {
    return imagePath;
  }

  const images = await fetchLocalImages();
  const key = imagePath.replace('~/', '/src/');

  return images && typeof images[key] === 'function'
    ? ((await images[key]()) as { default: ImageMetadata })['default']
    : null;
};

/** Get optimized image props */
export const getImageProps = async (
  src: string | ImageMetadata,
  alt: string = '',
  width?: number,
  height?: number
) => {
  const resolvedImage = await findImage(src);
  
  if (!resolvedImage) {
    return { src: '', alt };
  }

  if (typeof resolvedImage === 'string') {
    return {
      src: resolvedImage,
      alt,
      ...(width && { width }),
      ...(height && { height }),
    };
  }

  return {
    src: resolvedImage.src,
    alt,
    width: width || resolvedImage.width,
    height: height || resolvedImage.height,
  };
};

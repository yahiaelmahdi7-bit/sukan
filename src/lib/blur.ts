/**
 * Shared blur placeholder for next/image components.
 *
 * A 4×4 cream-tinted pixel encoded as a base64 PNG.
 * Use as `placeholder="blur" blurDataURL={CREAM_BLUR}` on any Image to avoid
 * layout shift while the real image loads. Defining it once here means we
 * don't ship per-image inline blur data.
 */
export const CREAM_BLUR =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAADklEQVQIW2P8z8BQDwADhQGAWjR9awAAAABJRU5ErkJggg==";

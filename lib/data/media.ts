/** Deterministic stock photos via Picsum (reliable for dev). Swap to production CDN URLs when ready. */
const HOST = "https://picsum.photos";

const IDS = Array.from({ length: 48 }, (_, i) => 100 + i);

function hashHandle(handle: string) {
  let h = 0;
  for (let i = 0; i < handle.length; i += 1) {
    h = (h << 5) - h + handle.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function linePhoto(handle: string, salt = 0): string {
  const id = IDS[(hashHandle(handle) + salt) % IDS.length];
  return `${HOST}/id/${id}/1400/1750`;
}

export function linePhotoThumb(handle: string): string {
  return linePhoto(handle, 11);
}

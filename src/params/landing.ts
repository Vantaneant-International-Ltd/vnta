// Only the landing pages we have written match this route. Anything else at
// the top level stays a 404.
import { landings } from '$lib/content/studio';

export const match = (param: string) => landings.some((l) => l.slug === param);

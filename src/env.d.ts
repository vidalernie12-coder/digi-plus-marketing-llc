/// <reference path="../.astro/types.d.ts" />

// astro-icon's `./components` export is an Astro file flagged with
// `@ts-ignore` upstream, so language tools must shim its type.
declare module "astro-icon/components" {
  export const Icon: any;
}

## API Report File for "@backstage/plugin-search"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts
import { AnyExternalRoutes } from '@backstage/core-plugin-api';
import { AnyRoutes } from '@backstage/core-plugin-api';
import { BackstagePlugin } from '@backstage/frontend-plugin-api';
import { Extension } from '@backstage/frontend-plugin-api';

// @alpha (undocumented)
const _default: BackstagePlugin<AnyRoutes, AnyExternalRoutes>;
export default _default;

// @alpha (undocumented)
export const SearchApi: Extension<{}>;

// @alpha (undocumented)
export const SearchNavItem: Extension<{
  title: string;
}>;

// @alpha (undocumented)
export const SearchPage: Extension<{
  path: string;
  noTrack: boolean;
}>;

// (No @packageDocumentation comment for this package)
```

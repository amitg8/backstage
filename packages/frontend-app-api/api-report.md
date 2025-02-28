## API Report File for "@backstage/frontend-app-api"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts
import { AppRouteBinder } from '@backstage/core-app-api';
import { BackstagePlugin } from '@backstage/frontend-plugin-api';
import { Config } from '@backstage/config';
import { ConfigApi } from '@backstage/core-plugin-api';
import { ExtensionDataRef } from '@backstage/frontend-plugin-api';
import { ExtensionOverrides } from '@backstage/frontend-plugin-api';
import { JSX as JSX_2 } from 'react';

// @public (undocumented)
export function createApp(options: {
  features?: (BackstagePlugin | ExtensionOverrides)[];
  configLoader?: () => Promise<ConfigApi>;
  bindRoutes?(context: { bind: AppRouteBinder }): void;
  featureLoader?: (ctx: {
    config: ConfigApi;
  }) => Promise<(BackstagePlugin | ExtensionOverrides)[]>;
}): {
  createRoot(): JSX_2.Element;
};

// @public (undocumented)
export function createExtensionTree(options: { config: Config }): ExtensionTree;

// @public (undocumented)
export interface ExtensionTree {
  // (undocumented)
  getExtension(id: string): ExtensionTreeNode | undefined;
  // (undocumented)
  getExtensionAttachments(id: string, inputName: string): ExtensionTreeNode[];
  // (undocumented)
  getRootRoutes(): JSX_2.Element[];
  // (undocumented)
  getSidebarItems(): JSX_2.Element[];
}

// @public (undocumented)
export interface ExtensionTreeNode {
  // (undocumented)
  getData<T>(ref: ExtensionDataRef<T>): T | undefined;
  // (undocumented)
  id: string;
}
```

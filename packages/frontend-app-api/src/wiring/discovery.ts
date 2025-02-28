/*
 * Copyright 2023 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  BackstagePlugin,
  ExtensionOverrides,
} from '@backstage/frontend-plugin-api';

interface DiscoveryGlobal {
  modules: Array<{ name: string; default: unknown }>;
}

/**
 * @public
 */
export function getAvailableFeatures(): (
  | BackstagePlugin
  | ExtensionOverrides
)[] {
  const discovered = (
    window as { '__@backstage/discovered__'?: DiscoveryGlobal }
  )['__@backstage/discovered__'];

  return (
    discovered?.modules.map(m => m.default).filter(isBackstageFeature) ?? []
  );
}

function isBackstageFeature(
  obj: unknown,
): obj is BackstagePlugin | ExtensionOverrides {
  if (obj !== null && typeof obj === 'object' && '$$type' in obj) {
    return (
      obj.$$type === '@backstage/BackstagePlugin' ||
      obj.$$type === '@backstage/ExtensionOverrides'
    );
  }
  return false;
}

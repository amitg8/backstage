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

import React, { ReactNode } from 'react';
import { FlatRoutes } from '@backstage/core-app-api';
import { Extension, createPageExtension } from '@backstage/frontend-plugin-api';
import { PuppetDbPage } from '@backstage/plugin-puppetdb';
import { StackstormPage } from '@backstage/plugin-stackstorm';
import { ScoreBoardPage } from '@oriflame/backstage-plugin-score-card';
import { Route, Routes } from 'react-router-dom';

import {
  BackstagePlugin,
  RouteRef,
  getComponentData,
} from '@backstage/core-plugin-api';

jest.mock('@backstage/frontend-plugin-api', () => ({
  ...jest.requireActual('@backstage/frontend-plugin-api'),
  createPageExtension: opts => opts,
}));

function collectLegacyRoutes(
  flatRoutesElement: JSX.Element,
): Extension<unknown>[] {
  // const results = traverseElementTree({
  //   root,
  //   discoverers: [childDiscoverer, routeElementDiscoverer],
  //   collectors: {
  //     foo: createCollector(
  //       () => new Set<Extension>(),
  //       (acc, node) => {
  //         const plugin = getComponentData<BackstagePlugin>(node, 'core.plugin');
  //         if (plugin) {
  //           acc.add(plugin);
  //         }
  //       },
  //     )
  //   },
  // })

  const results = new Array<Extension<unknown>>();

  React.Children.forEach(
    flatRoutesElement.props.children,
    (route: ReactNode) => {
      if (!React.isValidElement(route)) {
        return;
      }

      // TODO(freben): Handle feature flag and permissions framework wrapper elements
      if (route.type !== Route) {
        return;
      }

      const routeElement = route.props.element;

      // TODO: to support deeper extension component, e.g. hidden within <RequirePermission>, use https://github.com/backstage/backstage/blob/518a34646b79ec2028cc0ed6bc67d4366c51c4d6/packages/core-app-api/src/routing/collectors.tsx#L69
      const plugin = getComponentData<BackstagePlugin>(
        routeElement,
        'core.plugin',
      );
      if (!plugin) {
        return;
      }

      const routeRef = getComponentData<RouteRef>(
        routeElement,
        'core.mountPoint',
      );

      const pluginId = plugin.getId();
      const path: string = route.props.path;

      const detectedExtension = createPageExtension({
        id: `plugin.${pluginId}.page`,
        defaultPath: path[0] === '/' ? path.slice(1) : path,
        routeRef,

        loader: async () =>
          route.props.children ? (
            <Routes>
              <Route path="*" element={routeElement}>
                <Route path="*" element={route.props.children} />
              </Route>
            </Routes>
          ) : (
            routeElement
          ),
      });

      plugin.getApis(); // Create DI API extensions from these

      // TODO: Create converted plugin instance instead. We need to move over APIs etc.
      results.push(detectedExtension);
    },
  );

  // TODO: For every legacy plugin that we find, make sure any matching plugin is disabled in the new system

  return results;
}

describe('collectLegacyRoutes', () => {
  it('should collect legacy routes', () => {
    const collected = collectLegacyRoutes(
      <FlatRoutes>
        <Route path="/score-board" element={<ScoreBoardPage />} />
        <Route path="/stackstorm" element={<StackstormPage />} />
        <Route path="/puppetdb" element={<PuppetDbPage />} />
      </FlatRoutes>,
    );

    console.log(`DEBUG: collected=`, collected);

    expect(collected).toEqual([
      createPageExtension({
        id: 'plugin.score-card.page',
        defaultPath: 'score-board',
        routeRef: getComponentData(<ScoreBoardPage />, 'core.mountPoint'),
        loader: expect.any(Function),
      }),
      createPageExtension({
        id: 'plugin.stackstorm.page',
        defaultPath: 'stackstorm',
        routeRef: getComponentData(<StackstormPage />, 'core.mountPoint'),
        loader: expect.any(Function),
      }),
      createPageExtension({
        id: 'plugin.puppetDb.page',
        defaultPath: 'puppetdb',
        routeRef: getComponentData(<PuppetDbPage />, 'core.mountPoint'),
        loader: expect.any(Function),
      }),
      // ??????????????
    ]);
  });
});

/*
 * Copyright 2021 The Backstage Authors
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

import React, { PropsWithChildren, Component } from 'react';
import { AppContext } from '../app/types';
import { BackstagePlugin } from '../plugin';

/**
 * @public
 * Props for {@link PluginErrorBoundary}.
 */
export type PluginErrorBoundaryProps = PropsWithChildren<{
  app: AppContext;
  plugin?: BackstagePlugin;
}>;

/**
 * @public
 * State for {@link PluginErrorBoundary}.
 */
export type PluginErrorBoundaryState = { error: Error | undefined };

/**
 * @public
 * Custom error boundary for plugins.
 */
export class PluginErrorBoundary extends Component<
  PluginErrorBoundaryProps,
  PluginErrorBoundaryState
> {
  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  state: PluginErrorBoundaryState = { error: undefined };

  handleErrorReset = () => {
    this.setState({ error: undefined });
  };

  render() {
    const { error } = this.state;
    const { app, plugin, children } = this.props;
    const { ErrorBoundaryFallback } = app.getComponents();

    if (error) {
      return (
        <ErrorBoundaryFallback
          error={error}
          resetError={this.handleErrorReset}
          plugin={plugin}
        />
      );
    }

    return children;
  }
}

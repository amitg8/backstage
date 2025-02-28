/*
 * Copyright 2022 The Backstage Authors
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
  QueryEntitiesCursorRequest,
  QueryEntitiesInitialRequest,
  QueryEntitiesRequest,
} from '../../catalog/types';
import { decodeCursor } from '../util';
import { parseEntityFilterParams } from './parseEntityFilterParams';
import { parseEntityOrderFieldParams } from './parseEntityOrderFieldParams';
import { parseEntityTransformParams } from './parseEntityTransformParams';
import { spec } from '../../schema/openapi.generated';
import { QueryParameters } from '@backstage/backend-openapi-utils';

export function parseQueryEntitiesParams(
  params: QueryParameters<typeof spec, '/entities/by-query', 'get'>,
): Omit<QueryEntitiesRequest, 'authorizationToken' | 'limit'> {
  const fields = parseEntityTransformParams(params);

  if (params.cursor) {
    const decodedCursor = decodeCursor(params.cursor);
    const response: Omit<QueryEntitiesCursorRequest, 'authorizationToken'> = {
      cursor: decodedCursor,
      fields,
    };
    return response;
  }

  const filter = parseEntityFilterParams(params);
  const orderFields = parseEntityOrderFieldParams(params);

  const response: Omit<QueryEntitiesInitialRequest, 'authorizationToken'> = {
    fields,
    filter,
    orderFields,
    fullTextFilter: {
      term: params.fullTextFilterTerm || '',
      fields: params.fullTextFilterFields,
    },
  };

  return response;
}

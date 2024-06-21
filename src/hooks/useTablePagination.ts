import {
  NumberParam,
  StringParam,
  useQueryParams,
  withDefault,
} from 'use-query-params';

export function useTablePagination(rows: number = 10, count = 0) {
  return useQueryParams({
    page: withDefault(NumberParam, 1),
    page_size: withDefault(NumberParam, rows),
    search: withDefault(StringParam, ''),
    count: withDefault(NumberParam, count),
  });
}

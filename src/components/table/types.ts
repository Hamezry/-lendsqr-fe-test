import { ReactElement, ReactNode } from 'react';

import { ColumnDef, RowData } from '@tanstack/react-table';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    row_className?: string;
    header_className?: string;
  }
}
export interface TableProps<T extends Record<string, unknown> = {}> {
  status: 'error' | 'pending' | 'success';
  data: Array<T>;
  rows?: number;
  total_number_of_records?: number;
  columns: Array<ColumnDef<any, any>>;
  title: ReactNode;
  subtitle?: string;
  CustomActions?: ReactElement;
  classNames?: Partial<TableBaseClassNames>;
  inputPlaceholder?: string;
  withSerialNo?: boolean;
  pinSerialNo?: boolean;
  withExpansion?: boolean;
  TableFooter?: JSX.Element;
  initialLeftPinnedColumns?: string[];
}

interface TableBaseClassNames {
  wrapper: string;
  header: Partial<{
    wrapper: string;
    inner: string;
    title: string;
    subtitle: string;
    rightSection: string;
    filter: string;
    column: string;
  }>;
  table: Partial<{
    inner: string;
    header: string;
    row: string;
    body: string;
    footer: string;
  }>;
  pagination: Partial<{
    wrapper: string;
    dots: string;
    control: string;
  }>;
  search: Partial<{
    wrapper: string;
    input: string;
  }>;
  pageSize: Partial<{
    wrapper: string;
    input: string;
  }>;
}

export const defaultClassNames: TableBaseClassNames = {
  wrapper: '',
  header: {
    wrapper: '',
    inner: '',
    title: '',
    subtitle: '',
    rightSection: '',
    column: '',
    filter: '',
  },
  table: {
    header: '',
    inner: '',
    row: '',
    body: '',
    footer: '',
  },
  pagination: {
    wrapper: '',
    dots: '',
    control: '',
  },
  search: {
    wrapper: '',
    input: '',
  },
  pageSize: {
    wrapper: '',
    input: '',
  },
};

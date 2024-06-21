import {
  ArrowDown2,
  Maximize2,
  Maximize4,
  Pause,
  SearchNormal1,
  Sort,
} from 'iconsax-react';
import React, { useCallback, useMemo, useState } from 'react';
import _debounce from 'lodash/debounce';

import {
  useReactTable,
  type PaginationState,
  type SortingState,
  type VisibilityState,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  CellContext,
  ColumnPinningState,
} from '@tanstack/react-table';
import {
  Checkbox,
  Loader,
  Menu,
  Modal,
  Pagination,
  Select,
} from '@mantine/core';

import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';

import { TableProps, defaultClassNames } from './types';
import { useTablePagination } from '../../hooks/useTablePagination';
import { DragAlongCell, DraggableTableHeader } from './components';

export default function Table({
  classNames = defaultClassNames,
  inputPlaceholder = 'Search',
  total_number_of_records = 0,
  withSerialNo = false,
  rows = 10,
  TableFooter,
  withExpansion = true,
  initialLeftPinnedColumns = [],
  ...props
}: TableProps) {
  const [tablePaginationControls] = useTablePagination(
    rows,
    total_number_of_records,
  );
  const [expanded, setExpanded] = useState(false);

  const [{ pageIndex, pageSize }, setPaginationState] =
    useState<PaginationState>({
      pageIndex: tablePaginationControls.page - 1,
      pageSize: tablePaginationControls.page_size,
    });

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  );

  const tableData = useMemo(() => {
    if (props.status !== 'success') return [];

    return props.data!;
  }, [props.data, props.status]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<Record<string, any>>({});
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: ['S/N', ...initialLeftPinnedColumns],
  });

  const [columnOrder, setColumnOrder] = useState<string[]>(() =>
    props.columns.map((c) => c.id!),
  );

  const { startItem, endItem, pageCount } = calculatePagination(
    tablePaginationControls.page,
    tablePaginationControls.page_size,
    tablePaginationControls.count,
  );

  const reactTable = useReactTable({
    data: tableData,
    columns: [
      ...(withSerialNo
        ? [
            {
              accessorKey: '',
              size: 40,
              header: 'S/N',
              cell: ({ row }: CellContext<Record<string, unknown>, string>) => {
                return (
                  tablePaginationControls.page_size *
                    tablePaginationControls.page -
                  tablePaginationControls.page_size +
                  row.index +
                  1
                );
              },
            },
          ]
        : []),
      ...props.columns,
    ],
    enableSorting: true,
    enablePinning: true,
    enableColumnPinning: true,
    manualPagination: true,
    pageCount,
    state: {
      rowSelection,
      columnVisibility,
      sorting,
      pagination,
      columnPinning,
      columnOrder,
    },
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPaginationState,
    onColumnVisibilityChange: setColumnVisibility,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnPinningChange: setColumnPinning,
    debugTable: process.env.NODE_ENV !== 'production',
    onColumnOrderChange: setColumnOrder,
  });

  const TableBodyView = {
    pending: (
      <div className="flex items-center justify-center my-5 text-sm text-xds-eneutral-7 absolute top-1/3 -translate-y-1/3 left-1/2 -translate-x-1/2">
        <Loader className="stroke-xds-info-5" aria-label="Loading" />
      </div>
    ),
    error: (
      <div className="hidden last:flex flex-col gap-2 items-center justify-center my-5 text-sm text-xds-eneutral-7 absolute top-1/3 -translate-y-1/3 left-1/2 -translate-x-1/2">
        <img
          src="/empty-state.svg"
          alt="Error loading data"
          width={128}
          height={128}
        />
       Error loading data
      </div>
    ),
    success: (
      <>
        <div className="hidden last:flex flex-col gap-2 items-center justify-center my-5 text-sm text-xds-eneutral-7 absolute top-1/3 -translate-y-1/3 left-1/2 -translate-x-1/2">
          <img
            src="/empty-state.svg"
            alt="No records found"
            width={128}
            height={128}
          />
   No records found.
        </div>
        {reactTable.getRowModel().rows.map((row, rowIndex) => (
          <tr
            className={`border-b-[0.5px] border-xds-eneutral-4 ${classNames.table?.row}`}
            key={row.id + rowIndex}>
            {row.getVisibleCells().map((cell, index) => (
              <SortableContext
                key={cell.id}
                items={columnOrder}
                strategy={horizontalListSortingStrategy}>
                <DragAlongCell key={cell.id + index} cell={cell} />
              </SortableContext>
            ))}
          </tr>
        ))}
      </>
    ),
  };

  // reorder columns after drag & drop
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setColumnOrder((columnOrder) => {
        const oldIndex = columnOrder.indexOf(active.id as string);
        const newIndex = columnOrder.indexOf(over.id as string);
        return arrayMove(columnOrder, oldIndex, newIndex);
      });
    }
  }

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  function Table() {
    const [tablePaginationControls, setTablePaginationControls] =
      useTablePagination(rows, total_number_of_records);

    const [search, setSearch] = useState(tablePaginationControls.search ?? '');

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debounceSearch = useCallback(
      _debounce(
        (search: string) =>
          setTablePaginationControls({
            search: !search ? undefined : search,
            page: 1,
          }),
        750,
      ),
      [],
    );

    const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(event.currentTarget.value);
      debounceSearch(event.currentTarget.value);
    };

    return (
      <section
        className={`h-full min-h-[40rem] flex flex-col gap-6 ${classNames.wrapper}`}>
        <div
          className={`flex flex-col  lg:flex-row gap-3 lg:items-center lg:justify-between ${classNames.header?.wrapper}`}>
          <div className={`flex flex-col ${classNames.header?.inner}`}>
            <h5
              className={`font-semibold text-lg text-xds-eneutral-13 ${classNames.header?.title}`}>
              {props.title}
            </h5>
            <p
              className={`text-sm text-xds-eneutral-7 ${classNames.header?.subtitle}`}>
              {props.subtitle}
            </p>
          </div>
          <div
            className={`flex child:flex-1 flex-wrap justify-between items-center gap-4 ${classNames.header?.rightSection}`}>
            <Select
              value={tablePaginationControls.page_size.toString()}
              onChange={(value) =>
                setTablePaginationControls({ page_size: Number(value) })
              }
              classNames={{
                root: `min-w-[4rem] w-fit ${classNames.pageSize?.wrapper}`,
              }}
              data={[
                { value: '5', label: '5' },
                { value: '10', label: '10' },
                { value: '20', label: '20' },
                { value: '50', label: '50' },
                { value: '100', label: '100' },
              ]}
              rightSection={<ArrowDown2 size={16} />}
              styles={{
                rightSection: { pointerEvents: 'none', width: '24px' },
                input: { paddingRight: 0 },
              }}
            />

            <Menu position="bottom-end" shadow="md">
              <Menu.Target>
                <button
                  aria-label="column visibility"
                  className={`rounded-xs border w-fit h-9 p-2 flex items-center gap-2 text-sm text-xds-eneutral-8 ${classNames.header?.column}`}>
                  <Pause aria-hidden className="" size="16" />
                Columns
                </button>
              </Menu.Target>
              <Menu.Dropdown className="child:space-y-2 max-h-72 overflow-auto">
                {reactTable
                  .getAllLeafColumns()
                  .filter(
                    (column) =>
                      column.id.toLowerCase() !== 'checkbox' &&
                      column.id.toLowerCase() !== 's/n' &&
                      column.id.toLowerCase() !== 'action',
                  )
                  .map((column, key) => {
                    const context = reactTable
                      .getHeaderGroups()
                      .map((headers) =>
                        headers.headers.find(
                          (header) => header.id === column.id,
                        ),
                      )[0]
                      ?.getContext();

                    return (
                      <div
                        className={`p-1 flex gap-2 cursor-pointer`}
                        key={key}>
                        <Checkbox
                          size="sm"
                          id={column.id}
                          name={column.id}
                          className="flex-shrink-0"
                          checked={column.getIsVisible()}
                          onChange={column.getToggleVisibilityHandler()}
                        />
                        <label
                          htmlFor={column.id}
                          className="text-sm block cursor-pointer capitalize truncate"
                          style={{ width: '-webkit-fill-available' }}>
                          {flexRender(column.columnDef.header, context!)}
                        </label>
                      </div>
                    );
                  })}
              </Menu.Dropdown>
            </Menu>

            <button
              aria-labelledby="data filtering"
              className={`rounded-xs border h-9 p-2 hidden items-center gap-2 text-sm text-xds-eneutral-8 ${classNames.header?.filter}`}>
              <Sort aria-hidden className="" size="16" />
              Filter
            </button>
            <div
              className={`relative flex w-full  !flex-[3] max-w-md h-9 text-sm ${classNames.search?.wrapper}`}>
              <SearchNormal1
                size={18}
                className="absolute left-2 top-1/2 -translate-y-1/2"
              />
              <input
                type="text"
                placeholder={inputPlaceholder}
                className={`outline-none bg-xds-eneutral-3 text-xds-eneutral-8 py-2.5 px-3 pl-8 rounded-xs w-full h-full ${classNames.search?.input}`}
                value={search}
                onChange={handleSearchInput}
                autoFocus={props.status === 'success'}
              />
            </div>
            {withExpansion && (
              <button
                className="order-last rounded-xs border !flex-none  h-9 p-2 flex items-center gap-2 text-sm text-xds-eneutral-8"
                aria-label="Expand table"
                onClick={() => setExpanded((s) => !s)}>
                {expanded ? (
                  <Maximize4 aria-hidden size="16" />
                ) : (
                  <Maximize2 aria-hidden size="16" />
                )}
              </button>
            )}
            {props.CustomActions}
          </div>
        </div>
        <div
          className={`relative pb-20 ${expanded ? 'min-h-[80svh]' : `h-[36rem] ${classNames.table?.inner}`}`}>
          <div className={`h-full overflow-auto`}>
            <table className="overflow-auto w-full align-top">
              <thead
                className={`bg-xds-eneutral-3 sticky top-0 z-10 ${classNames.table?.header}`}>
                {reactTable
                  .getHeaderGroups()
                  .map((headerGroup, headerGroupIndex) => (
                    <tr
                      key={headerGroup.id + headerGroupIndex}
                      className="border-b">
                      <SortableContext
                        items={columnOrder}
                        strategy={horizontalListSortingStrategy}>
                        {headerGroup.headers.map((header, index) => (
                          <DraggableTableHeader
                            key={header.id + index}
                            header={header}
                          />
                        ))}
                      </SortableContext>
                    </tr>
                  ))}
              </thead>
              <tbody className={classNames.table?.body}>
                {TableBodyView[props.status]}
              </tbody>
              {props.status === 'success' && TableFooter ? (
                <tfoot>
                  <tr>
                    <td colSpan={reactTable.getVisibleLeafColumns().length}>
                      <div className="bg-red-400 w-full">{TableFooter}</div>
                    </td>
                  </tr>
                </tfoot>
              ) : null}
            </table>
          </div>
          <div
            className={`pt-4 flex flex-col md:flex-row md:items-center justify-between absolute bottom-2 left-0 gap-y-3 right-0 bg-white ${classNames.pagination?.wrapper}`}>
            <div className="text-sm text-xds-eneutral-10">
              <p>
                <span>
                  {startItem} - {endItem} of
                </span>
                &nbsp;{tablePaginationControls.count} records
              </p>
            </div>
            <Pagination 
              total={pageCount}
              siblings={1}
              value={tablePaginationControls.page}
              onChange={(page) => {
                setTablePaginationControls({
                  page,
                  count: total_number_of_records,
                });
                setPaginationState((cur) => ({ ...cur, pageIndex: page - 1 }));
              }}
              classNames={{ 
                
                control:
                  'data-[active]:bg-xds-neutral-1 data-[active]:border data-[active]:border-xds-info-5 data-[active]:text-xds-info-5  hover:!bg-xds-neutral-4 text-sm transition ',
              }}
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      modifiers={[restrictToHorizontalAxis]}
      onDragEnd={handleDragEnd}
      sensors={sensors}>
      {expanded ? (
        <Modal
          opened
          onClose={() => setExpanded(false)}
          fullScreen
          withCloseButton={false}>
          <Table />
        </Modal>
      ) : (
        <Table />
      )}
    </DndContext>
  );
}

function calculatePagination(page: number, page_size: number, total: number) {
  const startItem = (page - 1) * page_size + 1;
  let endItem = page * page_size;

  if (endItem > total) {
    endItem = total;
  }
  const pageCount = Math.ceil(total / page_size);

  return { startItem, endItem, pageCount };
}

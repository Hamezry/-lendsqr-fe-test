// needed for row & cell level scope DnD setup

import { TiPinOutline } from 'react-icons/ti';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Column, Header, flexRender } from '@tanstack/react-table';
import { Cell } from '@tanstack/react-table';

interface TData extends Record<string, unknown> {}

const togglePinning = (column: Column<Record<string, unknown>>) => {
  const { getIsPinned, pin } = column;

  return getIsPinned() ? pin(false) : pin('left');
};

const getCommonPinningStyles = (column: Column<TData>): React.CSSProperties => {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn =
    isPinned === 'left' && column.getIsLastColumn('left');
  const isFirstRightPinnedColumn =
    isPinned === 'right' && column.getIsFirstColumn('right');

  return {
    boxShadow: isLastLeftPinnedColumn
      ? '-1px 0 1px -1px gray inset'
      : isFirstRightPinnedColumn
        ? '1px 0 1px -1px gray inset'
        : undefined,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    opacity: isPinned ? 0.95 : 1,
    position: isPinned ? 'sticky' : 'static',
    width: column.getSize() + 40,
    zIndex: isPinned ? 1 : 0,
  };
};

export const DraggableTableHeader = ({
  header,
}: {
  header: Header<TData, unknown>;
}) => {
  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id: header.column.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition: 'width transform 0.2s ease-in-out',
  };
  const isPinned = header.column.getIsPinned();
  return (
    <th
      style={{ ...style, ...getCommonPinningStyles(header.column) }}
      className={`text-sm text-left text-xds-eneutral-10 p-3 px-4 z-[5] font-normal child:capitalize child:font-semibold gap-2 items-center whitespace-nowrap group bg-xds-eneutral-3  ${header.column.columnDef.meta?.header_className}`}
      colSpan={header.colSpan}
      ref={setNodeRef}>
      <div className="flex items-center gap-3">
        <div className="cursor-grab" {...attributes} {...listeners}>
          {header.isPlaceholder
            ? null
            : flexRender(header.column.columnDef.header, header.getContext())}
        </div>
        <button
          onClick={(ev) => {
            ev.stopPropagation();

            togglePinning(header.column);
          }}
          hidden={header.id === 'S/N'}
          className={` hover:opacity-100 ${isPinned ? 'opacity-100' : 'opacity-20'}`}>
          <TiPinOutline size={20} />
        </button>
      </div>
    </th>
  );
};

export const DragAlongCell = ({ cell }: { cell: Cell<TData, unknown> }) => {
  const { isDragging, setNodeRef, transform } = useSortable({
    id: cell.column.id,
  });

  const style: React.CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: 'relative',
    transform: CSS.Translate.toString(transform),
    transition: 'width transform 0.2s ease-in-out',
    width: cell.column.getSize(),
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <td
      key={cell.id}
      className={`px-4 h-16 max-h-24 text-left text-sm text-xds-eneutral-13 align-middle bg-white ${cell.column.columnDef.meta?.row_className}`}
      style={{ ...style, ...getCommonPinningStyles(cell.column) }}
      ref={setNodeRef}>
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </td>
  );
};

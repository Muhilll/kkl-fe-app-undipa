import { For, JSX, Show, createEffect, createMemo, createSignal } from "solid-js";

export interface DataTableColumn<T> {
  header: string;
  cell: (row: T, index: number) => JSX.Element;
  headerStyle?: JSX.CSSProperties;
  cellClass?: string;
  sortable?: boolean;
  sortValue?: (row: T) => string | number | Date | null | undefined;
  searchValue?: (row: T) => string | number | Date | null | undefined;
}

interface DataTableProps<T> {
  rows: T[];
  columns: DataTableColumn<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  itemsPerPage?: number;
}

type SortDirection = "asc" | "desc";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const IconChevronLeft = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const IconChevronRight = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

function DataTable<T>(props: DataTableProps<T>) {
  const [itemsPerPage, setItemsPerPage] = createSignal(props.itemsPerPage ?? 10);
  const [page, setPage] = createSignal(1);
  const [search, setSearch] = createSignal("");
  const [sortIndex, setSortIndex] = createSignal<number | null>(null);
  const [sortDirection, setSortDirection] = createSignal<SortDirection>("asc");

  createEffect(() => {
    props.itemsPerPage;
    setItemsPerPage(props.itemsPerPage ?? 10);
  });

  createEffect(() => {
    props.rows.length;
    search();
    itemsPerPage();
    sortIndex();
    sortDirection();
    setPage(1);
  });

  const searchableText = (row: T) => {
    const searchableColumns = props.columns.filter((column) => column.searchValue || column.sortValue);

    if (searchableColumns.length === 0) {
      return JSON.stringify(row).toLowerCase();
    }

    return searchableColumns
      .map((column) => column.searchValue?.(row) ?? column.sortValue?.(row) ?? "")
      .join(" ")
      .toLowerCase();
  };

  const filteredRows = createMemo(() => {
    const keyword = search().trim().toLowerCase();
    if (!keyword) return props.rows;

    return props.rows.filter((row) => searchableText(row).includes(keyword));
  });

  const normalizedSortValue = (value: string | number | Date | null | undefined) => {
    if (value instanceof Date) return value.getTime();
    if (typeof value === "number") return value;
    if (value === null || value === undefined) return "";
    return String(value).toLowerCase();
  };

  const sortedRows = createMemo(() => {
    const index = sortIndex();
    if (index === null) return filteredRows();

    const column = props.columns[index];
    if (!column?.sortValue) return filteredRows();

    const direction = sortDirection() === "asc" ? 1 : -1;

    return [...filteredRows()].sort((a, b) => {
      const left = normalizedSortValue(column.sortValue?.(a));
      const right = normalizedSortValue(column.sortValue?.(b));

      if (left < right) return -1 * direction;
      if (left > right) return 1 * direction;
      return 0;
    });
  });

  const totalPages = createMemo(() =>
    Math.max(1, Math.ceil(sortedRows().length / itemsPerPage())),
  );

  const pagedRows = createMemo(() => {
    const start = (page() - 1) * itemsPerPage();
    return sortedRows().slice(start, start + itemsPerPage());
  });

  const pageNumbers = createMemo<(number | "...")[]>(() => {
    const total = totalPages();
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

    const current = page();
    const pages = new Set(
      [1, total, current - 1, current, current + 1].filter(
        (value) => value >= 1 && value <= total,
      ),
    );

    const sortedPages = [...pages].sort((a, b) => a - b);
    const result: (number | "...")[] = [];

    sortedPages.forEach((value, index) => {
      if (index > 0 && value - sortedPages[index - 1] > 1) {
        result.push("...");
      }
      result.push(value);
    });

    return result;
  });

  const startEntry = createMemo(() =>
    sortedRows().length === 0 ? 0 : (page() - 1) * itemsPerPage() + 1,
  );
  const endEntry = createMemo(() =>
    Math.min(page() * itemsPerPage(), sortedRows().length),
  );

  const handleSort = (index: number) => {
    const column = props.columns[index];
    if (column.sortable === false || !column.sortValue) return;

    if (sortIndex() === index) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortIndex(index);
    setSortDirection("asc");
  };

  return (
    <div class="app-table-card">
      <div class="table-toolbar">
        <div class="table-page-size">
          <select
            class="table-page-size-select"
            value={itemsPerPage()}
            onChange={(event) => setItemsPerPage(Number(event.currentTarget.value))}
          >
            <For each={PAGE_SIZE_OPTIONS}>
              {(option) => <option value={option}>{option}</option>}
            </For>
          </select>
          <span>records per page</span>
        </div>

        <input
          class="table-search"
          type="search"
          placeholder="Search"
          value={search()}
          onInput={(event) => setSearch(event.currentTarget.value)}
        />
      </div>

      <Show when={props.isLoading}>
        <div class="table-loading">Loading...</div>
      </Show>

      <Show when={!props.isLoading}>
        <Show
          when={sortedRows().length > 0}
          fallback={<div class="table-empty">{props.emptyMessage || "No data found."}</div>}
        >
          <div class="app-table-scroll">
            <table class="app-table">
              <thead>
                <tr>
                  <For each={props.columns}>
                    {(column, index) => {
                      const canSort = () => column.sortable !== false && !!column.sortValue;

                      return (
                        <th
                          style={column.headerStyle}
                          class={canSort() ? "sortable" : undefined}
                          onClick={() => handleSort(index())}
                        >
                          <span class="th-content">
                            <span>{column.header}</span>
                            <Show when={canSort()}>
                              <span class="sort-indicator" aria-hidden="true">
                                <span
                                  class={`sort-caret up${
                                    sortIndex() === index() && sortDirection() === "asc" ? " active" : ""
                                  }`}
                                />
                                <span
                                  class={`sort-caret down${
                                    sortIndex() === index() && sortDirection() === "desc" ? " active" : ""
                                  }`}
                                />
                              </span>
                            </Show>
                          </span>
                        </th>
                      );
                    }}
                  </For>
                </tr>
              </thead>
              <tbody>
                <For each={pagedRows()}>
                  {(row, index) => (
                    <tr>
                      <For each={props.columns}>
                        {(column) => (
                          <td class={column.cellClass}>
                            {column.cell(row, (page() - 1) * itemsPerPage() + index())}
                          </td>
                        )}
                      </For>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>

          <div class="table-footer">
            <span class="pagination-info">
              Showing <strong>{startEntry()}</strong> to <strong>{endEntry()}</strong> of{" "}
              <strong>{sortedRows().length}</strong> entries
            </span>

            <nav class="pagination-nav">
              <button
                class="page-btn"
                disabled={page() === 1}
                onClick={() => setPage((current) => current - 1)}
              >
                <IconChevronLeft />
              </button>

              <For each={pageNumbers()}>
                {(item) =>
                  item === "..." ? (
                    <span class="page-dots">...</span>
                  ) : (
                    <button
                      class={`page-btn${page() === item ? " active" : ""}`}
                      onClick={() => setPage(item as number)}
                    >
                      {item}
                    </button>
                  )
                }
              </For>

              <button
                class="page-btn"
                disabled={page() === totalPages()}
                onClick={() => setPage((current) => current + 1)}
              >
                <IconChevronRight />
              </button>
            </nav>
          </div>
        </Show>
      </Show>
    </div>
  );
}

export default DataTable;

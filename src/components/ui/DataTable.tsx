import { For, JSX, Show, createMemo, createSignal } from "solid-js";

export interface DataTableColumn<T> {
  header: string;
  cell: (row: T, index: number) => JSX.Element;
  headerStyle?: JSX.CSSProperties;
  cellClass?: string;
}

interface DataTableProps<T> {
  rows: T[];
  columns: DataTableColumn<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  itemsPerPage?: number;
}

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
  const itemsPerPage = () => props.itemsPerPage ?? 10;
  const [page, setPage] = createSignal(1);

  const totalPages = createMemo(() =>
    Math.max(1, Math.ceil(props.rows.length / itemsPerPage())),
  );

  const pagedRows = createMemo(() => {
    const start = (page() - 1) * itemsPerPage();
    return props.rows.slice(start, start + itemsPerPage());
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
    props.rows.length === 0 ? 0 : (page() - 1) * itemsPerPage() + 1,
  );
  const endEntry = createMemo(() =>
    Math.min(page() * itemsPerPage(), props.rows.length),
  );

  return (
    <div class="app-table-card">
      <Show when={props.isLoading}>
        <div class="table-loading">Loading...</div>
      </Show>

      <Show when={!props.isLoading}>
        <Show
          when={props.rows.length > 0}
          fallback={<div class="table-empty">{props.emptyMessage || "No data found."}</div>}
        >
          <div class="app-table-scroll">
            <table class="app-table">
              <thead>
                <tr>
                  <For each={props.columns}>
                    {(column) => <th style={column.headerStyle}>{column.header}</th>}
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
              <strong>{props.rows.length}</strong> entries
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

/**
 * Print Table to PDF Utility
 * Opens a styled print window with table data, optimized for PDF export via browser print dialog.
 */

export interface PrintTableOptions {
  title: string;
  subtitle?: string;
  headers: string[];
  rows: string[][];
  orientation?: "portrait" | "landscape";
}

const formatDateTime = () => {
  return new Date().toLocaleString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const printTableToPdf = (options: PrintTableOptions) => {
  const { title, subtitle, headers, rows, orientation = "landscape" } = options;

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Popup diblokir oleh browser. Izinkan popup untuk mencetak.");
    return;
  }

  const tableHeaderCells = headers
    .map((h) => `<th>${h}</th>`)
    .join("");

  const tableRows = rows
    .map(
      (row, idx) =>
        `<tr class="${idx % 2 === 0 ? "even" : "odd"}">${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`,
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <style>
    @page {
      size: A4 ${orientation};
      margin: 15mm 12mm;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      font-size: 11px;
      color: #1a1a2e;
      background: #fff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .print-container {
      padding: 0;
    }

    /* ── Header ── */
    .print-header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      border-bottom: 3px solid #2563eb;
      padding-bottom: 14px;
      margin-bottom: 18px;
    }

    .print-header-left h1 {
      font-size: 20px;
      font-weight: 700;
      color: #1e293b;
      letter-spacing: -0.3px;
    }

    .print-header-left p {
      margin-top: 4px;
      font-size: 12px;
      color: #64748b;
    }

    .print-header-right {
      text-align: right;
      font-size: 10px;
      color: #94a3b8;
      line-height: 1.6;
    }

    .print-header-right .badge {
      display: inline-block;
      background: #2563eb;
      color: #fff;
      padding: 3px 10px;
      border-radius: 4px;
      font-weight: 600;
      font-size: 10px;
      margin-bottom: 4px;
    }

    /* ── Summary bar ── */
    .print-summary {
      display: flex;
      gap: 24px;
      margin-bottom: 14px;
    }

    .print-summary-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: #475569;
    }

    .print-summary-item strong {
      color: #1e293b;
      font-weight: 700;
      font-size: 13px;
    }

    /* ── Table ── */
    table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      overflow: hidden;
    }

    thead th {
      background: #1e293b;
      color: #f1f5f9;
      font-weight: 600;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 9px 10px;
      text-align: left;
      border-right: 1px solid #334155;
      white-space: nowrap;
    }

    thead th:last-child {
      border-right: none;
    }

    tbody td {
      padding: 7px 10px;
      border-bottom: 1px solid #e2e8f0;
      border-right: 1px solid #e2e8f0;
      font-size: 11px;
      color: #334155;
      line-height: 1.45;
      vertical-align: top;
    }

    tbody td:last-child {
      border-right: none;
    }

    tbody tr.even {
      background: #ffffff;
    }

    tbody tr.odd {
      background: #f8fafc;
    }

    tbody tr:last-child td {
      border-bottom: none;
    }

    /* ── Footer ── */
    .print-footer {
      margin-top: 20px;
      padding-top: 12px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      font-size: 9px;
      color: #94a3b8;
    }

    /* ── Print-only tweaks ── */
    @media print {
      body {
        background: #fff !important;
      }
      .no-print {
        display: none !important;
      }
    }

    /* ── Screen preview bar ── */
    .preview-bar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: linear-gradient(135deg, #1e293b, #334155);
      color: #f1f5f9;
      padding: 12px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      z-index: 999;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    }

    .preview-bar span {
      font-size: 13px;
      font-weight: 500;
    }

    .preview-bar button {
      background: #2563eb;
      color: #fff;
      border: none;
      padding: 8px 24px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    .preview-bar button:hover {
      background: #1d4ed8;
    }

    .print-container {
      margin-top: 60px;
    }

    @media print {
      .print-container {
        margin-top: 0;
      }
    }
  </style>
</head>
<body>
  <div class="preview-bar no-print">
    <span>📄 Preview Cetak — ${title}</span>
    <button onclick="window.print()">🖨️ Cetak / Simpan PDF</button>
  </div>

  <div class="print-container">
    <div class="print-header">
      <div class="print-header-left">
        <h1>${title}</h1>
        ${subtitle ? `<p>${subtitle}</p>` : ""}
      </div>
      <div class="print-header-right">
        <div class="badge">KKL UNDIPA</div>
        <div>Dicetak: ${formatDateTime()}</div>
      </div>
    </div>

    <div class="print-summary">
      <div class="print-summary-item">
        Total Data: <strong>${rows.length}</strong>
      </div>
      <div class="print-summary-item">
        Kolom: <strong>${headers.length}</strong>
      </div>
    </div>

    <table>
      <thead>
        <tr>${tableHeaderCells}</tr>
      </thead>
      <tbody>
        ${tableRows.length > 0 ? tableRows : `<tr><td colspan="${headers.length}" style="text-align:center;padding:20px;color:#94a3b8;">Tidak ada data.</td></tr>`}
      </tbody>
    </table>

    <div class="print-footer">
      <span>Dokumen ini dicetak secara otomatis oleh sistem KKL UNDIPA</span>
      <span>Halaman 1</span>
    </div>
  </div>
</body>
</html>`;

  printWindow.document.write(html);
  printWindow.document.close();
};

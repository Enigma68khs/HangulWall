export type GridCell = {
  char: string;
  isBlank: boolean;
};

export type GridLayout = {
  cells: GridCell[];
  columns: number;
  rows: GridCell[][];
  rowCount: number;
};

export function layoutTextToGrid(input: string, columns: number): GridLayout {
  const normalized = input.replace(/\r\n/g, "\n").trim() || " ";
  const chars = Array.from(normalized);
  const safeColumns = Math.max(1, columns);
  const lineGroups: GridCell[][] = [[]];

  for (const char of chars) {
    if (char === "\n") {
      lineGroups.push([]);
      continue;
    }

    if (char === " ") {
      continue;
    }

    lineGroups[lineGroups.length - 1].push({ char, isBlank: false });
  }

  const rows: GridCell[][] = [];

  for (const line of lineGroups) {
    if (line.length === 0) {
      rows.push([{ char: "", isBlank: true }]);
      continue;
    }

    const firstRowSize = line.length % safeColumns || safeColumns;
    let cursor = 0;

    while (cursor < line.length) {
      const chunkSize = cursor === 0 ? firstRowSize : safeColumns;
      rows.push(line.slice(cursor, cursor + chunkSize));
      cursor += chunkSize;
    }
  }

  if (rows.length === 0) {
    rows.push([{ char: "", isBlank: true }]);
  }

  const cells = rows.flat();

  return {
    cells,
    columns: safeColumns,
    rows,
    rowCount: rows.length,
  };
}

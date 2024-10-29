export interface TableCell {
  text: string;
  x: number;
  y: number;
}

export interface Table {
  rows: string[][];
}

export function isLikelyTableCell(text: string, x: number, y: number): boolean {
  return (
    text.trim().length > 0 &&
    /[\d.,]/.test(text) &&
    x % 10 === 0
  );
}

export function addToTable(table: Table, text: string, x: number, y: number): void {
  const rowIndex = Math.floor(y / 20);
  const colIndex = Math.floor(x / 100);
  
  if (!table.rows[rowIndex]) {
    table.rows[rowIndex] = [];
  }
  
  table.rows[rowIndex][colIndex] = text.trim();
}

export async function extractTables(page: any): Promise<Table[]> {
  try {
    const viewport = page.getViewport({ scale: 1.0 });
    const textContent = await page.getTextContent();
    
    const tables: Table[] = [];
    let currentTable: Table | null = null;
    
    textContent.items.forEach((item: any) => {
      const { str, transform } = item;
      const x = transform[4];
      const y = viewport.height - transform[5];
      
      if (isLikelyTableCell(str, x, y)) {
        if (!currentTable) {
          currentTable = { rows: [] };
          tables.push(currentTable);
        }
        
        addToTable(currentTable, str, x, y);
      } else {
        currentTable = null;
      }
    });
    
    return tables;
  } catch (error) {
    console.warn('Error extracting tables:', error);
    return [];
  }
}
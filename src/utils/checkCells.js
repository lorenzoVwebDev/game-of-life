export function checkCells(cells) {
  let count = 0;
  for (const cell of cells ){
    for (const value of cell) {
      count = count + value;
    }
  }

  return count;
}
import { useEffect, useState } from 'react';
import { GameOfLife } from "../../utils/GameOfLife.js";

const golInstance = new GameOfLife;

function Table() {
  const [ reload, setReload] = useState(false)
  const [ cells, setCells] = useState([])
  const [ interId, setInterId] = useState(false)

  useEffect(() => {
    golInstance.init();
    setReload((state) => state = true);
  }, [])

  return (
    <div className="table-wrapper">
    <h1>Click On The Cells To Activate Them</h1>
      <table className="field">
        {reload && golInstance.htmlElements.forEach(row => {
          row.forEach(cell => {
            cell.addEventListener('click', (event) => {
              if (cell.classList[1] === 'empty') {
                const x = event.target.cellIndex;
                const y = event.target.parentNode.rowIndex;
                golInstance.cells[y][x] = 1;
              } else {
                const x = event.target.cellIndex;
                const y = event.target.parentNode.rowIndex;
                golInstance.cells[y][x] = 0;
              }

              golInstance.draw(golInstance.cells)
              
            })
          })
        })}
      </table>
        <button className="start-button" onClick={() => {
          golInstance.randomInit();
          setCells(golInstance.cells)
        }}>
          Fill The Grid Randomly
        </button>
        <button className="next-gen-button" onClick={
          (event) => {
            golInstance.newGeneration()
          }
        }>
          Next Gen Button
        </button>
        <button onClick={
          () => {
            
            if (!interId) {
              setInterId(setInterval(() => {
                golInstance.newGeneration()
              }, 2000))
            } else if (interId) {
              clearInterval(interId)
              setInterId(false)
            }
          }
        }>
          {!interId ? 'Start' : 'Stop'}
        </button>
        <button onClick={
          () => {
            if (cells.length === 0) {
              return
            }
            golInstance.setCells(cells);
            golInstance.generationCount = 1;
            golInstance.draw(); 
          }
        }>
          Reset 
        </button>
    </div>
  )
}

export default Table;
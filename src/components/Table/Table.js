import { useEffect, useState, useRef } from 'react';
import { GameOfLife } from "../../utils/GameOfLife.js";

const golInstance = new GameOfLife();

function Table() {

  const [ reload, setReload] = useState(false)
  const [ cells, setCells] = useState([])
  const [ interId, setInterId] = useState(false)
  let ref = useRef(false)

  useEffect(() => {
    let loopActive = false
    const automatic = async () => {
      while (loopActive) {
        if (golInstance.generationCount === 1) {
          setCells(golInstance.cells)
        }
        const response = await golInstance.newGeneration();
    
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    if (interId) {
      loopActive = true;
      automatic(interId)
      return () => {
        loopActive = false;
      }
    } else if (!interId && golInstance.generationCount === 1) {
      golInstance.init();
      setReload((state) => state = true);
      return () => {
        loopActive = false
      }
    }
  }, [interId])

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
/*                 console.log('loop 1')
                console.log(cell.classList[1]) */
              } else {
                const x = event.target.cellIndex;
                const y = event.target.parentNode.rowIndex;
                golInstance.cells[y][x] = 0;
/*                 console.log('loop 2')
                console.log(cell.classList[1]) */
              }

              golInstance.draw('default', true)
              setReload(setReload((state) => state = true))
            })
          })
        })}
      </table>
        <button className="start-button" onClick={() => {
          golInstance.generationCount = 1;
          golInstance.randomInit();
          setCells(golInstance.cells)
        }}>
          Fill The Grid Randomly
        </button>
        <button className="next-gen-button" onClick={
          async (event) => {
            if (golInstance.generationCount === 1) {
              setCells(golInstance.cells)
              ref.current = false;
              const completed = await golInstance.newGeneration()
              if (completed === 'completed') {
                ref.current = true;
              }
            } else if (ref.current === true) {
              ref.current = false;
              const completed = await golInstance.newGeneration()
              if (completed === 'completed') {
                ref.current = true;
              }
            }

          }
        }>
          Next Gen Button
        </button>
        <button onClick={
          () => {
              if (interId) {
                setInterId(false)
              } else {
                setInterId(true)
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
        <form onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          const resize = true; 
          golInstance.xSize = parseInt(event.target[0].value);
          golInstance.ySize = parseInt(event.target[1].value);
          console.log(typeof golInstance.xSize)
          console.log(typeof golInstance.ySize)
          golInstance.init(resize);
          setReload((state) => state = true);
        }}>
          <input type="number" placeholder="set grid's width" min="0" max="100" required/>
          <input type="number" placeholder="set grid's heigth" min="0" max="100" required/>
          <input type="submit" placeholder='submit'/>
        </form>
    </div>
  )
}

export default Table;
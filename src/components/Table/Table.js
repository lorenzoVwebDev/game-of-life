import { useEffect, useState, useRef } from 'react';
import { GameOfLife } from "../../utils/GameOfLife.js";
import Dashboard from '../Dashboard/Dashboard.js';

const golInstance = new GameOfLife();

function Table() {

  const [ reload, setReload] = useState(false)
  const [ cells, setCells] = useState([])
  const [ interId, setInterId] = useState(false)
  let ref1 = useRef(false)
  let ref2 = useRef()
  
  useEffect(() => {
    let loopActive = false
    const automatic = async () => {
      try {
        while (loopActive) {
          if (golInstance.generationCount === 1) {
            setCells(golInstance.cells)
          }
          const response = await golInstance.newGeneration();
      
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (err) {
        console.error(err)
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

  const handleClick = (event) => {
    addClick(event, event.currentTarget);
  };

  const addClick = (event, cell) => {
    console.log('hello')
    try {              
        if (cell.classList[1] === 'empty') {
        const x = event.target.cellIndex;
        const y = event.target.parentNode.rowIndex;
        golInstance.cells[y][x] = 1;
      } else {
        const x = event.target.cellIndex;
        const y = event.target.parentNode.rowIndex;
        golInstance.cells[y][x] = 0;
      }

      golInstance.draw('default', true)
      //the setReload useState method is used to compel the re-rendering of the component
      setReload(setReload((state) => state = true))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="table-wrapper">
    <h1>Click On The Cells To Activate Them</h1>
      <table className="field">
        {/* I prefered to loop over the htmlElements array (that contains tr and td references used to set the class attribute of them in the draw() method of the GameOfLife instance ) instead of mapping an array to render jsx. I can easily handle conditions and use the addEventListener's callback to properly manage cells' toggling */}
        {reload && golInstance.htmlElements.forEach(row => {
          row.forEach(cell => {
            cell.removeEventListener('click', handleClick)
            cell.addEventListener('click', handleClick)
          })
        })}
      </table>
        <Dashboard
/*           generationCount={golInstance.generationCount}
          randomInit={golInstance.randomInit} */
          ref2={ref2}
/*           golInstanceCells={golInstance.cells} */
          ref1={ref1}
/*           newGeneration={golInstance.newGeneration} */
          setInterId={setInterId}
          interId={interId}
          cells={cells}
/*           setCells={golInstance.setCells} */
/*           draw={golInstance.draw} */
          golInstance={golInstance}
          setReload={setReload}
          setCells={setCells}
        />
    </div>
  )
}

export default Table;
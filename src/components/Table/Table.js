import { useEffect, useState, useRef } from 'react';
import { GameOfLife } from "../../utils/GameOfLife.js";

const golInstance = new GameOfLife();

function Table() {

  const [ reload, setReload] = useState(false)
  const [ cells, setCells] = useState([])
  const [ interId, setInterId] = useState(false)
  let ref = useRef(false)
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
      <div className="buttons-section">
        <button className="random-button" onClick={() => {
          //generates a random init input and sets the generationCount at 1
          golInstance.generationCount = 1;
          golInstance.randomInit();
          ref2 = golInstance.cells
        }}>
          Fill The Grid Randomly
        </button>
        <button className="next-gen-button" onClick={
          async (event) => {
            try {
              if (golInstance.generationCount === 1) {
                setCells(golInstance.cells)
                ref.current = false;
                const completed = await golInstance.newGeneration()
                if (completed === 'completed') {
                  //useRef is used to check whether the code has finished to run before allowing anothe "next gen button" input
                  ref.current = true;
                }
              } else if (ref.current === true) {
                ref.current = false;
                const completed = await golInstance.newGeneration()
                if (completed === 'completed') {
                  ref.current = true;
                }
              }
            } catch (err) {
              console.error(err)
            }
          }
        }>
          Next Gen Button
        </button>
        <button className="start-button"onClick={
          //toggles the interId boolean to run the useEffect hooks
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
        <button className="reset-button" onClick={
          //It set the cells as they were during the first generation and draws the whole component again
          () => {
            try {
              if (cells.length === 0) {
                return
              }
              golInstance.setCells(cells);
              golInstance.generationCount = 1;
              golInstance.draw(); 
            } catch (err) {
              console.error(err)
            }
          }
        }>
          Reset 
        </button>
        <form onSubmit={(event) => {
          try {
            //Code used to resize the whole project based on the given values in the input
            event.preventDefault();
            event.stopPropagation();
            const resize = true; 
            //parseInt used to convert string value to number
            golInstance.xSize = parseInt(event.target[0].value);
            golInstance.ySize = parseInt(event.target[1].value);
            golInstance.init(resize);
            setReload((state) => state = true);
          } catch (err) {
            console.error(err)
          }
        }}>
          <input type="number" placeholder="set grid's width" min="0" max="100" required/>
          <input type="number" placeholder="set grid's heigth" min="0" max="100" required/>
          <input type="submit" placeholder='submit'/>
        </form>
        </div>
    </div>
  )
}

export default Table;
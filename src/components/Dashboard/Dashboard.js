import { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';

function Dashboard(props) {
  const [state, setState] = useState(false)
  let {ref2, ref1, setInterId, interId, cells, golInstance, setReload, setCells, dispatch, bool} = props;
  
  //useEffect is used to manage the dashboard-section style rendering after the component mounts; it also waits 100 ms before adding the expanded class to ensure a smooth as well as precise rendering.
  useEffect(() => {
    let componentMount = true;
    const dashboard = document.querySelector(".dashboard-section");
    setState(true)
    if (bool) {
      setTimeout(() => {
        dashboard.classList.add('expanded')
      }, 100)

    } 

    return (() => {
      dashboard.classList.remove('expanded')
      componentMount = false;
    })
  }, [])


  return (
    <div className="dashboard-section">
            <button className="toggled-dashboard" onClick={
        () => {
          document.querySelector('.toggle-dashboard').classList.remove('off');
          dispatch(false)
        }
      }><i className='bx bxs-book-content book-logo'></i><h3>Dashboard</h3></button>

    <button className="random-button" onClick={() => {
      //it generates a random init input and sets the generationCount at 1
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
            ref1.current = false;
            const completed = await golInstance.newGeneration()
            setReload(setReload((state) => state = true))
            if (completed === 'completed') {
              //useRef is used to check whether the code has finished running before allowing another "next gen button" input.
              ref1.current = true;
            }
          } else if (ref1.current === true) {
            ref1.current = false;
            const completed = await golInstance.newGeneration()
            setReload(setReload((state) => state = true))
            if (completed === 'completed') {
              ref1.current = true;
            }
          }
        } catch (err) {
          console.error(err)
        }
      }
    }>
      Next Gen Button
    </button>
    <div className="auto-breeding">
    <h5>Auto Breeding</h5>
     <label className="start-button">
      <input 
        type="checkbox" 
        checked={interId} 
        onChange={() => {
          if (interId) {
            setInterId(false)
          } else {
            setInterId(true)
          }
        }} 
      />
      <span className="slider"></span>
    </label>
    </div>
    <button className="reset-button" onClick={
      //It sets the cells as they were during the first generation and draws the whole component again.
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
        //The ode is used to resize the whole project based on the given values in the input
        event.preventDefault();
        event.stopPropagation();
        const resize = true; 
        //parseInt is used to convert string value to number
        golInstance.xSize = parseInt(event.target[0].value);
        golInstance.ySize = parseInt(event.target[1].value);
        golInstance.init(resize);
        setReload((state) => state = true);
      } catch (err) {
        console.error(err)
      }
    }}>
      <input type="number" placeholder="set grid's width" min="0" max="25" required/>
      <input type="number" placeholder="set grid's heigth" min="0" max="25" required/>
      <input type="submit" placeholder='submit'/>
    </form>
    </div>
  )
}

export default Dashboard;
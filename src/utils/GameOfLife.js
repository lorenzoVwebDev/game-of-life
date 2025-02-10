import { requestArray } from "../services/requestArray.js";
import { checkCells } from "../utils/checkCells.js"
export class GameOfLife {
  xSize;
  ySize;
  htmlElements = [];
  cells = [];
  EMPTY = 0;
  ALIVE = 1;
  generationCount = 1;

  constructor(xSize = 16, ySize = 24) {
    this.xSize = xSize;
    this.ySize = ySize;
  }

  createField() {
    var table = document.querySelector('.field');
    table.innerHTML = '';
    this.htmlElements = [];
    for (var y = 0; y < this.ySize; y++) {
      //Creating the Y rows of the table based on the ySize variable (now we are using a size that is equal for both the x-axis and the y-axis)
      var tr = document.createElement('tr');
      table.appendChild(tr);
      //Creating the htmlTable array by starting with the y-axis (rows)
      var rowElements = [];
      this.htmlElements.push(rowElements);
      //it creates the cells array that will be used to define wheter a cell is empty or not. We have to specify the xSize variable in the "new Array(xSize).fill('empty')"
      this.cells.push(new Array(this.xSize).fill(this.EMPTY));
      for (var x = 0; x < this.xSize; x++) {
        //appends a td element (cell) to each row in the parent loop based on the xSize
        var td = document.createElement('td');
        tr.append(td)
        //it pushes a td element at each child loop in each row created in the parent loop 
        rowElements.push(td);
      }
    }
  }

  randomInit() {
    this.createField();
    // the condition in the for loop sets that 30% (0.3) of the total cells must be alive 
    for (let y = 0; y < this.ySize; y++) {
      for (let x = 0; x < this.xSize; x++) {
        this.cells[y][x] = this.EMPTY;
      }
    }

    for (var i = 0; i < Math.floor(this.xSize * this.ySize * 0.03); i++) {
      //we are going to define the var x, y that will be used in the "do...while" loop to radomically set wich cell must be filled
      var x; 
      var y;
      do {
        // It generates a random integer between 0 and less than the xSize or the ySize to determenine the y and x index of the cells array 
        x = Math.floor(Math.random() * this.xSize) 
        y = Math.floor(Math.random() * this.ySize);
        //the condition verifies whether the cell is empty or not and then it fills it based on the true evaluation. Afterwards, it breaks the do..while loop because the cell has been filled. The whole algorithm of the init() function generates a total amount of filled cells equal to the 30% of the total amount of cells
        if (this.cells[y][x] == this.EMPTY) {
          this.cells[y][x] = this.ALIVE;
          break;
        }
      } while (true);
    } 
    this.draw(this.cells)

  }

  init(resize = false) {

    if (resize) {
      this.cells = [];
      this.createField()
      for (let y=0; y < this.ySize; y ++) {
        for (let x=0;x < this.xSize; x++) {
          this.cells[y][x] = this.EMPTY;
        }
      }
      this.draw(this.cells)
    } else {
      this.createField()
      for (let y=0; y < this.ySize; y ++) {
        for (let x=0;x < this.xSize; x++) {
          this.cells[y][x] = this.EMPTY;
        }
      }
      this.draw(this.cells, true)
    }
  }

  async draw(cells = 'default', choosing = false) {

    if ((checkCells(cells) > 0 || !(cells === 'default')) && !choosing) {
      console.log('run')
      const array = await requestArray(cells, this.generationCount, this.xSize, this.ySize);
      if (array) {
        this.cells = array
        for (var y = 0; y < this.ySize; y++) {
          for (var x = 0; x < this.xSize; x++) {
            this.htmlElements[y][x].setAttribute('class', 'cell '+ (this.cells[y][x] == 1 ? 'filled' : 'empty'))
          }
        }

        return 'completed';
      }

    } else if (choosing) {
      for (var y = 0; y < this.ySize; y++) {

        for (var x = 0; x < this.xSize; x++) {
          this.htmlElements[y][x].setAttribute('class', 'cell '+ (this.cells[y][x] == 1 ? 'filled' : 'empty'))
        }
      } 

      return 'completed';
    } else {

      for (var y = 0; y < this.ySize; y++) {
        for (var x = 0; x < this.xSize; x++) {
          this.htmlElements[y][x].setAttribute('class', 'cell '+ (this.cells[y][x] == 1 ? 'filled' : 'empty'))
        }
      } 

      return 'completed';
    }
  }
  
  countNeighbours(x, y) {
    var count = 0;
    // the whole loop checks all the cells surrounding the one defined by the given coordinates (x, y) whether they are 'filled' or 'empty', afterwards it counts the ammount of 'filled' cells and then return the actual number of 'filled' cells surrounding the given one even excluding it from the count. 
    for (var dy = -1; dy <= 1; dy++) {
      for (var dx = -1; dx <= 1; dx++) {
          var nx = x + dx;
          var ny = y + dy;
          if (nx >= 0 && nx < this.xSize && ny >= 0 && ny < this.ySize) {
              count += this.cells[ny][nx];
          }
      }
    }
    
    return count - this.cells[y][x]; 
  }

  async newGeneration() {

    let condition = false;
    for (let y = 0; y < this.ySize; y++) {
      for (let x = 0; x < this.xSize; x++) {
        if (this.cells[y][x] === 1) {
          condition = true;
        };
      }
    }

    if (condition) {

      var newCells = [];
      console.log(typeof this.xSize)
      for (var i=0; i < this.ySize; i++) {
        newCells.push(new Array(this.xSize).fill(this.EMPTY));
      }
      console.log(newCells)
      for (var y = 0; y < this.ySize; y++) {
        for (var x = 0; x < this.xSize; x++) {
          var neighBours = this.countNeighbours(x, y);
          if (this.cells[y][x] == this.EMPTY && neighBours == 3) {
            newCells[y][x] = this.ALIVE;
          }
  
          if (this.cells[y][x] == this.ALIVE && (neighBours == 2 || neighBours == 3)) {
            newCells[y][x] = this.ALIVE;
          }
        }
      }
      
      this.cells = newCells;
      this.generationCount++;

      return await this.draw(this.cells)
    }
  }

  setCells(cells) {
    this.cells = cells
  }
}

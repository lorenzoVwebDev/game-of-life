//The requestArray function sends a POST request to my backend. It will send a json string that contains all the information needed to write and then read the text file needed to portray every new generation; check the comment below or visit my backend repository to wathc the express code that manages the request/response : https://github.com/lorenzoVwebDev/PortfolioBackend/blob/main/controllers/readFileController.js
const localhost = 'http://localhost:3000/';
const backend = 'https://backend.lorenzo-viganego.com/';

export async function requestArray(array, generation, xSize = 16, ySize = 24) {
  try {
  const response = await fetch(`${backend}textarray`, {
    method: "POST",
    body: JSON.stringify({
      array,
      generation,
      xSize,
      ySize
    }),
    headers: {
      "Content-Type": "application/json"
    }
  });
  
  if (response.status >= 200 && response.status < 400) {
    const result = await response.json()
    return result
  } else if (response.status > 400 && response.status < 500) {
    const result = await response.json();
    throw new Error(result)
  } else if (response.status >= 500) {
    const result = await response.json();
    throw new Error(result)
  }
  } catch (err) {
    console.error(err)
  }
}
//---------Backend Code-------------

/* const fs = require('fs');
const path = require('path');

const sendArray = (req, res) => {
  const { array, generation, xSize, ySize } = req.body;

  if (!array || !generation) return res.status(401).json({"message": "bad request"});
  let string = `Generation ${generation}:\n`;
  string += '\n';
  string += `${ySize} ${xSize}`;
  string += '\n\n';
  
  for (const arrays of array) {
    for (let values of arrays) {
      if (values === 0) {
        values = '.';
        string+=values;
      } else {
        values = '*';
        string+=values;
      }

    }
    string+='\n';
  }
  
  fs.writeFileSync(path.join(__dirname, '../', 'textinputs', 'input.txt'), string)

  const outPutFile = fs.readFileSync(
    path.join(__dirname, '../', 'textinputs', 'input.txt'),
    'utf8'
  );

  const oldArray = outPutFile.split('\n').splice(4)
  let newArray = [];
  oldArray.forEach(values => {
    const singleArray = values.slice(0, xSize).split('');
    if (singleArray.length > 0) {
      newArray.push(singleArray.map(x => {
        if (x === '*') {
          return 1;
        } else {
          return 0;
        }
      }))
    }
  })

  res.send(newArray);
}


module.exports = { sendArray } */
//The requestArray function sends a POST request to my backend. It will send a json string that contains all the information needed to write and then read the text file needed to portray every new generation; check the comment below or visit my backend repository to watch the express code that manages the request/response : https://github.com/lorenzoVwebDev/PortfolioBackend/blob/main/controllers/readFileController.js
const localhost = 'http://localhost:3000/';
const backend = 'https://backend.lorenzo-viganego.com/';

export async function requestArray(array, generation, xSize = 16, ySize = 24) {
  try {
  const response = await fetch(`${localhost}textarray`, {
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

/* 
const sendArray = (req, res) => {
  const { array, generation, xSize, ySize } = req.body;
  //checks whether the body contains the needed values
  if (!array || !generation) {
    return res.status(401).redirect(path.join(__dirname, '../', 'public', '401.html')).json({"message": "bad request"})
    
  };

  //generating the string that will be written/read 
  let string = `Generation ${generation}:\n`;
  string += '\n';
  string += `${ySize} ${xSize}`;
  string += '\n\n';
  //looping over the array to generate the filled/empty cells based on the 0 or 1 conditions
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
  try {
    //fs core module used to write the text file using the previously created string
    fs.writeFileSync(path.join(__dirname, '../', 'textinputs', 'input.txt'), string)

    const outPutFile = fs.readFileSync(
      path.join(__dirname, '../', 'textinputs', 'input.txt'),
      'utf8'
    );
    //algorithm that creates an array from the text and removes the first 4 lines that are not useful to create the needed array
    const oldArray = outPutFile.split('\n').splice(4)
    let newArray = [];
    //looping over the oldArray to push arrays made of 0 and 1 into the new array
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
    //sending the 200 response to the user
    res.status(200).send(newArray);
  } catch (err) {
    if (err) {
      res.statu(500).json({'message': 'we are sorry, an error has occurred'})
    }
  }
  

}
 */
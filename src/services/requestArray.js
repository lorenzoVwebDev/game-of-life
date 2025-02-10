
export async function requestArray(array, generation, xSize = 16, ySize = 24) {

  try {
    const response = await fetch('http://localhost:3000/textarray', {
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
    } else if (response.status >= 400 && response.status < 500) {
      const result = await response.json()
      throw new Error(result)
    } else if (response.status >= 500) {
      const result = await response.json()
      throw new Error(result)
    }
  } catch (err) {
    console.error(err);
  } 

}
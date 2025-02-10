
export async function requestArray(array, generation, xSize = 16, ySize = 24) {
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
  }
}
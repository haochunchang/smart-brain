export const APIfetch = async(url, method, body, token) => {

  const response = await fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `${token}`
    },
    body: body
  })
  return response.json()
}
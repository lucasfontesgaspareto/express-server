const request = require('request')

let index = 1

const teste = () => {
  request('http://localhost:3000/api/v1/users', {
    method: 'POST',
    form: {
      username: `Nome ${index}`
    }
  }, (error) => {
    if (!error) {
      index++
      teste()
    } else {
      console.error(error)
      console.log(index)
    }
  })
}
teste()
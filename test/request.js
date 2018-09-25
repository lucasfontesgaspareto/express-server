const request = require('request')

let index = 0

// const teste = () => {
//   request('http://localhost:3000/api/v1/users', (error) => {
//     if (!error) {
//       index++
//       teste()
//     } else {
//       console.error(error)
//       console.log(index)
//     }
//   })
// }

// teste()

for (let index = 0; index < 2000; index++) {
  request('http://localhost:3000/api/v1/users')
}
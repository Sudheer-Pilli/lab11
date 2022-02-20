
const fs = require('fs')
const path = require('path')
const formidable = require('express-formidable')
const express = require('express')
const app = express()
const port = 9000


//start server at port 9000
app.listen(port, () => console.log(`Server listening on port ${port}`))
app.use(express.static(path.join(__dirname, '../')))
app.use(formidable())

//handle response at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'))
})

//port where employee.json is hosted
app.get('/Employee', (req, res) => {
  fs.readFile('./employee.json', (err, data) => {
      if(!err) {
          res.write(data)
          res.end()
          return
      }
      res.write("Error reading Employee.json file")
      res.end()
      console.log("Error reading Employee.json file")
  })
})

//handle POST request for adding new employee to employee.json
app.post('/addEmployee', (req, res) => {
    var obj = req.fields
    fs.readFile('./employee.json', (err, data) => {
        if(!err) {
            var updated = JSON.parse(data)
            updated.push(obj)
            fs.writeFile('./employee.json', JSON.stringify(updated, null, 2), (err) => {
                if(!err) {
                    console.log(`Successfully added ${obj.name}`)
                }
                else {
                    console.log(err)
                }
            })
        }
    })
    res.statusCode=302
    res.setHeader('Location','/tasks.html#/employee')
    return res.end()
})

//handle POST response for removing selected employee form employee.json
app.post('/RemoveEmployee', (req, res) => {
    var obj = req.fields
    fs.readFile('./employee.json', (err, data) => {
        if(!err) {
            var updated = JSON.parse(data)
            updated.splice([obj.id], 1)
            fs.writeFile('./employee.json', JSON.stringify(updated, null, 2), (err) => {
                if(!err) {
                    console.log(`Successfully removed ${obj.name}`)
                }
                else {
                    console.log(err)
                }
            })
        }
    })
    return res.end()
})

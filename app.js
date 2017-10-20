const express = require('express')
const app = express()

const bodyParser = require('body-parser')

const dummyJson = require('dummy-json')
const dummy =`
{
    "users": [
      {{#repeat 100}}
      {
        "id": {{@index}},
        "name": "{{firstName}} {{lastName}}",
        "work": "{{company}}",
        "email": "{{email}}",
        "dob": "{{date '1900' '2000' 'YYYY'}}",
        "address": "{{int 1 100}} {{street}}",
        "city": "{{city}}",
        "optedin": {{boolean}}
      }
      {{/repeat}}
    ]
}
`;

const dummyUsers = JSON.parse(dummyJson.parse(dummy)).users

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')

app.get('/', (req, res) => {
    res.render('search.ejs', { 'dummyUsers': dummyUsers, 'selectUser': null })
})

app.post('/ajaxSearch', (req, res) => {
    const search = req.body.search.toUpperCase()
    const selectedUsers = []

    dummyUsers.map(e => { 
        if(e.name.toUpperCase().indexOf(search) > -1) selectedUsers.push(e)
    })

    let responseData
    selectedUsers.length < 1 ? responseData = { 'result': 'Failed', 'search': req.body.search}
    : responseData = { 'result': 'Succeed', 'search': req.body.search, 'selectedUsers': selectedUsers }
    
    res.json(responseData)
})

app.listen(3000, () => {
    console.log('start!! express server is running on port 3000');
})
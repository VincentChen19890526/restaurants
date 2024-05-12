const express = require('express')
const { engine } = require('express-handlebars')
const app = express()
const port = 3000
const restaurants = require('./public/jsons/restaurant.json').results
app.use(express.static('public'))

app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.redirect('/restaurants')
})

app.get('/restaurants', (req, res) => {
  const keyword = req.query.search?.trim() //req.query.search 對應 index.hbs 的 <!-- search bar --> 的 name="search" 還有 <form action="/restaurants"> 
  const matchedRestaurants = keyword ? restaurants.filter((rf) =>
    Object.values(rf).some((property) => {
      if (typeof property === 'string') {
        return property.toLowerCase().includes(keyword.toLowerCase())
      }
      return false
    })
  ) : restaurants
  res.render('index', { restaurants: matchedRestaurants, keyword })
})

app.get('/restaurant/:id', (req, res) => {
  const id = req.params.id
  const restaurant = restaurants.find((rl) => rl.id.toString() === id)
  res.render('detail', { restaurant })
})
app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`)
})
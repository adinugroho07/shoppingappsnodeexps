const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')

const errorController = require('./controllers/error')
const objSequelize = require('./util/database')

// model
const productsModel = require('./models/product')
const usersModel = require('./models/users')
const cartModel = require('./models/Cart')
const cartItemModel = require('./models/CartItem')
const orderModel = require('./models/Order')
const orderItemModel = require('./models/OrderItem')

const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
  usersModel.findByPk(1)
    .then(user => {
      // jadi user yang sudah di create kita masukkan ke object req supaya bisa di ambil ketika ada request
      // di path lain.
      req.user = user
      console.log('request user : ' + JSON.stringify(req.user))
      // ini untuk melanjutkan ke proses selanjut nya supaya ga stak di dalam method ini.
      next()
    })
    .catch(err => {
      console.log(err)
    })
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)

app.use(errorController.get404)

// proses pendefinisian asosiasi tabel atau relasi table nya
// untuk menunjukan relasi bahwa 1 user mempunya banyak product jadi one to many.
productsModel.belongsTo(usersModel, {
  constraints: true,
  onDelete: 'CASCADE'
})
usersModel.hasMany(productsModel)

// relasi one to one antara table cart dan user, artinya 1 user hanya bisa punya 1 cart saja.
usersModel.hasOne(cartModel)
cartModel.belongsTo(usersModel)

// ini untuk merelasikan antara product dan cart item tapi melewat cart. relasi ini adalah many to many
cartModel.belongsToMany(productsModel, { through: cartItemModel })
productsModel.belongsToMany(cartModel, { through: cartItemModel })

orderModel.belongsTo(usersModel)
usersModel.hasMany(orderModel)
orderModel.belongsToMany(productsModel, { through: orderItemModel })

// jika force di set true maka tabel yang ada akan di drop terlebih dahulu untuk kemudian dicreate kan tabel yang
// baru dengan settingan yang baru. jadi data yang sudah ada pasti akan hilang.
// {force: true}
objSequelize.sync()
  .then((result) => {
    // console.log(result);
    // jadi kita liat di tabel user ini apakah ada user dengan id 1. jika tidak ada maka akan di create kan.
    return usersModel.findByPk(1)
  })
  .then(users => {
    // pengecekan apakah user yang di find ada. jika tidak maka akan di create baru. tapi jika ada maka akan di
    // return data user nya.
    if (!users) {
      return usersModel.create({ name: 'Adi', email: 'test@test.com' })
    }
    return users
  })
  .then(user => {
    // console.log(user);
    return user.createCart()
  })
  .then(users => {
    // console.log(users);
    app.listen(3000)
  })
  .catch((err) => {
    console.log(err)
  })

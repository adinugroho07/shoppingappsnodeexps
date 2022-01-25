const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  })
}

exports.postAddProduct = (req, res, next) => {
  // untuk insert nya bisa menggunakan seperti di bawah ini jadi userId nya langsung di masukkan dari req nya.
  // Product.create({
  //     title: req.body.title,
  //     imageurl: req.body.imageUrl,
  //     price: req.body.price,
  //     description: req.body.description,
  //     userId: req.user.id
  // })

  /*
    atau menggunakan cara yang di mudahkan oleh sequelize. jika kita mendefinisikan sebuah asosiasi antara dua
    model, maka sequalize akan memberikan special method yang bisa kita gunakan base on cara model kita ini
    ber asosiasi. untuk jelan nya silahkan buka link ini https://sequelize.org/v6/manual/assocs.html#special-methods-mixins-added-to-instances
    req.user.id ini object kembaliannya adalah sequalize maka dari itu kita bisa menggunakan special method tersebut.
    method yang kita gunakan adalah createProduct karena model user ini hasToMany(Products). jadi dari user ini kita
    bisa membuat product tanpa harus menghardcode userId nya di isi kan value apa.
    */
  req.user.createProduct({
    title: req.body.title,
    imageurl: req.body.imageUrl,
    price: req.body.price,
    description: req.body.description
  })
    .then((result) => {
      console.log(result)
      res.redirect('/')
    })
    .catch((err) => {
      console.log(err)
    })
}

exports.getEditProduct = (req, res, next) => {
  // ini untuk query di link nya karena link nya berikut href="/admin/edit-product/<%= product.id %>?edit=true"
  // jadi untuk ngambil var edit maka perlu di lakukan query.
  const editMode = req.query.edit
  // console.log(editMode);
  if (!editMode) {
    return res.redirect('/')
  }
  const prodId = req.params.productId
  // pake di bawah ini juga bisa. fungsi nya sama2 manggil product berdasarkan id product
  // Product.findByPk(prodId)
  req.user.getProducts({ where: { id: prodId } })
    .then((product) => {
      if (!product) {
        return res.redirect('/')
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product[0]
      })
    }).catch((err) => {
      console.log(err)
    })
}

exports.postEditProduct = (req, res, next) => {
  // console.log("data yang di kirimkan oleh form edit : " + JSON.stringify(req.body));
  Product.findByPk(req.body.productId)
    .then((product) => {
      product.title = req.body.title
      product.price = req.body.price
      product.imageurl = req.body.imageUrl
      product.description = req.body.description
      return product.save()
    }).then((result) => {
      // console.log(result);
      console.log('data updated')
      res.redirect('/admin/products')
    }).catch((err) => {
      console.log(err)
    })
}

exports.getProducts = (req, res, next) => {
  req.user.getProducts()
  // Product.findAll()
    .then((products) => {
      // console.log("rows" + products);
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      })
    }).catch((err) => {
      console.log(err)
    })
}

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId
  Product.destroy({
    where: {
      id: prodId
    }
  }).then(product => {
    console.log(product)
    console.log('data Deleted')
    res.redirect('/admin/products')
  }).catch((err) => {
    console.log(err)
  })
}

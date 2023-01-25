const express = require('express')
const router = express.Router()
const connection = require('../connection')
const auth = require('../services/authentication')
const checkRole = require('../services/checkRole')



router.post('/add', auth.authenticateToken, checkRole.checkRole, (req, res) => {
  const product = req.body
  let query = 'insert into product (name, categoryId, description, price, status) values(?,?,?,?,"true")'
  connection.query(query, [product.name, product.categoryId, product.description, product.price], (err, result) => {
    if (!err) {
      return res.status(200).json({ message: 'Product added successfully.' })
    } else {
      return res.status(500).json(err)
    }
  })
})


router.get('/get', auth.authenticateToken, (req, res) => {
  let query = `
    select p.id, p.name, p.description, p.price, p.status, c.id as categoryId, c.name as categoryName
    from product as p inner join category as c 
    where p.categoryId = c.id`
  connection.query(query, (err, result) => {
    if (!err) {
      return res.status(200).json(result)
    } else {
      return res.status(500).json(err)
    }
  })
})

router.get('/getByCategory/:id', auth.authenticateToken, (req, res) => {
  const id = req.params.id
  let query = 'select * from product where categoryId=?'
  connection.query(query, [id], (err, result) => {
    if (!err) {
      return res.status(200).json(result)
    } else {
      return res.status(500).json(err)
    }
  })
})


router.get('/getById/:id', auth.authenticateToken, (req, res) => {
  const id = req.params.id
  let query = 'select * from product where id=?'
  connection.query(query, [id], (err, result) => {
    if (!err) {
      return res.status(200).json(result[0])
    } else {
      return res.status(500).json(err)
    }
  })
})


router.patch('/update', auth.authenticateToken, checkRole.checkRole, (req, res) => {
  const product = req.body
  let query = 'update product set name=?, categoryId=?, description=?, price=? where id=?'
  connection.query(query, [product.name, product.categoryId, product.description, product.price, product.id], (err, result) => {
    if (!err) {
      if (result.affectedRows == 0)
        return res.status(404).json({ message: 'Product id was not found.' })
      return res.status(200).json({ message: 'Product updated successfully.' })
    } else {
      return res.status(500).json(err)
    }
  })
})


router.delete('/delete/:id', auth.authenticateToken, checkRole.checkRole, (req, res) => {
  const id = req.params.id
  let query = 'delete from product where id=?'
  connection.query(query, [id], (err, result) => {
    if (!err) {
      if (result.affectedRows == 0)
        return res.status(404).json({ message: 'Product id was not found.' })
      return res.status(200).json({ message: 'Product deleted successfully.' })
    } else {
      return res.status(500).json(err)
    }
  })
})


router.patch('/updateStatus', auth.authenticateToken, checkRole.checkRole, (req, res) => {
  const user = req.body
  let query = 'update product set status=? where id=?'
  connection.query(query, [user.status, user.id], (err, result) => {
    if (!err) {
      if (result.affectedRows == 0)
        return res.status(404).json({ message: 'Product id was not found.' })
      return res.status(200).json({ message: 'Product status updated successfully.' })
    } else {
      return res.status(500).json(err)
    }
  })
})



module.exports = router
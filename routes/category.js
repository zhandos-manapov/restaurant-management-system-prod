const express = require('express')
const router = express.Router()
const connection = require('../connection')
const auth = require('../services/authentication')
const checkRole = require('../services/checkRole')



router.post('/add', auth.authenticateToken, checkRole.checkRole, (req, res) => {
  const category = req.body
  let query = 'insert into category (name) values(?)'
  connection.query(query, [category.name], (err, result) => {
    if (!err) {
      return res.status(200).json({ message: 'Category added succefully.' })
    } else {
      return res.status(500).json(err)
    }
  })
})


router.get('/get', auth.authenticateToken, (req, res) => {
  let query = 'select * from category order by name'
  connection.query(query, (err, result) => {
    if (!err) {
      return res.status(200).json(result)
    } else {
      return res.status(500).json(err)
    }
  })
})


router.patch('/update', auth.authenticateToken, checkRole.checkRole, (req, res) => {
  const product = req.body
  let query = 'update category set name=? where id=?'
  connection.query(query, [product.name, product.id], (err, result) => {
    if (!err) {
      if (result.affectedRows == 0)
        return res.status(404).json({ message: 'Category id was not found.' })
      return res.status(200).json({ message: 'Category updated succefully.' })
    } else {
      return res.status(500).json(err)
    }
  })
})

module.exports = router
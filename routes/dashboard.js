const express = require('express')
const connection = require('../connection')
const router = express.Router()
const auth = require('../services/authentication')

router.get('/details', auth.authenticateToken, async (req, res) => {
    let categoryCount, productCount, billCount

    const promiseConnection = connection.promise()

    try {
        let query = 'select count(id) as categoryCount from category'
        let result = await promiseConnection.query(query)
        categoryCount = result[0][0].categoryCount

        query = 'select count(id) as productCount from product'
        result = await promiseConnection.query(query)
        productCount = result[0][0].productCount

        query = 'select count(id) as billCount from bill'
        result = await promiseConnection.query(query)
        billCount = result[0][0].billCount

        const data = { categoryCount, productCount, billCount }
        return res.status(200).json(data)

    } catch (err) {
        return res.status(500).json(err)
    }
})


module.exports = router
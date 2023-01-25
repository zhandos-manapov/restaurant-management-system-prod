require('dotenv').config()


function checkRole(req, res, next) {
  if (res.locals.role == process.env.ROLE)
    return res.sendStatus(401)
  next()
}


module.exports = { checkRole }
const Users = require('../users/users-model')

module.exports = {
  restricted,
  checkPasswordLength,
  checkUsernameExists,
  checkUsernameFree
}
/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
async function restricted(req, res, next) {
  if(req.session.user && req.session){
    next()
  } else {
    res.status(401).json({
      message:'You shall not pass!'
    })
  }
}

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
async function checkUsernameFree(req, res, next) {
  try{
    const results = await Users.findBy({username: req.body.username});
    
    results.length > 0 ? res.status(422).json({message: 'Username taken'}) : next()
  } catch (err){
    res.status(500).json(err)
  }
}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
async function checkUsernameExists( req, res, next) {
  try{
    const users = await Users.findBy({username:req.body.username})
    if(users.length){
      req.userData = users.length[0]
      next()
    } else {
      res.status(401).json({message:'Invalid credentials'})
    }
  } catch(err){
    res.status(500).json({message:'server error'})
  }
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
await function checkPasswordLength(req, res, next) {
  try{
    const passLength = await Users.find(req.body.password)
    if(passLength.length > 3){
      res.status(200).json({message:"Success"})
      next()
    } else {
      res.status(422).json({message:'Password must be longer than 3 chars'})
    }
  } catch(err){
    next(err)
  }
}

// Don't forget to add these to the `exports` object so they can be required in other modules

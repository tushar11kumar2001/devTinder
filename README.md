# DevTinder
  ## Read more about the indxing in schema
  ## Read about the logical query and comparison query in mongoDB



# DevTinder APIs :

## authRouter :
   - POST /signup
   - POST /login
   - POST /logout

## profileRouter :
   - GET /profile/view
   - PATCH /profile/edit
   - PATCH /profile/password

## connectionRequestRouter :
   -POST /request/send/:status/:userId
   -POST /request/review/:status/:userId

## userRouter :
   - GET /user/connections
   - GET /user/requests
   - GET /user/feed - Gets you the profiles of another users
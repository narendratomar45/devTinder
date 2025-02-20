# APIs

## authRouter

- post /signup
- post /login
- post /logout

## profileRouter

- get /profile/view
- Patch /profile/edit
- pathc /profile/password

## connectionRequestRouter

- post /request/send/interested/:id
- post /request/send/ignored/:id
- post /request/review/accepted/:id
- post /request/review/rejected/:id

## userRouter

- get /user/connections
- get /user/requests//recieved
- get /user/userFeed 
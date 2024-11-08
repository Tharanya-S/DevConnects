# DevTinder APIs

authRouter
POST /signup
POST /togin
POST /logout

profiteRouter
GET /profite/view
PATCH /profite/edit
PATCH /profite/password

connectionRequestRouter
POST /request/send/intereted/ :userld
POST /request/send/ignored/:userld
POST /request/review/accepted/: requestld
POST request/review/rejected/:requestld

userRouter
GET /user/connections
GET /user/requests
GET /user/feed -Gets you the profiles of other users on platform


Status: ignore, interested, accepeted, rejected
const express= require('express')
const app= express()
const mongoose= require('mongoose')
const PORT=5000
const {MONGOURI}=require('./keys')

require('./model/users')
app.use(express.json())
app.use(require('./routes/auth'))


mongoose.connect(MONGOURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.on('connected',()=>{
    console.log('Connected to Database Successfully')
})

mongoose.connection.on('error',(err)=>{
    console.log('err connecting',err)
})


app.listen(PORT,()=>{
    console.log(`Server started at PORT ${PORT}`)
})
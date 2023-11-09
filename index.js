const express = require('express');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv').config();
const connectDb=require('./server/config/connectDb')
const mongoStore=require('connect-mongo')

const app = express();

const PORT = process.env.PORT || 3500;

connectDb()

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.use(session({
    secret:'teclado pizza',
    resave:false,
    saveUninitialized:true,
    store:mongoStore.create({
        mongoUrl:process.env.MONGO_URL
    })
}))



app.use(express.static('public'))

app.use(expressLayout)
app.set('layout','./layouts/main')
app.set('view engine','ejs')

app.use('/',require('./server/routes/main'))
app.use('/',require('./server/routes/admin'))


app.listen(PORT,()=>{
    console.log('se conecto el servidor')
})
const express = require('express');
const router = express.Router();
const Publicaciones= require('../models/publicaciones')


router.get('',async(req,res)=>{
    // res.send('<h1>hola mundo</h1>')
    try{
        const posts=await Publicaciones.find({})
        console.log(posts)
        res.render('index',{posts})

    }catch(error){
        console.log(error)
    }

    
})

router.get('/about',(req,res)=>{
    let nombre = 'lucia'
    // res.send('<h1>hola mundo</h1>')
    res.render('about',{nombre})
})

module.exports=router
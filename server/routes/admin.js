const express = require('express');
const router = express.Router();
const Usuarios= require('../models/usuarios')
const Publicaciones= require('../models/publicaciones')
const bcrypt = require('bcrypt');



router.get('/add-post', (req,res)=>{
    res.render('admin/add-post')
})


router.get('/register', (req,res)=>{
    res.render('admin/index')
})

router.get('/admin', (req,res)=>{
    res.render('admin/index')
})

router.post('/admin',async(req,res)=>{
    const {username,password}=req.body
    try{
        const user=await  Usuarios.findOne({username})
        if(!user){
            return res.status(401).json({message:'informacion invalida'})
        }

        const validoPassword= await bcrypt.compare(password,user.password)
        if(!validoPassword){
            return res.status(401).json({message:'informacion invalida'})
        }
        // res.redirect('/dasboard',{user})
res.send('<h1>info sensible</h1>')

    }catch(error){
            console.log(error)
    }

})

router.post('/add-post',async (req,res)=>{
    const {titulo,texto}=req.body
    console.log(titulo,texto)
    try{
        const post= await Publicaciones.create({titulo,texto})
        // res.status(200).json({message: 'se creo el post ',post})
        res.redirect('/')


    }catch(error){
        console.log(error)
    }
})


router.post('/register',async (req,res)=>{
    const {username,password}=req.body

     const hashedPassword=await bcrypt.hash(password,10)
    console.log(username,password)
    try{
        const user= await Usuarios.create({username,password:hashedPassword})
        console.log(user)
      res.redirect('/')
    }catch(error){
        if(error.code===11000){

            console.log('ese usuario ya esta en uso')
            
        }
    }
})


module.exports=router
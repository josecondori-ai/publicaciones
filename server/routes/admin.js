require('dotenv').config();
const express = require('express');
const router = express.Router();
const Usuarios= require('../models/usuarios')
const Publicaciones= require('../models/publicaciones')
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken')

const jswSecret=process.env.JWT_SECRET

//funciones midlleware
const accesoMiddle=(req,res,next)=>{
    console.log('soy cookie',req.cookies)
    const token = req.cookies.token
        if(!token){
            return res.status(401).json({mensaje:'no estas autorizado'})
        }

        try{
           const decodificar= jwt.verify(token,jswSecret)
            req.userId=decodificar.userId
            next()
        }catch(error){
             res.status(401).json({mensaje:'no estas autorizado'})

        }
}



router.get('/add-post', (req,res)=>{
    res.render('admin/add-post')
})

//GET
// router.get('/register', (req,res)=>{
//     res.render('admin/index')
// })

// router.get('/admin', (req,res)=>{
//     res.render('admin/index')
// })

router.get('/login',(req,res)=>{
    res.render('admin/index')
})

router.get('/dashboard',async(req,res)=>{
    
    try{
            console.log('holaaa')
        const data= await Publicaciones.find({})
        console.log('soy data',data)
        res.render('admin/dashboard',{data:data})
    }catch(error){
        console.log(error)
    }
    
})



//POST

router.post('/login',async(req,res)=>{
    const {username,password}=req.body
    try{
           const resultado= await Usuarios.findOne({username}) 
        /*
        {
            username:pepe23,
            dni:6564,
            tel:54654
            password:pepe2023
            _id:6546d5a4sd65sa
        }
        */
            console.log(resultado)
           if(!resultado){
            return res.status(401).json({mensaje:'credencial invalida'})
           }
           const passwordValido= await bcrypt.compare(password,resultado.password)
           
           if(!passwordValido){
            return res.status(401).json({mensaje:'credencial invalida'})

           }
            const token=jwt.sign({userId:resultado._id},jswSecret)
            res.cookie('token',token,{httpOnly:true})

           res.render('admin/dashboard')



    }catch(error){
        console.log(error)
    }
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

        //pepe    =>  sdf64sd5f46sd5f4s6df54we6r5we4

        //sdf64sd5f46sd5f4s6df54we6r5we4 pepe
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


router.get('/logout',(req,res)=>{
    res.clearCookie('token')
    res.redirect('/')
})


module.exports=router
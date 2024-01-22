require("dotenv").config();
const User = require("../models/usuarios.model");
const jwt = require ("jsonwebtoken")
const bcrypt = require("bcrypt");
const { request } = require("express");
const saltos = process.env.SALTOS;

    const index = async (req, res) => {
    try{
        const usuarios = await User.getAll();
        return res.status(200).json({
            message: "usuarios obtenidos correctamente",
            data: usuarios
        })
    }catch(error){
        return res.status(500).json({
        message: "error al obtener datos",
        error:error.message
        })
    }
}

//2
const createUser = async (req,res) =>{
    try{
        console.log(req.body)
        const usuario = new User({
            nombre: req.body.nombre,
            correo:req.body.correo,
            contrasena:bcrypt.hashSync(req.body.contrasena,parseInt(saltos)),
            created_at : new Date()
        })
        await usuario.save();
        return res.status(200).json({
            message:"usuario creado correctamente",
            data:usuario,
            succesn:true
        })
    }catch(error){
        return res.status(500).json({
            message:"error al crear usuario",
            error:error.message,
            succesn:false
        })
    }
}

const signIn = async(req,res)=>{
    console.log(req.body)
    const usuarioFound = await User.findUsername(req.body.correo)
    console.log(usuarioFound)
    if(!usuarioFound){
        return res.status(404).json({
            message:"usuario o password incorrectos"
        })
    }
    const matchPassword = await User.comparePassword(req.body.password,usuarioFound.contrasena)
    if(!matchPassword){
        return res.status(404).json({
            message:"usuario o password incorrectos"
        })
    }
    const token = jwt.sign({id:usuarioFound.id_usuario},process.env.SECRET_NAME,{
        expiresIn: 86400
    })
    return res.status(200).json({
        message:"sign in",
        token: token,
    })
}  
module.exports={
    index,
    createUser,
    signIn
 }
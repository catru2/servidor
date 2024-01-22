const Dept= require("../models/dept.model")
const jwt = require("jsonwebtoken")
const fs=require("fs-extra")
const { uploadImage } = require("../configs/cloudinary.config")

let responsesClientes = [];

const index = async (req, res) => {
    try{
        const usuarios = await Dept.getAll();
        return res.status(200).json({
            message: "departamentos obtenidos correctamente",
            data: usuarios
        })
    }catch(error){
        return res.status(500).json({
        message: "error al obtener datos",
        error:error.message
        })
    }
}

const createDept = async (req,res) =>{
    try{
        console.log(req.body)
        const token=req.headers.token
        const decoded= jwt.verify(token,process.env.SECRET_NAME)
        
        let imagen=null
        if(req.files?.imagen){
            imagen=await uploadImage(req.files.imagen.tempFilePath)
            await fs.unlink(req.files.imagen.tempFilePath)
        } 
        const dept = new Dept({
            id_usuario: decoded.id,
            ubicacion: req.body.ubicacion,
            precio:req.body.precio,
            imagen: imagen.secure_url,
            created_by:decoded.id,
            created_at: new Date()
        })
        console.log(dept)
        await dept.save();
        return res.status(200).json({
            message:"publicacion del departamento creada correctamente",
            data:dept
        })
    }catch(error){
        return res.status(500).json({
            message:"error al crear publicacion",
            error:error.message
        })
    }
}

function responderNotificacion(notificacion) {
    for (res of responsesClientes) {
        res.status(200).json({
            success: true,
            notificacion
        });
    }

    responsesClientes = [];
}

const getNuevosDept = (req, res) => {
    responsesClientes.push(res);
    // [res1, res2, res3]
    req.on('close', () => {
        const index = responsesClientes.length; 
        responsesClientes = responsesClientes.slice(index, 1);
    });
}
module.exports={
    index,
    createDept,
    getNuevosDept
}
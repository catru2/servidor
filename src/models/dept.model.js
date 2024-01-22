const db = require("../configs/db.config");
const bcrypt = require("bcrypt");
class Dept{
    constructor({id_dept,id_usuario,ubicacion,precio,imagen,created_by,created_at,updated_by,updated_at,deleted_by,deleted_at,deleted}){
       this.id_dept=id_dept;
       this.id_usuario=id_usuario;
       this.ubicacion=ubicacion;
       this.precio=precio;
       this.imagen=imagen;
       this.created_by=created_by;
       this.created_at=created_at;
       this.updated_by=updated_by;
       this.updated_at=updated_at;
       this.deleted_by=deleted_by;
       this.deleted_at=deleted_at;
       this.deleted=deleted;
    }

    //1
    static async getAll() {
        const connection = await db.createConnection();
        const [rows] = await connection.query(
          "SELECT id_dept,id_usuario,ubicacion,precio,imagen,created_by, created_at ,updated_by,updated_at,deleted_by,deleted_at,deleted FROM dept WHERE deleted=0 ;"
        );
        connection.end();
        return rows;
      }


      //2
      async save() {
        const connection = await db.createConnection();
        const [result] = await connection.execute(
          "INSERT INTO dept (id_usuario,ubicacion,precio,imagen,created_by,created_at) VALUES (?,?,?,?,?,?)",
          [this.id_usuario,this.ubicacion,this.precio,this.imagen,this.created_by,this.created_at]
        );
        connection.end();
        if (result.insertId == 0) {
          throw new Error("no se pudo crear la publicacion del departamento");
        }
        this.id = result.insertId;
      }

}
module.exports=Dept;
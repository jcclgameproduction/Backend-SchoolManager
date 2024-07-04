const Office = require("../models/Office");

module.exports = class OfficeController{

    static async getAllOffices(req, res){
        try{
            const offices = await Office.findAll({raw:true});
           
            return res.status(200).json({offices});
        } catch(error){
            console.error(error);
            return res.status(500).send("Erro interno do servidor");
        }
    }

}
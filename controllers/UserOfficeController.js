const UserOffice = require("../models/UserOffice");

module.exports = class UserOfficeController{
    
    static async register(req, res){
        const idUser = req.body.idUser;
        const idOffices = req.body.idOffices;
        try {
            for(let i = 0; i < idOffices.length; i++){
                const userOffice = await UserOffice.create({idUser, idOffice: idOffices[i]});
            }
            if(res === null){
                return true;
            }else{
                return res.status(201).json({ message: "Cargo registrado com sucesso" });
            }
        } catch (error) {
            console.error(error);
            if(res === null){
                return false;
            } else {
                return res.status(500).send("Erro interno do servidor");
            }
        }
    }

    static async delete(req, res){
        const idUser = req.body.idUser;
        const idOffice = req.body.idOffice;
        
        try {
            const userOffice = await UserOffice.destroy({where: {idUser, idOffice}});
            return res.status(200).json({ message: "Usuário deletado do Cargo com sucesso" });
        } catch (error) {
            console.error(error);
            return res.status(500).send("Erro interno do servidor");
        }
    }

    static async getUserOffice(req, res){
        const idUser = req.params.idUser;
        
        try {
            const userOffice = await UserOffice.findOne({where: {idUser}});
            if (!userOffice) {
                return res.status(404).send("Cargo não encontrado");
            }
            return res.status(200).json(userOffice);
        } catch (error) {
            console.error(error);
            return res.status(500).send("Erro interno do servidor");
        }
    }
}
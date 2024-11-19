const CatchStudent = require("../models/CatchStudent");
const Familiar  = require('../models/Familiar');

module.exports = class CatchStudentController {
    static async register(req, res) {
        try {
            const { enrollment, idFamiliar } = req.body;
            
            await CatchStudent.findOrCreate({ where: { idStudent: enrollment,  idFamiliar} });
            
            return res.status(200).json({ message: "Sucesso!" });
        } catch (err) {
            console.error(err);
            return res.status(400).send({error: "Erro interno do servidor. Tente novamente mais tarde."});
        }
    }    

    static async delete(req, res) {
        try {
            const { enrollment, idFamiliars } = req.body;
            
            // Loop para percorrer os idFamiliars
            for (const idFamiliar of idFamiliars) {
                await CatchStudent.destroy({ where: { idStudent: enrollment, idFamiliar } });
            }
            
            return res.status(200).json({ message: "Sucesso!" });
        } catch (err) {
            console.error(err);
            return res.status(400).send({error: "Erro interno do servidor. Tente novamente mais tarde."});
        }
    }

    static async getFamiliar(req, res) {
        try {
            const { idStudent } = req.params;
            const catchStudent = await CatchStudent.findAll({raw : true, where : { idStudent : idStudent }});
            const familiarsList = [];

            const promises = catchStudent.map(async (familiar) => {
                const responsible = await Familiar.findOne({ where: { id: familiar.idFamiliar } });
                familiarsList.push(responsible);
            });
            
            await Promise.all(promises)
            return res.status(200).json({familiarsList});
            
        } catch(error){
            console.error(error);
            return res.status(400).send({error: "Erro"});
        }
    }
    
}
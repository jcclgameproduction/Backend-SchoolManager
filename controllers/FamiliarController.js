const Familiar = require("../models/Familiar");
const Student = require("../models/Student");
const sequelize = require("../db/conn");
const { Op } = require('sequelize');
const CatchStudent = require("../models/CatchStudent");

module.exports = class FamiliarController{
    static async register(req, res){
        try{
            const name = req.body.name;
            const profession = req.body.profession;
            const cpf = req.body.cpf;
            const email = req.body.email;
            const phone = req.body.phone;            
            await Familiar.create({name, profession, cpf, email, phone});  
            
            return res.status(201).json({ message: "Familiar criado com sucesso" });
        } catch(error){
            console.error(error);
            return res.status(500).send("Erro interno do servidor");
        }
        
    }

    static async getAllFamiliars(req, res){
        try{
            const familiars = await Familiar.findAll({raw:true});
            familiars.sort((a, b) => {
                const nameA = a.name.toLowerCase();
                const nameB = b.name.toLowerCase();        
                return nameA.localeCompare(nameB);
              });
            return res.status(200).json({familiars});
        } catch(error){
            console.error(error);
            return res.status(500).send("Erro interno do servidor");
        }
    }

    static async getFamiliar(req, res){
        try{
            const id = req.params.idFamiliar;            
            const familiar = await Familiar.findOne({raw:true, where: {id}});
            if(!familiar){
                return res.status(404).json({ errors: [{msg: "Familiar não encontrado!"}] });
            }
            return res.status(200).json({familiar});
        } catch(error){
            console.error(error);
            return res.status(500).send("Erro interno do servidor");
        }
    }

    static async updateFamiliar(req, res){
        try{
            
            const {id, name, profession, cpf, email,  phone} = req.body;             
            const familiar = await Familiar.findOne({raw:true, where: {id}});
            if(!familiar){
                return res.status(404).json({ errors: [{msg: "Familiar não encontrado!"}] });
            }
            await Familiar.update({ name, profession, cpf, email, phone }, { where:{id} });

            return res.status(201).json({ message: "Familiar atualizado com sucesso" });
        } catch(error){
            console.error(error);
            return res.status(500).send("Erro interno do servidor");
        }
    }

    static async delete(req, res){
        const t = await sequelize.transaction();
        try {
            const id = req.body.id;
            const familiar = await Familiar.findOne({ raw: true, where: { id } });

            if (!familiar) {
                await t.rollback();
                return res.status(404).json({ errors: [{ msg: "Familiar não encontrado!" }] });
            }

            await Student.update(
                { idMother: null },
                { where: { idMother: id }, transaction: t }
            );
            await Student.update(
                { idFather: null },
                { where: { idFather: id }, transaction: t }
            );
            await Student.update(
                { idResponsible: null },
                { where: { idResponsible: id }, transaction: t }
            );
            await Student.update(
                { idEmergencyContact: null },
                { where: { idEmergencyContact: id }, transaction: t }
            );

            await CatchStudent.destroy({where: {idFamiliar: id}, transaction: t})

            await Familiar.destroy({ where: { id }, transaction: t });

            await t.commit();

            return res.status(200).json({ message: "Familiar deletado com sucesso" });
        } catch (error) {
            await t.rollback();
            console.error(error);
            return res.status(500).send("Erro interno do servidor");
        }
    }

    static async searchFamiliarForNameOrCPF(req, res){
        try{
            const search = req.params.search;
            const familiar = await Familiar.findAll({
                where: {
                  [Op.or]: [
                    {name: {
                        [Op.like]: `${search}%`,
                      }
                    }, 
                    {cpf: {
                        [Op.like]: `${search}%`,
                      }
                    }
                  ]
                } 
              });            
            if(!familiar){
                return res.status(404).json({ errors: [{msg: "Familiar não encontrado!"}] });
            }
            return res.status(200).json({familiar});
        } catch(error){
            console.error(error);
            return res.status(500).send("Erro interno do servidor");
        }
    }
}
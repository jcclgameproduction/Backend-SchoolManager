const Address = require("../models/Address");
const Student = require("../models/Student");

module.exports = class AddressController{
    static async register(req, res){

        try{
            const street = req.body.street;
            const city = req.body.city;
            const block = req.body.block;
            const lot = req.body.lot;
            const sector = req.body.sector;
            const number = req.body.number;
            const {enrollment} = req.body;
            
            const address = await Address.create({street, city, block, lot, sector, number});

            if(address){
                await Student.update({idAddress: address.id}, {where: {enrollment: enrollment}})
            }

            return res.status(201).json({ message: "Endereço criado com sucesso" })
        } catch(error){
            console.error(error);
            return res.status(500).send("Erro interno do servidor");
        }
        
    }

    static async getAllAddresses(req, res){
        try{
            const addresses = await Address.findAll({raw:true});
            return res.status(200).json({addresses});            
        } catch(error){
            console.error(error);
            return res.status(500).send("Erro interno do servidor");
        }
    }

    static async updateAddress(req, res){
        try{
            const id = req.body.id;
            const street = req.body.street;
            const city = req.body.city;
            const block = req.body.block;
            const lot = req.body.lot;
            const sector = req.body.sector;
            const number = req.body.number;

            const address = await Address.findByPk(id);
            if(!address){
                return res.status(404).send("Endereço não encontrado");
            }

            address.street = street || address.street;
            address.city = city || address.city;
            address.block = block || address.block;
            address.lot = lot || address.lot;
            address.sector = sector || address.sector;
            address.number = number || address.number;

            await address.save();

            return res.status(200).json({ message: "Endereço atualizado com sucesso" });
        } catch(error){
            console.error(error);
            return res.status(500).send("Erro interno do servidor");
        }
    }

    static async delete(req, res){
        try{
            const id = req.body.id;
            const address = await Address.findByPk(id);
            if(!address){
                return res.status(404).send("Endereço não encontrado");
            }

            // Check if there are any students referencing this address
            const hasStudents = await Student.findOne({ where: { idAddress: id } });
            if(hasStudents){
                return res.status(400).send("Não é possível excluir o endereço, pois há alunos fazendo referência a ele");
            }

            await address.destroy();
            
            return res.status(200).json({ message: "Endereço deletado com sucesso" });
        } catch(error){
            console.error(error);
            return res.status(500).send("Erro interno do servidor");
        }
    }

    static async getAddress(req, res){
        const id = req.params.id;
        try {
            const address = await Address.findByPk(id);
            if(!address){
                return res.status(404).send("Endereço não encontrado");
            }
            return res.status(200).json({address});
        } catch (error) {
            console.error(error);
            return res.status(500).send("Erro interno do servidor");
        }
    }
}
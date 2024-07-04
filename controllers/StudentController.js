const Student = require("../models/Student");
const Address = require("../models/Address");
const { Op } = require('sequelize');

module.exports = class StudentController{
    static async generateEnrollment() {
      const currentYear = new Date().getFullYear();
      const lastRegistration = await Student.findOne({
        where: {
          enrollment: {
            [Op.like]: `${currentYear}%`,
          },
        },
        order: [['enrollment', 'DESC']],
      });
    
      let lastNumber = 0;
      if (lastRegistration) {
        const lastEnrollment = lastRegistration.enrollment;
        lastNumber = parseInt(lastEnrollment.substring(4), 10);
      }
    
      const nextNumber = lastNumber + 1;
      const paddedNumber = nextNumber.toString().padStart(3, '0');
    
      return `${currentYear}${paddedNumber}`;
    }

    static async register(req, res){
        try{
            let enrollment = req.body.enrollment;
            const name = req.body.name;
            const birthDate = req.body.birthDate;
            const naturalness = req.body.naturalness;
            const monthlyPayment = req.body.monthlyPayment;
            const healthCare = req.body.healthCare;
            const idMother = req.body.mother;
            const idFather = req.body.father;
            const idResponsible = req.body.responsible;
            const idEmergencyContact = req.body.emergencyContact;
            const idAddress = req.body.address;

            if(enrollment == '' || enrollment == null){
                enrollment = await StudentController.generateEnrollment();
            }
            
            await Student.create({enrollment, name, birthDate, naturalness, monthlyPayment, healthCare, idMother, idFather, idResponsible, idEmergencyContact, idAddress});

            return res.status(201).send("Aluno criado com sucesso");
        } catch(error){
            console.error(error);
            return res.status(500).send("Erro interno do servidor");
        }
    }
    
    static async update(req, res){
      try{
        const enrollment = req.body.enrollment;
        const name = req.body.name;
        const birthDate = req.body.birthDate;
        const naturalness = req.body.naturalness;
        const monthlyPayment = req.body.monthlyPayment;
        const healthCare = req.body.healthCare;
        const idMother = req.body.mother;
        const idFather = req.body.father;
        const idResponsible = req.body.responsible;
        const idEmergencyContact = req.body.emergencyContact;
        const idAddress = req.body.address;

        const student = await Student.findOne({where: {enrollment: enrollment}});
        if(!student){
          return res.status(404).send("Aluno não encontrado");
        }

        student.name = name || student.name;
        student.birthDate = birthDate || student.birthDate;
        student.naturalness = naturalness || student.naturalness;
        student.monthlyPayment = monthlyPayment || student.monthlyPayment;
        student.healthCare = healthCare || student.healthCare;
        student.idMother = idMother || student.idMother;
        student.idFather = idFather || student.idFather;
        student.idResponsible = idResponsible || student.idResponsible;
        student.idEmergencyContact = idEmergencyContact || student.idEmergencyContact;
        student.idAddress = idAddress || student.idAddress;

        await student.save();

        return res.status(200).send("Aluno atualizado com sucesso");
      } catch(error){
        console.error(error);
        return res.status(500).send("Erro interno do servidor");
      }
    }

    static async delete(req, res){
      try{
        const enrollment = req.body.enrollment;

        const student = await Student.findOne({where: {enrollment: enrollment}});
        if(!student){
          return res.status(404).send("Aluno não encontrado");
        }

        if(student.idAddress){
          console.log(student.idAddress)
          const address = await Address.findByPk(student.idAddress);
          await address.destroy();
        }

        await student.destroy();

        return res.status(200).send("Aluno deletado com sucesso");
      } catch(error){
        console.error(error);
        return res.status(500).send("Erro interno do servidor");
      }
    }
    
    static async getStudent(req, res) {
      try{
        const enrollment = req.params.enrollment;
        const student = await Student.findOne({where: {enrollment: enrollment}});
        if(!student){
          return res.status(404).send("Aluno não encontrado");
        }

        return res.status(200).json({student});
      } catch(error){
        console.error(error);
        return res.status(500).send("Erro interno do servidor");
      }
    }

    static async getAllStudent(req, res) {
      try{
        const studentsList = await Student.findAll({raw : true});

        studentsList.sort((a, b) => {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();        
          return nameA.localeCompare(nameB);
        });
        
        return res.status(200).json({studentsList});
      } catch(error) {
        console.log(error);
        return res.status(500).send("Erro interno do servidor");
      }
    }

    static async searchStudentForNameOrEnrollment(req, res){
      try{
          const search = req.params.search;
          const student = await Student.findAll({
              where: {
                [Op.or]: [
                  {name: {
                      [Op.like]: `${search}%`,
                    }
                  }, 
                  {enrollment: {
                      [Op.like]: `${search}%`,
                    }
                  }
                ]
              } 
            });            
          if(!student){
              return res.status(404).json({ errors: [{msg: "Aluno não encontrado!"}] });
          }
          return res.status(200).json({student});
      } catch(error){
          console.error(error);
          return res.status(500).send("Erro interno do servidor");
      }
  }
}
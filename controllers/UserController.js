const User = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const InvalidToken = require("../models/InvalidToken");
const UserOfficeController = require("./UserOfficeController");
const { Op } = require('sequelize');

module.exports = class UserControler {
    static async login(req, res) {
        const email = req.body.email;
        const password = req.body.password;

        try {
            // Buscar o usuário no banco de dados
            const user = await User.findOne({ raw: true, where: { email: email } });

            if (!user) {
                // Se o usuário não for encontrado, enviar uma resposta de erro 401
                return res.status(404).send("Usuário não encontrado");
            }

            // Comparar a senha fornecida com o hash armazenado no banco de dados
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                // Se a senha corresponder, gerar um JWT com os dados do usuário (exceto a senha)
                const token = jwt.sign(
                    { id: user.id, email: user.email, loginType: 'NORMAL' /* adicione outros dados aqui se necessário */ },
                    process.env.JWTSECRET.toString()
                );

                // Enviar o token como resposta
                return res.status(200).json({ token });
            } else {
                // Se a senha não corresponder, enviar uma resposta de erro 401
                return res.status(401).send("Senha incorreta");
            }
        } catch (error) {
            // Lidar com erros inesperados
            console.error(error);
            return res.status(500).send("Erro interno do servidor");
        }
    }

    static async changePassword(req, res) {
        const newPassword = req.body.newpassword;
        const email = req.body.email;

        try {
            // Buscar o usuário no banco de dados
            const user = await User.findOne({ where: { email: email } });

            if (!user) {
                // Se o usuário não for encontrado, enviar uma resposta de erro 404
                return res.status(404).send("Usuário não encontrado");
            }

            // Gerar o hash da nova senha
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Atualizar a senha do usuário
            user.password = hashedPassword;
            await user.save();

            InvalidToken.create({ token: req.headers.authorization });

            return res.status(200).send("Senha alterada com sucesso");
        } catch (error) {
            // Lidar com erros inesperados
            console.error(error);
            return res.status(500).send("Erro interno do servidor");
        }
    }

    static async sendMail(req, res) {
        const email = req.body.email;
        const type = req.body.type;
        const id = req.body.id;
        const time = type === 'CHANGE' ? '1h' : type === 'CREATE' ? '48h' : type === 'CHANGEMAIL' ? '24h' : '';
        const message = type === 'CHANGE' ? 'Alteração de senha' : type === 'CREATE' ? 'Criação de usuário' : type === 'CHANGEMAIL' ? 'Alteração de email' : '';
        var user;
        try {
            // Verificar se o usuário existe no banco de dados
            if(type === 'CHANGE' || type === 'CREATE') {
                user = await User.findOne({ where: { email: email } });
            }else{
                user = await User.findByPk(id);
            }
            if (!user) {
                // Se o usuário não for encontrado, enviar uma resposta de erro 404
                return res.status(404).send("Usuário não encontrado");
            }

            // Gerar o JWT com o email do usuário e definir a expiração para 1 hora
            const token = jwt.sign({ id: user.id, email: email, loginType: type }, process.env.JWTSECRET.toString(), { expiresIn: time });
            console.log(token);
            // Construir o link de alteração de senha
            const changePasswordLink = `${process.env.APP_URL}/${token}`;

            // Enviar o email para o usuário
            const transporter = nodemailer.createTransport({
                // Configurar o transporte de email (exemplo usando o serviço SMTP do Gmail)
                service: 'gmail',
                auth: {
                    user: process.env.USERMAIL,
                    pass: process.env.PASSMAIL
                }
            });

            const mailOptions = {
                from: process.env.USERMAIL,
                to: email,
                subject: message,
                text: `Para mudar sua senha, acesse o link abaixo:\n${changePasswordLink}`
            };

            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.error(error);
                    return res.status(500).send("Erro ao enviar o email");
                } else {
                    return res.status(200).send("Email enviado com sucesso");
                }
            });
        } catch (error) {
            // Lidar com erros inesperados
            console.error(error);
            return res.status(500).send("Erro interno do servidor");
        }
    }

    static async createUser(req, res) {
        const { name, cpf, idOffices, email } = req.body;
        var newUser;

        try {
            // Verificar se o usuário já existe no banco de dados
            const existingUser = await User.findOne({ where: { email: email } });

            if (existingUser) {
                // Se o usuário já existir, enviar uma resposta de erro 409
                return res.status(409).send("Usuário com este email já existe");
            }

            // Gerar uma senha aleatória
            const password = Math.random().toString(36).slice(-8);

            // Gerar o hash da senha
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Criar o novo usuário
            newUser = await User.create({
                name: name,
                cpf: cpf,
                email: email,
                password: hashedPassword
            });
            req.body.idUser = newUser.id;
            console.log(newUser.id)
            if(await UserOfficeController.register(req, null) === false){
                throw new Error("Erro ao registrar o cargo do usuário");
            }
            
            return res.status(200).json({ userId: newUser.id });
        } catch (error) {
            // Lidar com erros inesperados
            newUser.destroy();
            console.error(error);
            return res.status(500).send("Erro interno do servidor");
        }
    }

    static async deleteUser(req, res) {
        const userId = req.body.id;
        try {
            // Verificar se o usuário existe no banco de dados
            const user = await User.findByPk(userId);

            if (!user) {
                // Se o usuário não for encontrado, enviar uma resposta de erro 404
                return res.status(404).send("Usuário não encontrado");
            }

            // Deletar o usuário
            await user.destroy();

            return res.status(200).send("Usuário deletado com sucesso");
        } catch (error) {
            // Lidar com erros inesperados
            console.error(error);
            return res.status(500).send("Erro interno do servidor");
        }
    }
    
    static async updateEmail(req, res) {
        const userId = req.body.id;
        const newEmail = req.body.newemail;
        try {
            // Verificar se o usuário existe no banco de dados
            const user = await User.findByPk(userId);

            if (!user) {
                // Se o usuário não for encontrado, enviar uma resposta de erro 404
                return res.status(404).send("Usuário não encontrado");
            }

            // Atualizar o email do usuário
            user.email = newEmail;
            await user.save();
            
            InvalidToken.findOrCreate({ where: { token: req.headers.authorization } });

            return res.status(200).send("Email atualizado com sucesso");
        } catch (error) {
            // Lidar com erros inesperados
            console.error(error);
            return res.status(500).send("Erro interno do servidor");
        }
    }

    static async logout(req, res) {
        const token = req.headers.authorization;
        try {
            InvalidToken.findOrCreate({ where: { token: token } });
            return res.status(200).send("Logout efetuado com sucesso");
        } catch (error) {
            console.error(error);
            return res.status(500).send("Erro interno do servidor");
        }
    }

    static async testAuth(req, res) {
        // Se o middleware verifyAuth funcionar, o usuário terá acesso a este endpoint
        return res.status(200).send(`Autenticado com sucesso como ${req.user.email}`);
    }

    static async getUser(req, res) {
        const id = req.params.id;
        try {
            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).send("Usuário não encontrado");
            }
            return res.status(200).json(user);
        } catch (error) {
            console.error(error);
            return res.status(500).send("Erro interno do servidor");
        }
    }

    static async getAllUsers(req, res){
        try{
            const users = await User.findAll({raw:true});
            users.sort((a, b) => {
                const nameA = a.name.toLowerCase();
                const nameB = b.name.toLowerCase();        
                return nameA.localeCompare(nameB);
              });
            return res.status(200).json({users});
        } catch(error){
            console.error(error);
            return res.status(500).send("Erro interno do servidor");
        }
    }

    static async searchUserForNameOrCPF(req, res){
        try{
            const search = req.params.search;
            const user = await User.findAll({
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
            if(!user){
                return res.status(404).json({ errors: [{msg: "Funcionário não encontrado!"}] });
            }
            return res.status(200).json({user});
        } catch(error){
            console.error(error);
            return res.status(500).send("Erro interno do servidor");
        }
    }

    static async updateUser(req, res) {
        const {id, name, cpf, email } = req.body;

        try {
            // Verificar se o usuário já existe no banco de dados
            const existingUser = await User.findOne({ where: { id: id } });

            if (!existingUser) {
                return res.status(400).send("Usuário não encontrado");
            }

            await User.update({ name, cpf, email }, { where:{id} })
            
            
            return res.status(200).send("Usuário atualizado com sucesso");
        } catch (error) {
            console.error(error);
            return res.status(500).send("Erro interno do servidor");
        }
    }

}
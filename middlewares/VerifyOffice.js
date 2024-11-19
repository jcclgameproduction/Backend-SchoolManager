const UserOffice = require("../models/UserOffice");
const Office = require("../models/Office");

function verifyOffice(officeList) {
    return async function(req, res, next) {
        try {
            const userId = req.user.id;
            const userOfficesId = await UserOffice.findAll({ where: { idUser: userId } });

            const officeIds = userOfficesId.map(userOffice => userOffice.idOffice);
            const offices = await Office.findAll({ where: { id: officeIds } });

            const officeNames = offices.map(office => office.name);

            // Verifica se algum cargo da lista de cargos (officeList) está presente em officeNames
            const hasMatchingOffice = officeList.some(office => officeNames.includes(office));

            if (!hasMatchingOffice) {
                return res.status(403).send({error: "Você não tem permissão para acessar este recurso."});
            }

            // Se houver correspondência, avança para o próximo middleware
            next();
        } catch (error) {
            console.error(error);
            return res.status(500).send({error: "Erro interno do servidor"});
        }
    };
}

module.exports = verifyOffice;

const {sequelize} = require('../model')
const Op = sequelize.Sequelize.Op;

async function contractById(req) {
    try {
        const profileId = req.profile.dataValues.id
        const {Contract} = sequelize.models
        const {id} = req.params
        const contract = await Contract.findOne({
            where: {
                id, 
                contractorId: profileId
            }
        })
        if(!contract) return { status: 404, data: '' }
        return { status: 200, data: contract }
    } catch (e) {
        console.log(e)
        return { status: 404, data: ''}
    }
}

async function contracts(req) {
    try {
        const profileId = req.profile.dataValues.id
        const {Contract} = req.app.get('models')
        const contracts = await Contract.findAll({
            where: {
                [Op.or]: [
                    {
                        contractorId: profileId
                    }, {
                        clientId: profileId
                    },
                ],
                status: {
                    [Op.not]: 'terminated' 
                }
            }
        })
        if(!contracts) return { status: 404, data: '' }
        return { status: 200, data: contracts }
    } catch (e) {
        console.log(e)
        return { status: 404, data: '' }
    }
}

module.exports = {
    contractById,
    contracts
}
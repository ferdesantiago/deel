const {sequelize} = require('../model')
const Op = sequelize.Sequelize.Op;

async function bestProfession(req) {
    try {
        const {start, end} = req.query //Date format: "2022-04-17 14:53:38.772UTC"
        const {Contract, Job, Profile} = req.app.get('models')
        const contractors = await Profile.findAll({
            attributes: [
                'profession'
            ],
            raw: true,
            where: {
                type: 'contractor'
            },
            subQuery: false,
            limit: 1,
            include: [
                {
                    model: Contract,
                    as: 'Contractor',
                    attributes: [],
                    where: {
                        createdAt: {
                            [Op.between]: [start, end]
                        }
                    },
                    required: true,
                    include: [
                        {
                            model: Job,
                            attributes: [
                                [sequelize.fn('SUM', sequelize.col('price')), 'total']
                            ],
                            required: true
                        }
                    ]
                }
            ],
            group: "profession",
            order: [
                [sequelize.fn('SUM', sequelize.col('price')), 'DESC']
            ]
        })
        if(!contractors) return { status: 404, data: ''}
        if(contractors.length === 0) return { status: 404, data: 'No results'}
        return { status: 200, data: contractors[0].profession}
    } catch (e) {
        return { status: 404, data: ''}
    }
}

async function bestClients(req) {
    try {
        let {start, end, limit} = req.query //Date format: "2022-04-17 14:53:38.772UTC"
        if (!limit) limit = 2;
        const {Contract, Job, Profile} = req.app.get('models')
        const clients = await Profile.findAll({
            attributes: [
                ['id', 'clientId'],
                [sequelize.literal("firstName || ' ' || lastName"), "fullName"]
            ],
            raw: true,
            where: {
                type: 'client'
            },
            subQuery: false,
            limit: limit,
            include: [
                {
                    model: Contract,
                    as: 'Client',
                    attributes: [],
                    // through: {
                    //     attributes: ['price']
                    // },
                    where: {
                        createdAt: {
                            [Op.between]: [start, end]
                        }
                    },
                    required: true,
                    include: [
                        {
                            model: Job,
                            attributes: [
                                [sequelize.fn('SUM', sequelize.col('price')), 'paid']
                            ],
                            where: { 
                                paid: true
                            },
                            required: true
                        }
                    ]
                }
            ],
            group: "clientId",
            order: [
                [sequelize.fn('SUM', sequelize.col('price')), 'DESC']
            ]
        })
        if(!clients) return { status: 404, data: ''}
        if(clients.length === 0) return { status: 404, data: 'No results'}
        return { status: 200, data: clients}
    } catch (e) {
        return { status: 404, data: '' }
    }
}

module.exports = {
    bestProfession,
    bestClients
}
const {sequelize} = require('../model')
const Op = sequelize.Sequelize.Op;

async function deposit(req) {
    try {
        const clientId = req.params.userId
    const money = req.body.money //Validations could be a nice extra feature: https://www.npmjs.com/package/validator
    const {Contract, Job, Profile} = req.app.get('models')
    const client = await Profile.findOne({
        attributes: [
            'balance'
        ],
        raw: true,
        where: { 
            id: clientId,
            type: 'client'
        },
        include: [
            {
                model: Contract,
                as: 'Client',
                attributes: [],
                where: {
                    clientId
                },
                required: true,
                include: [
                    {
                        model: Job,
                        attributes: [
                            [sequelize.fn('SUM', sequelize.col('price')), 'total']
                        ],
                        where: { 
                            paid: {[Op.not]: true }
                        },
                        required: true
                    }
                ]
            }
        ]
    })
    if(!client) return { status: 404, data: '' }
    if(client.length === 0) return { status: 401, data: 'You do not own jobs that are waiting for payment' }
    const total = client['Client.Jobs.total'] * 0.25;
    if (money > total) return { status: 401, data: 'You can not deposit more than 25% of your total jobs to pay' }
    
    try {
        await Profile.update({ balance: client.balance + money }, { where: { id: clientId }})
    } catch (error) {
        console.log(error)
        return { status: 400, data: 'Something went wrong, please try again' }
    }

    return { status: 200, data: 'Thank you for your deposit' }
    } catch (e) {
        return { status: 404, data: ''}
    }
}

module.exports = {
    deposit
}
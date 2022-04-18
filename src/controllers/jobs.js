const {sequelize} = require('../model')
const Op = sequelize.Sequelize.Op;

async function unpaid(req) {
    try {
        const profileId = req.profile.dataValues.id
        const {Contract, Job} = req.app.get('models')
        const unpaidJobs = await Job.findAll({
            attributes: [
            '*'
            ],
            raw: true,
            where: { 
                paid: {[Op.not]: true }
            },
            include: [
                {
                    model: Contract,
                    attributes: [],
                    where: {
                        [Op.or]: [
                            {
                                contractorId: profileId
                            }, {
                                clientId: profileId
                            },
                        ],
                        status: 'in_progress'
                    },   
                    required: true
                }
            ]
        })
        if(!unpaidJobs) return { status: 404, data: '' }
        return { status: 200, data: unpaidJobs }
    } catch (e) {
        return { status: 404, data: '' }
    }
}

async function pay(req, res) {
    try {
        const profileId = req.profile.dataValues.id
        const {Contract, Job, Profile} = req.app.get('models')
        const jobId = req.params.job_id
        const client = await Profile.findOne({
            attributes: [
                'id',
            'balance'
            ],
            where: { 
                id: profileId,
                type: 'client'
            },
            include: [
                {
                    model: Contract,
                    as: 'Client',
                    attributes: [
                        'ContractorId'
                    ],
                    required: true,
                    include: [
                        {
                            model: Job,
                            attributes: [
                                'id',
                                'price',
                                'paid'
                            ],
                            where: {
                                id: jobId
                            },
                            required: true
                        }
                    ]
                }
            ]
        })
        if(!client) return { status: 404, data: '' }
        if(client.length === 0) return { status: 404, data: 'You do not own this job' }
        const balance = client.balance
        const price = client.Client[0].Jobs[0].price
        if (client.Client[0].Jobs[0].paid) return { status: 404, data: 'This job is already payed' }
        if (balance < price) return { status: 404, data: 'You do not have enogh balance to pay this job' }
        
        const contractor = await Profile.findOne({
            where: { 
                id: client.Client[0].ContractorId
            }
        })
        const job = await Job.findOne({
            where: { 
                id: client.Client[0].Jobs[0].id
            }
        })

        try {
            await sequelize.transaction(async (t) => {
                await client.update({
                    balance: client.balance - price
                }, { transaction: t });
                await contractor.update({
                    balance: contractor.balance + price
                }, { transaction: t });
                await job.update({
                    paid: true
                }, { transaction: t });
                return;
            });
        } catch (error) {
            console.log(error)
            return { status: 400, data: 'Something went wrong, please try again' }
        }
        return { status: 200, data: 'Thank you for your payment' }
    } catch (e) {
        return { status: 400, data: 'Something went wrong, please try again' }
    }
}

module.exports = {
    unpaid,
    pay
}
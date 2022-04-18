const router = require("express").Router();
const {getProfile} = require('../middleware/getProfile')
const jobsFunctions = require('../controllers/jobs')

/**
 * @returns list of all unpaid jobs for a user (***either*** a client or contractor), for ***active contracts only***.
 */
 router.get('/unpaid', getProfile, async (req, res) =>{
    const result = await jobsFunctions.unpaid(req)
    res.status(result.status).json(result.data).end()
})

/**
 * Pay for a job, a client can only pay if his balance >= the amount to pay. The amount should be moved from the client's balance to the contractor balance.
 * @returns message
 */
 router.post('/:job_id/pay', getProfile, async (req, res) =>{
    const result = await jobsFunctions.pay(req)
    res.status(result.status).json(result.data).end()
})


module.exports = router;
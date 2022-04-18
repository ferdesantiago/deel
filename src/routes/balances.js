const router = require("express").Router();
const {getProfile} = require('../middleware/getProfile')
const depositFunctions = require('../controllers/balances')

/**
 * Deposits money into the the the balance of a client, a client can't deposit more than 25% his total of jobs to pay. (at the deposit moment)
 * @returns message
 */
 router.post('/deposit/:userId', getProfile, async (req, res) =>{
    const result = await depositFunctions.deposit(req)
    res.status(result.status).json(result.data).end()
})

module.exports = router;
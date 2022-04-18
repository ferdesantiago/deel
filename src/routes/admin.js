const router = require("express").Router();
const {getProfile} = require('../middleware/getProfile')
const adminFunctions = require('../controllers/admin')

/**
 * @returns the profession that earned the most money (sum of jobs paid) for any contactor that worked in the query time range.
 */
 router.get('/best-profession', getProfile, async (req, res) =>{
    const result = await adminFunctions.bestProfession(req)
    res.status(result.status).json(result.data).end()
})

/**
 * @returns the clients the paid the most for jobs in the query time period. limit query parameter should be applied, default limit is 2.
 */
 router.get('/best-clients', getProfile, async (req, res) =>{
    const result = await adminFunctions.bestClients(req)
    res.status(result.status).json(result.data).end()
})

module.exports = router;
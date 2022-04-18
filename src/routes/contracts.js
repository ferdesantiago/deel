const router = require("express").Router();
const {getProfile} = require('../middleware/getProfile')
const contractsFunctions = require('../controllers/contracts')

/**
 * @returns contract by id. It should return the contract only if it belongs to the profile calling
 */
 router.get('/:id', getProfile, async (req, res) =>{
    const result = await contractsFunctions.contractById(req)
    res.status(result.status).json(result.data).end()
})

/**
 * @returns list of contracts belonging to a user (client or contractor), the list should only contain non terminated contracts
 */
 router.get('', getProfile, async (req, res) =>{
    const result = await contractsFunctions.contracts(req)
    res.status(result.status).json(result.data).end()
})


module.exports = router;
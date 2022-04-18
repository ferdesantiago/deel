const contracts = require('../src/controllers/contracts'); 

test('Test case 1', async () => {
    const req = { 
        profile: { 
            dataValues: {
                id: 6
            } 
        },
        params: {
            id: 2
        }
    }
    const result = await contracts.contractById(req);
    // console.log(result);
    const match = {
        status: 200,
        data: {
            "id": 2,
            "terms": "bla bla bla",
            "status": "in_progress",
            "createdAt": "2022-04-17T14:53:38.773Z",
            "updatedAt": "2022-04-17T14:53:38.773Z",
            "ContractorId": 6,
            "ClientId": 1
        }
    }
    expect(JSON.stringify(result)).toMatch(JSON.stringify(match));
});
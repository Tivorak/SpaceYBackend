const truffleAssert = require('truffle-assertions');

const SpaceY = artifacts.require("SpaceY");

contract("SpaceY", accounts => {

    let owner = accounts[0];
    let instance;
    let universumSize = 1000;
    let startCosts = 100000;

    beforeEach(async function () {
        instance = await SpaceY.new(universumSize, startCosts, { from: owner });
    })

    it("should be able to buy initial planet when address did not buy it yet", async () => {
        assert.equal((await instance.getPlanet(universumSize, { from: accounts[1] })).conquerBlockNumber.toNumber(), 0);
        let result = await instance.buyInitialPlanet({ from: accounts[1], value: startCosts });
        let startPlanet = await instance.getPlanet(universumSize, { from: accounts[1] });
        assert.equal(startPlanet.owner, accounts[1]);
        assert.equal(startPlanet.conquerBlockNumber.toNumber(), result.receipt.blockNumber);
    });

    it("should not be able to buy initial planet when address did already buy before", async () => {
        await instance.buyInitialPlanet({ from: accounts[1], value: startCosts });
        await truffleAssert.fails(instance.buyInitialPlanet({ from: accounts[1], value: startCosts }), truffleAssert.ErrorType.REVERT);
    });

    it("should not be able to buy initial planet when sending to less gwei", async () => {
        await truffleAssert.fails(instance.buyInitialPlanet({ from: accounts[1], value: startCosts - 10 }), truffleAssert.ErrorType.REVERT);
    });

});
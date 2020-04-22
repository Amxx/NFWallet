var NFWallet        = artifacts.require('NFWallet');
var NFWalletFactory = artifacts.require('NFWalletFactory');

const { expectEvent, expectRevert } = require('@openzeppelin/test-helpers');

function extractEvents(txMined, address, name)
{
	return txMined.logs.filter((ev) => { return ev.address == address && ev.event == name });
}
function toAddress(value)
{
	return web3.utils.toChecksumAddress(web3.utils.padLeft(web3.utils.toHex(value), 40));
}

contract('NFWalletFactory', async (accounts) => {

	let NFWalletInstance = {};
	/***************************************************************************
	 *                        Environment configuration                        *
	 ***************************************************************************/
	before('configure', async () => {
		console.log('# web3 version:', web3.version);

		/**
		 * Retreive deployed contracts
		 */
		NFWalletFactoryInstance = await NFWalletFactory.deployed();
	});

	describe("Wallets", async () => {
		Array(8)
		.fill()
		.map(_ => web3.utils.randomHex(32))
		.map((salt, i) => {

			describe(`wallet #${i}`, async () => {
				it("creation", async () => {
					txMined = await NFWalletFactoryInstance.createWallet(accounts[0], salt);

					events = extractEvents(txMined, NFWalletFactoryInstance.address, "Transfer");
					assert.equal(events[0].args.from, "0x0000000000000000000000000000000000000000");
					assert.equal(events[0].args.to,   accounts[0]);

					NFWalletInstance[i] = await NFWallet.at(toAddress(events[0].args.tokenId));
				});

				it("content", async () => {
					assert.equal (await NFWalletInstance[i].registry(), NFWalletFactoryInstance.address);
					assert.equal (await NFWalletInstance[i].owner(),    accounts[0]                    );
				});

				it("token details", async () => {
					assert.equal(          await NFWalletFactoryInstance.ownerOf(NFWalletInstance[i].address), accounts[0]                );
					assert.equal(          await NFWalletFactoryInstance.balanceOf(accounts[0]),               i+1                        );
					assert.equal(toAddress(await NFWalletFactoryInstance.tokenOfOwnerByIndex(accounts[0], i)), NFWalletInstance[i].address);
				});

				it("duplicate protection", async () => {
					await expectRevert.unspecified(
						NFWalletFactoryInstance.createWallet(accounts[0], salt)
					);
				});
			});
		});
	});


});

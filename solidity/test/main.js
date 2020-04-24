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

	describe("Wallets creation", async () => {
		Array(8)
		.fill()
		.map(_ => web3.utils.randomHex(32))
		.map((salt, i) => {
			describe(`wallet #${i}`, async () => {
				it("creation", async () => {
					const txMined = await NFWalletFactoryInstance.createWallet(accounts[0], salt);

					events = extractEvents(txMined, NFWalletFactoryInstance.address, "Transfer");
					assert.equal(events[0].args.from, "0x0000000000000000000000000000000000000000");
					assert.equal(events[0].args.to,   accounts[0]);

					NFWalletInstance[i] = await NFWallet.at(toAddress(events[0].args.tokenId));
				});

				it("content", async () => {
					assert.equal(await NFWalletInstance[i].registry(), NFWalletFactoryInstance.address);
					assert.equal(await NFWalletInstance[i].owner(),    accounts[0]                    );
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

	describe("Wallets interaction", async () => {
		Array(8)
		.fill()
		.map(_ => web3.utils.randomHex(32))
		.map((salt, i) => {
			describe(`wallet #${i}`, async () => {
				it("predict", async () => {
					predicted = await NFWalletFactoryInstance.predictWallet(accounts[0], salt);
				});

				it("check balance", async () => {
					assert.equal(await web3.eth.getBalance(predicted), 0);
				});

				it("fillup (pre-deployment)", async () => {
					const txMined = await web3.eth.sendTransaction({ from: accounts[0], to: predicted, value: web3.utils.toWei('0.01', 'ether') });
					assert.equal(txMined.logs.filter(({ address }) => address == predicted).length, 0);
				});

				it("check balance", async () => {
					assert.equal(await web3.eth.getBalance(predicted), web3.utils.toWei('0.01', 'ether'));
				});

				it("creation", async () => {
					const txMined = await NFWalletFactoryInstance.createWallet(accounts[0], salt, { value: web3.utils.toWei('0.01', 'ether') });

					events = extractEvents(txMined, NFWalletFactoryInstance.address, "Transfer");
					assert.equal(          events[0].args.from,     "0x0000000000000000000000000000000000000000");
					assert.equal(          events[0].args.to,       accounts[0]                                 );
					assert.equal(toAddress(events[0].args.tokenId), predicted                                   );

					NFWalletInstance[i] = await NFWallet.at(toAddress(events[0].args.tokenId));
				});

				it("check balance", async () => {
					assert.equal(await web3.eth.getBalance(predicted), web3.utils.toWei('0.02', 'ether'));
				});

				it("fillup (post-deployment)", async () => {
					const txMined = await web3.eth.sendTransaction({ from: accounts[0], to: predicted, value: web3.utils.toWei('0.01', 'ether') });
					assert.equal(txMined.logs.filter(({ address }) => address == predicted).length, 1);
				});

				it("check balance", async () => {
					assert.equal(await web3.eth.getBalance(predicted), web3.utils.toWei('0.03', 'ether'));
				});

				it("transfer value", async () => {
					const txMined = await NFWalletInstance[i].forward(accounts[0], web3.utils.toWei('0.03', 'ether'), "0x");
				});

				it("check balance", async () => {
					assert.equal(await web3.eth.getBalance(predicted), 0);
				});
			});
		});
	});


});

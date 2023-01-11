//plugins for testing-chai and ethers.js library
const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Token contract', () => {
  let tokenFactory, token, owner, addr1, addr2;
//tokenFactory used to deploy new sc
  
  beforeEach(async () => {
    tokenFactory = await ethers.getContractFactory('Token');
    token = await tokenFactory.deploy();
    [owner, addr1, addr2, _] = await ethers.getSigners();
  });
// a) first test, token.owner() == owner.address
//b)   total supply of tokens are assigned to the owner.
  describe('Deployment', () => {
    it('Should set the right owner', async() => {
      expect(await token.owner()).to.equal(owner.address);
    });
  
    it('Should assign the total supply of tokens to the owner', async() => {
      const ownerBal = await token.balanceOf(owner.address);
      expect(await token.totalSupply()).to.equal(ownerBal);
    })
  })
  
 /* a) transferring 50 tokens from the owner to addr1.
    b) check that the balance equals to 50.*/
  
  describe('Transactions', () => {
    it('Should transfer between accounts', async() => {
      await token.transfer(addr1.address, 50);
      const initialAddr1Bal = await token.balanceOf(addr1.address);
      expect(initialAddr1Bal).to.equal(50);
/*   a)  transferring 20 tokens from the addr1 to addr2.
     b) checking the final balance of addr1=initial amount-20.*/
      await token.connect(addr1).transfer(addr2.address, 20);
      const addr2Bal = await token.balanceOf(addr2.address);
      expect(addr2Bal).to.equal(20);
       
      const finalAddr1Bal = await token.balanceOf(addr1.address);
      expect(finalAddr1Bal).to.equal(initialAddr1Bal - 20);
    })
    //error handling
    it('Should fail if sender doesnt have enough tokens', async() => {
        const initialOwnerBal = await token.balanceOf(owner.address);
  
        await expect(token.connect(addr1).transfer(addr2.address, 10)).to.be.revertedWith('not enough tokens');
        expect(await token.balanceOf(owner.address)).to.equal(initialOwnerBal);
      })
  })
})

const Token = artifacts.require("./PACKER");

module.exports = function(deployer){
    deployer.deploy(Token)
}
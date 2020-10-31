pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;
import "/openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";
import "/openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract PACKER is ERC721Full, Ownable {
    constructor() public ERC721Full("PACKER", "RPX") {}

    mapping(string => string[]) public orders;

    function mint(string memory _orderID, string[] memory _usrOrders) public onlyOwner {
        require(orders[_orderID].length==0);
        orders[_orderID] =_usrOrders;
        _mint(msg.sender, totalSupply().add(1));
    }

    function getOrder(string memory ID) public returns (string[] memory res){
        return orders[ID];
    }
}

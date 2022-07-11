// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";


contract ICOPlatform {
    IERC20 private paymentToken;
    uint private weiUSDTRaised;
    uint private commision;

    IUniswapV2Router02 public uniswapRouter;
    address internal constant UNISWAP_ROUTER_ADDRESS = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    address private constant USDT = 0x5CD4d8B19D72E2B4eB5cDA1a7740Feb36AD244Ff;
    address private constant ICO = 0xdFB27E296F5B82f06C1b2B3b4Ec94E76b0e85D6D;
    event Log(uint number, string message);

    struct ICOEntry {
        address owner;
        uint rate;
        uint closingTime;
    }

    mapping(address => ICOEntry) icoEntries;
    mapping(address => uint) balances;
    address[] public listedTokens;

    constructor(){
        paymentToken = IERC20(USDT);
        commision = 10;
        uniswapRouter = IUniswapV2Router02(UNISWAP_ROUTER_ADDRESS);
    }

    function listTokenForICO(address _token, address _owner, uint _rate, uint _closingTime) public {
        require(block.timestamp < _closingTime, "Sale closing date must be in the future!");
        require(icoEntries[_token].rate == 0, "This token is already listed!");
        require(_rate > 0, "rate must be greater than 0!");
        icoEntries[_token] = ICOEntry(_owner, _rate, _closingTime);
        listedTokens.push(_token);
    }

    function buyTokens(uint _usdtAmount, address _token) public {
        require(icoEntries[_token].owner != address(0), "Sale with provided address does not exist.");
        ICOEntry memory icoEntry = icoEntries[_token];
        require(!hasClosed(_token), "Token sale is closed now.");
        require(msg.sender != address(0), "Beneficiary can't be a zero address!");
        require(_usdtAmount > 0, "You have to buy more than 0 tokens!");

        uint allowance = paymentToken.allowance(msg.sender, address(this));
        require(allowance >= _usdtAmount, "Check the token allowance.");

        uint feeUsdtTokensAmount = _usdtAmount / 10;
        uint paymentTokenAmount = _usdtAmount - feeUsdtTokensAmount;
        uint tokenAmount = paymentTokenAmount * icoEntry.rate;

        uint tokenBalance = IERC20(_token).allowance(icoEntry.owner, address(this));
        require(tokenBalance >= tokenAmount, "Not enough tokens left.");

        weiUSDTRaised += _usdtAmount;

        balances[msg.sender] = balances[msg.sender] + tokenAmount;

        require(paymentToken.transferFrom(msg.sender, address(this), feeUsdtTokensAmount), "Fee transfer failed.");
        require(paymentToken.transferFrom(msg.sender, icoEntry.owner, paymentTokenAmount), "Payment transfer failed.");

        require(paymentToken.approve(UNISWAP_ROUTER_ADDRESS, feeUsdtTokensAmount), "Uniswap approve failed.");

        uint deadline = block.timestamp + 15;
        uint[] memory amounts = uniswapRouter.swapExactTokensForTokens(feeUsdtTokensAmount, 1, getPathForUsdtToIco(), address(this), deadline);

        ERC20Burnable(ICO).burn(amounts[1]);

    }

    function withdrawTokens(address _token) public {
        require(hasClosed(_token), "ICO sale not closed yet!");
        uint amount = balances[msg.sender];
        require(amount > 0, "You have not bought any tokens!");
        balances[msg.sender] = 0;
        IERC20(_token).transferFrom(icoEntries[_token].owner, msg.sender, amount);
    }

    function getPathForUsdtToIco() private view returns (address[] memory) {
        address[] memory path = new address[](2);
        path[0] = USDT;
        path[1] = ICO;
        return path;
    }

    function hasClosed(address _token) public view returns (bool){
        require(icoEntries[_token].closingTime != 0, "Token sale does not exists.");
        return block.timestamp > icoEntries[_token].closingTime;
    }

    function getClosingTime(address _token) public view returns (uint) {
        require(icoEntries[_token].closingTime != 0, "Token sale does not exists.");
        return icoEntries[_token].closingTime;
    }

    function getListedTokens() public view returns (address[] memory) {
        return listedTokens;
    }

    function getListedTokenDetails(address _token) public view returns (ICOEntry memory) {
        return icoEntries[_token];
    }
}
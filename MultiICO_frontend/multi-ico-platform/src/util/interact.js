require("dotenv").config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const contractAddress = "0xBF297F9F3263323CbfFC3853B36866e3E575c4a5";
const usdtContractAddress = "0x5CD4d8B19D72E2B4eB5cDA1a7740Feb36AD244Ff";
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contract = require('./../contracts/ICOPlatform.sol/ICOPlatform.json');
const usdtContract = require('./../contracts/USDT.sol/USDT.json');
const aTokenContract = require('./../contracts/AToken.sol/AToken.json');

const contractABI = contract.abi;
const usdtContractABI = usdtContract.abi;
const aTokenContractABI = aTokenContract.abi;
const erc20ABI = require('./ERC20abi.json').abi;

export const Severity = {
  error: "error",
  warning: "warning",
  info: "info",
  success: "success"

}
// const contractAddress = process.env.CONTRACT_ADDRESS;

export const isAddress = (address) => {
  return web3.utils.isAddress(address);
}

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const obj = {
        status: "👆🏽 Explore the application using the panel above.",
        address: addressArray[0],
        severity: Severity.info
      };
      return obj;
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
        severity: Severity.error
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
      severity: Severity.info
    };
  }
};

export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: "👆🏽 Explore the application using the panel above.",
          severity: Severity.info
        };
      } else {
        return {
          address: "",
          status: "🦊 Connect to Metamask using the top right button.",
          severity: Severity.info
        };
      }
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
        severity: Severity.error
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
      severity: Severity.info
    };
  }
};

async function loadContract() {
  return new web3.eth.Contract(contractABI, contractAddress);
}

export const uniswapRouter = async () => {
  const contract = new web3.eth.Contract(contractABI, contractAddress);
  const router = await contract.methods.uniswapRouter().call();
  return router;
}

export const approveUsdt = async () => {
  window.contract = await new web3.eth.Contract(erc20ABI, usdtContractAddress);

  const transactionParameters = {
    to: usdtContractAddress,
    from: window.ethereum.selectedAddress,
    'data': window.contract.methods.approve(contractAddress, "10000000000000000000000000").encodeABI()
  };

  try {
    const txHash = await window.ethereum
      .request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });
    return {
      success: true,
      status: "USDT approval transaction sent.",
      severity: Severity.info
    }
  } catch (error) {
    return {
      success: false,
      status: "😥 Something went wrong: " + error.message,
      severity: Severity.error
    }
  }
}

export const approveListedToken = async (tokenAddress) => {
  window.contract = await new web3.eth.Contract(erc20ABI, tokenAddress);

  const transactionParameters = {
    to: tokenAddress,
    from: window.ethereum.selectedAddress,
    'data': window.contract.methods.approve(contractAddress, "10000000000000000000000000").encodeABI()
  };

  try {
    const txHash = await window.ethereum
      .request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });
    return {
      success: true,
      status: "Approval transaction submitted successfully. " + txHash,
      severity: Severity.info
    }
  } catch (error) {
    return {
      success: false,
      status: "😥 Something went wrong: " + error.message,
      severity: Severity.error
    }
  }
}


export const listTokenForICO = async (tokenAddress, ownerAddress, rate, closingTime) => {
  window.contract = await new web3.eth.Contract(contractABI, contractAddress);

  const transactionParameters = {
    to: contractAddress,
    from: window.ethereum.selectedAddress,
    'data': window.contract.methods.listTokenForICO(tokenAddress, ownerAddress, rate, closingTime).encodeABI()
  };

  try {
    const txHash = await window.ethereum
      .request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });
    return {
      success: true,
      status: "Listing transaction submitted successfully.",
      severity: Severity.info
    }
  } catch (error) {
    return {
      success: false,
      status: "😥 Something went wrong: " + error.message,
      severity: Severity.error
    }
  }
}

export const withdrawTokens = async (tokenAddress) => {
  window.contract = await new web3.eth.Contract(contractABI, contractAddress);

  const transactionParameters = {
    to: contractAddress,
    from: window.ethereum.selectedAddress,
    'data': window.contract.methods.withdrawTokens(tokenAddress).encodeABI()
  };

  try {
    const txHash = await window.ethereum
      .request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });
    return {
      success: true,
      status: "Withdrawal transaction submitted successfully!",
      severity: Severity.info
    }
  } catch (error) {
    return {
      success: false,
      status: "😥 Something went wrong: " + error.message,
      severity: Severity.error
    }
  }
}

export const buyTokens = async (usdtAmount, tokenAddress) => {
  window.contract = await new web3.eth.Contract(contractABI, contractAddress);

  const transactionParameters = {
    to: contractAddress,
    from: window.ethereum.selectedAddress,
    'data': window.contract.methods.buyTokens(usdtAmount, tokenAddress).encodeABI()
  };

  try {
    const txHash = await window.ethereum
      .request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });
    return {
      success: true,
      status: "Transaction submitted successfully! " + txHash,
      severity: Severity.info
    }
  } catch (error) {
    return {
      success: false,
      status: "😥 Something went wrong: " + error.message,
      severity: Severity.error
    }
  }
}

export const getListedTokens = async () => {
  const contract = new web3.eth.Contract(contractABI, contractAddress);
  const listedTokens = await contract.methods.getListedTokens().call();
  return listedTokens;
}

export const getListedTokenDetails = async (tokenAddress) => {
  const contract = new web3.eth.Contract(contractABI, contractAddress);
  const icoEntry = await contract.methods.getListedTokenDetails(tokenAddress).call();
  return icoEntry;
}

export const getClosingTime = async (tokenAddress) => {
  const contract = new web3.eth.Contract(contractABI, contractAddress);
  const closingTime = await contract.methods.getClosingTime(tokenAddress).call();
  return closingTime;
}

export const hasClosed = async (tokenAddress) => {
  const contract = new web3.eth.Contract(contractABI, contractAddress);
  const hasClosed = await contract.methods.hasClosed(tokenAddress).call();
  return hasClosed;
}

export const getTokenName = async (tokenAddress) => {
  const contract = new web3.eth.Contract(erc20ABI, tokenAddress);
  const name = await contract.methods.name().call();
  return name;
}


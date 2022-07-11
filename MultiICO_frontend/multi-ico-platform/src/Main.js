import { useEffect, useState } from "react";
import * as React from 'react';
import {
  connectWallet,
  getCurrentWalletConnected,
  uniswapRouter,
  Severity
} from "./util/interact.js";

import ListingPage from "./ListingPage.js";
import BuyPage from "./BuyPage.js";
import WithdrawPage from "./WithdrawPage.js";


import {
  Container,
  Grid,
  makeStyles,
  Paper,
  Button,
  Box
} from "@material-ui/core";

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Alert from '@mui/material/Alert';

import styles from "./styles.js";


const useStyles = makeStyles(styles);


const Main = (props) => {
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = React.useState('buy');
  const [alertSeverity, setAlertSeverity] = useState(Severity.info);
  const elevation = 10;





  useEffect(async () => {
    const { address, status, severity } = await getCurrentWalletConnected();

    setWallet(address);
    setStatus(status);
    setAlertSeverity(severity);

    if (address) {
      const router = await uniswapRouter();
      console.log("uniswapRouter: ", router);
    }

    addWalletListener();
  }, []);

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽 Write a message in the text-field above.");
          setAlertSeverity(Severity.info)
        } else {
          setAlertSeverity(Severity.info);
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
      setAlertSeverity(Severity.info);
    }
  }

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
    setAlertSeverity(walletResponse.severity);
  };


  const handlePageChange = (event, newPage) => {
    if (newPage !== null) {
      setStatus("");
      setAlertSeverity("");
      setPage(newPage);
    }
  };

  function renderSwitch(param) {
    switch (param) {
      case 'list':
        return <ListingPage elevation={elevation} parentStatusChanger={setStatus} parentAlertSeverityChanger={setAlertSeverity} wallet={walletAddress}></ListingPage>;
      case 'buy':
        return <BuyPage elevation={elevation} parentStatusChanger={setStatus} parentAlertSeverityChanger={setAlertSeverity} wallet={walletAddress}></BuyPage>;
      case 'withdraw':
        return <WithdrawPage elevation={elevation} parentStatusChanger={setStatus} parentAlertSeverityChanger={setAlertSeverity} wallet={walletAddress}></WithdrawPage>;
    }
  }

  return (
    <div className="Main">
      <br></br>
      <Container maxWidth="xl">

        <Grid container spacing={2}>
          <Grid item xs lg>
            🧙‍♂️ Multi ICO Platform
          </Grid>
          <Grid item xs={8} lg={8}>
            <Box display="flex" justifyContent="center">
              <ToggleButtonGroup

                color="primary"
                value={page}
                exclusive
                onChange={handlePageChange}
              >
                <ToggleButton style={{ minWidth: '110px' }} value="list">List</ToggleButton>
                <ToggleButton style={{ minWidth: '110px' }} value="buy">Buy</ToggleButton>
                <ToggleButton style={{ minWidth: '110px' }} value="withdraw">Withdraw</ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Grid>
          <Grid item xs lg>
            <Box textAlign='center'>
              <Button id="walletButton" variant='outlined' onClick={connectWalletPressed}>
                {walletAddress.length > 0 ? (
                  "Connected: " +
                  String(walletAddress).substring(0, 6) +
                  "..." +
                  String(walletAddress).substring(38)
                ) : (
                  <span>Connect Wallet</span>
                )}
              </Button>
            </Box>
          </Grid>
        </Grid>

      </Container>
      <br></br>
      {renderSwitch(page)}
      <br></br>
      {status === "" ?
        <></> : <Container maxWidth="xs">
          <Alert severity={alertSeverity === "" ? Severity.info : alertSeverity}>{status}</Alert>
        </Container>}

    </div>
  );
};

export default Main;

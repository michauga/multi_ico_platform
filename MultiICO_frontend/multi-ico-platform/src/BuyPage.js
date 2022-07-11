import {
    Container,
    Grid,
    makeStyles,
    Paper,
    Typography,
    Fab,
    Button,
    Box,
    TextField
} from "@material-ui/core";

import {
    getListedTokens,
    buyTokens,
    approveUsdt,
    getListedTokenDetails,
    getTokenName,
    Severity
} from "./util/interact.js";

import { useEffect, useState } from "react";

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import LinearProgress from '@mui/material/LinearProgress';

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import styles from "./styles.js";
const useStyles = makeStyles(styles)

const BuyPage = (props) => {
    const classes = useStyles();

    const [usdtAmount, setUsdtAmount] = useState(1);
    const [tokensList, setTokensList] = useState([]);
    const [isFetching, setIsFetching] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState();

    const [status, setStatus] = useState("");

    useEffect(async () => {
        const listedTokens = await getListedTokens();
        const tmpTokensList = [];
        for (const address of listedTokens) {
            const tmpTokenDetails = await getListedTokenDetails(address);
            const tmpTokenName = await getTokenName(address);
            tmpTokensList.push({
                "name": tmpTokenName,
                "tokenAddress": address,
                "ownerAddress": tmpTokenDetails.owner,
                "closingTime": tmpTokenDetails.closingTime,
                "rate": tmpTokenDetails.rate
            })
        }
        setTokensList(tmpTokensList);
        setIsFetching(false);

    }, []);

    const approvePaymentToken = async () => {
        const { status, severity } = await approveUsdt();
        props.parentStatusChanger(status);
        props.parentAlertSeverityChanger(severity);
    }


    const onBuyPressed = async () => {
        if (typeof tokensList[selectedIndex] == 'undefined') {
            props.parentStatusChanger("Please select a token first!");
            props.parentAlertSeverityChanger(Severity.info);
            return
        }
        const { success, status, severity } = await buyTokens(usdtAmount, tokensList[selectedIndex].tokenAddress);
        props.parentStatusChanger(status);
        props.parentAlertSeverityChanger(severity)
        if (success) {
            setUsdtAmount(1);
            setSelectedIndex();
        }
    }

    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
    };

    return (
        <div>
            <Container maxWidth="xs">
                <Paper elevation={props.elevation} className={classes.paperContainer}>
                    <Typography variant="h5" className={classes.title}>
                        Buy Token
                    </Typography>
                    <Grid container direction="column" alignItems="center" spacing={2}>
                        <Grid item xs={12} className={classes.fullWidth}>

                            <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                                <List component="nav" aria-label="main mailbox folders">
                                    {!isFetching ? tokensList.map((token, idx) =>
                                        <ListItemButton key={idx}
                                            selected={selectedIndex === idx}
                                            onClick={(event) => handleListItemClick(event, idx)}
                                        >
                                            <ListItemIcon>
                                                <CurrencyBitcoinIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={token.name} secondary={String(token.tokenAddress).substring(0, 9) + "..." + String(token.tokenAddress).substring(35)} />
                                        </ListItemButton>
                                    ) : <LinearProgress color="inherit" />}

                                </List>
                                <Divider />
                            </Box>

                            <br></br>

                            <Grid
                                container
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                className={classes.grid}
                            >

                                <Grid item xs={5}>
                                    <Fab
                                        size="small"
                                        variant="extended"
                                        // todo: to implement more payment options in the future
                                        // onClick={onClick}
                                        className={classes.fab}
                                    >
                                        USDT (in WEI)
                                        <ExpandMoreIcon />
                                    </Fab>
                                </Grid>

                                <Grid item xs={7}>
                                    <TextField
                                        type="number"
                                        value={usdtAmount}
                                        onChange={(event) => setUsdtAmount(parseInt(event.target.value))}
                                        placeholder="0"
                                        classes={{
                                            root: classes.container_input,
                                            input: classes.inputBase,
                                        }}
                                        InputProps={{
                                            inputProps: {
                                                min: 1
                                            }
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <br></br>
                            <Grid container spacing={2}>
                                <Grid item xs={6} md={6}>
                                    <Box textAlign='center'>
                                        <Button onClick={approvePaymentToken} variant='outlined' disabled={props.wallet === ""}>
                                            Approve USDT
                                        </Button>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <Box textAlign='center'>
                                        <Button onClick={onBuyPressed} variant='contained' disabled={props.wallet === ""}>
                                            Buy
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>

                        </Grid>
                    </Grid>
                    <p id="status" style={{ color: "red" }}>
                        {status}
                    </p>
                </Paper>
            </Container>
        </div>
    );
}

export default BuyPage;
import {
    Container,
    Grid,
    makeStyles,
    Paper,
    Typography,
    Button,
    Box
} from "@material-ui/core";

import {
    getListedTokens,
    hasClosed,
    withdrawTokens,
    getListedTokenDetails,
    getTokenName
} from "./util/interact.js";

import { useEffect, useState } from "react";

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import LinearProgress from '@mui/material/LinearProgress';

import styles from "./styles.js";
const useStyles = makeStyles(styles)

const WithdrawPage = (props) => {
    const classes = useStyles();

    const [status, setStatus] = useState("");
    const [tokensList, setTokensList] = useState([]);
    const [isFetching, setIsFetching] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState();

    useEffect(async () => {
        const listedTokens = await getListedTokens();
        const tmpTokensList = [];
        for (const address of listedTokens) {
            const tmpTokenDetails = await getListedTokenDetails(address);
            const tmpTokenName = await getTokenName(address);
            const tmpHasClosed = await hasClosed(address);
            tmpTokensList.push({
                "name": tmpTokenName,
                "tokenAddress": address,
                "ownerAddress": tmpTokenDetails.owner,
                "closingTime": tmpTokenDetails.closingTime,
                "rate": tmpTokenDetails.rate,
                "hasClosed": tmpHasClosed
            })
        }
        setTokensList(tmpTokensList);
        setIsFetching(false);

    }, []);

    const onWithdrawPressed = async () => {
        const { success, status, severity } = await withdrawTokens(tokensList[selectedIndex].tokenAddress);
        props.parentStatusChanger(status);
        props.parentAlertSeverityChanger(severity)
    }

    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
    };

    return (
        <div>
            <Container maxWidth="xs">
                <Paper elevation={props.elevation} className={classes.paperContainer}>
                    <Typography variant="h5" className={classes.title}>
                        Withdraw Tokens
                    </Typography>
                    <Grid container direction="column" spacing={2}>
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
                        </Grid>

                        <Grid item xs={12} className={classes.fullWidth}>
                            {!isFetching && selectedIndex >= 0 ? tokensList[selectedIndex].hasClosed ?
                                "Sale closed. You can withdraw your tokens!" :
                                "Sale is still opened. Ending time: " + String(new Date(tokensList[selectedIndex].closingTime * 1000)) : <></>}
                        </Grid>

                        <br></br>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={12}>
                                <Box textAlign='center'>
                                    <Button onClick={onWithdrawPressed} variant='outlined' disabled={props.wallet === "" || isFetching || (!(selectedIndex >= 0) ? true : !(tokensList[selectedIndex].hasClosed))}>
                                        Withdraw
                                    </Button>
                                </Box>
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

export default WithdrawPage;
import {
    Container,
    Grid,
    makeStyles,
    Paper,
    Typography,
    Button,
    Box,
    TextField
} from "@material-ui/core";

import {
    listTokenForICO,
    approveListedToken,
    isAddress,
    Severity
} from "./util/interact.js";

import { useState } from "react";

import styles from "./styles.js";
const useStyles = makeStyles(styles)

const ListingPage = (props) => {
    const classes = useStyles();

    const [tokenAddress, setTokenAddress] = useState("");
    const [icoOwner, setIcoOwner] = useState("");
    const [rate, setRate] = useState(1);
    const [closingTime, setClosingTime] = useState("");

    const [status, setStatus] = useState("");

    const onListPressed = async () => {
        if (!isAddress(tokenAddress)) {
            props.parentStatusChanger("Provided token address is not valid!");
            props.parentAlertSeverityChanger(Severity.error);
            return
        }
        if (!isAddress(icoOwner)) {
            props.parentStatusChanger("Provided ico owner address is not valid!");
            props.parentAlertSeverityChanger(Severity.error);
            return
        }
        if (!Number.isInteger(rate) || rate <= 0) {
            props.parentStatusChanger("Rate is incorrect. Must be integer and > 0.");
            props.parentAlertSeverityChanger(Severity.error);
            return
        }
        if (!closingTime) {
            props.parentStatusChanger("Provided closing time is empty or incorrect!");
            props.parentAlertSeverityChanger(Severity.error);
            return
        }
        props.parentStatusChanger("");
        props.parentAlertSeverityChanger("");
        const { success, status, severity } = await listTokenForICO(tokenAddress, icoOwner, rate, toTimestamp(closingTime));
        props.parentStatusChanger(status);
        props.parentAlertSeverityChanger(severity);
        if (success) {
            setTokenAddress("");
            setIcoOwner("");
            setRate(1);
            setClosingTime(0);
        }
    }

    const approveListedTokenBySeller = async () => {
        if (!isAddress(tokenAddress)) {
            props.parentStatusChanger("Provided token address is not valid!");
            props.parentAlertSeverityChanger(Severity.error);
            return
        }
        props.parentStatusChanger("");
        props.parentAlertSeverityChanger("");
        const { status, severity } = await approveListedToken(tokenAddress);
        props.parentStatusChanger(status);
        props.parentAlertSeverityChanger(severity);

    }

    function toTimestamp(strDate) {
        var datum = Date.parse(strDate);
        return datum / 1000;
    }

    return (
        <div>
            <Container maxWidth="xs">
                <Paper elevation={props.elevation} className={classes.paperContainer}>
                    <Typography variant="h5" className={classes.title}>
                        List Token
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField onChange={(event) => setTokenAddress(event.target.value)} id="token-address" label="Token address" variant="outlined" />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField onChange={(event) => setIcoOwner(event.target.value)} id="owner-address" label="Owner address" variant="outlined" />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                id="outlined-number"
                                label="Rate"
                                type="number"
                                value={rate}
                                onChange={(event) => setRate(parseInt(event.target.value))}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    inputProps: {
                                        min: 1
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={8}>
                            <TextField
                                id="datetime-local"
                                label="Sale end date"
                                type="datetime-local"
                                onChange={(e) => setClosingTime(e.target.value)}
                                value={closingTime}
                                sx={{ width: 250 }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>

                    </Grid>

                    <br></br>

                    <Grid container spacing={2}>
                        <Grid item xs={6} md={6}>
                            <Box textAlign='center'>
                                <Button onClick={approveListedTokenBySeller} variant='outlined' disabled={props.wallet === ""}>
                                    Approve
                                </Button>
                            </Box>
                        </Grid>
                        <Grid item xs={6} md={6}>
                            <Box textAlign='center'>
                                <Button id="listButton" onClick={onListPressed} variant='contained' disabled={props.wallet === ""}>
                                    List
                                </Button>
                            </Box>
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

export default ListingPage;
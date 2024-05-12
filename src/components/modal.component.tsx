import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import {DataToken}  from '../store/datatype';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export default function CustomizedDialogs({ isDialogOpened, handleCloseDialog, tokens, message }: { isDialogOpened: boolean, handleCloseDialog: () => void, tokens : DataToken[], message?: string}) {

  const handleClickOpen = () => {
    isDialogOpened = true;
  };
  const handleClose = () => {
    isDialogOpened = false;
    handleCloseDialog();
  };

  const dialogContent = () => {
    if (message) {
      return <Typography gutterBottom> {message} </Typography>;
    }
    return (
      <React.Fragment>
        <Typography> It looks like the name of the token was not entered, we can suggest the following tokens based on our heuristics. </Typography>
        <Typography gutterBottom> Possible tokens are : </Typography>
        {tokens.map((token) => (
          <Typography gutterBottom key={token.name}>
            {token.name} ({token.symbol}): ${token.price}
          </Typography>
        ))}
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open dialog
      </Button> */}
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={isDialogOpened}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Missing Token Name
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon/>
        </IconButton>
        <DialogContent dividers>
            {dialogContent()}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}
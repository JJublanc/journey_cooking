import Container from '@mui/material/Container';
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import {IconButton} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import useAuth from "../../hooks/useAuth";
import DialogTitle from '@mui/material/DialogTitle';


export default function Popup({open, setOpen, children, title}) {
    const {user} = useAuth();
    return (<div>
        <Dialog
            open={open}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            PaperProps={{
                style: {
                    width: '30%',
                    height: '60%',
                    overflow: 'auto',
                },
            }}
        >
            <DialogTitle>{title}</DialogTitle>
            <IconButton
                edge="end"
                color="inherit"
                onClick={() => setOpen(false)}
                aria-label="close"
                style={{
                    position: 'absolute', right: 10, top: 0
                }}
            >
                <CloseIcon/>
            </IconButton>
            {children}
        </Dialog>
    </div>);
}
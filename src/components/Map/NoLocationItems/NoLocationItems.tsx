import React, { useState } from 'react';
import {
    makeStyles,
    Button,
    Badge,
    Typography,
    List,
    ListSubheader,
    ListItem,
    Divider,
    Fab,
} from '@material-ui/core';
import ReactDOM from 'react-dom';

import { LocationJobDict } from '@interfaces/index';
import { JobListItem } from '../JobListItem';
import { Popup } from '../../Popup/Popup';

type NoLocationItemsProps = {
    data: LocationJobDict;
};

const useStyles = makeStyles({
    container: {
        position: 'absolute',
        zIndex: 2,
        top: '1em',
        right: '1em',
        backgroundColor: 'white',
    },
});

export const NoLocationItems = ({ data }: NoLocationItemsProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const handleOpen = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    const styles = useStyles();

    return (
        <>
            <Fab
                variant="extended"
                className={`no-location-items ${styles.container}`}
                onClick={handleOpen}
            >
                <Badge badgeContent={Object.keys(data).length} color="primary">
                    No Location Items
                </Badge>
            </Fab>
            {isOpen && <NoLocationItemsPopup data={data} onClose={handleClose} />}
        </>
    );
};

const useStylesPopup = makeStyles({
    container: {
        height: '90vh',
    },
    content: {
        overflow: 'auto',
    },
    subheader: {
        backgroundColor: 'white',
    },
});

type PopupProps = {
    data: LocationJobDict;
    onClose: () => void;
};

const popupPosition = {
    top: '5em',
    right: '1em',
};

const NoLocationItemsPopup = ({ data, onClose }: PopupProps) => {
    const styles = useStylesPopup();

    return ReactDOM.createPortal(
        <Popup position={popupPosition} className={styles.container} onClose={onClose}>
            <Popup.Header>
                <Typography variant="h5">No location items</Typography>
            </Popup.Header>
            <Popup.Content className={styles.content}>
                <List>
                    {Object.keys(data).map((key) => (
                        <React.Fragment key={key}>
                            <ListSubheader className={styles.subheader}>{key}</ListSubheader>
                            {data[key].map((job) => (
                                <React.Fragment key={job.jobId}>
                                    <ListItem>
                                        <JobListItem job={job} onClick={() => {}} />
                                    </ListItem>
                                    <Divider />
                                </React.Fragment>
                            ))}
                        </React.Fragment>
                    ))}
                </List>
            </Popup.Content>
        </Popup>,
        document.body
    );
};

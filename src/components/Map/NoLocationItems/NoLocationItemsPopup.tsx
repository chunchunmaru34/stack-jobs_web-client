import React from 'react';
import { Divider, List, ListItem, ListSubheader, makeStyles, Typography } from '@material-ui/core';

import { LocationJobDict } from '@interfaces/index';
import { Popup } from '@components/Popup/Popup';
import { JobListItem } from '@components/JobList/JobListItem';

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

export const NoLocationItemsPopup = ({ data, onClose }: PopupProps) => {
    const styles = useStylesPopup();

    return (
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
        </Popup>
    );
};

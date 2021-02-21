import React from 'react';
import { makeStyles, Badge, Fab } from '@material-ui/core';

import { LocationJobDict } from '@interfaces/index';
import { useToggle } from '@hooks/useToggle';

import { NoLocationItemsPopup } from './NoLocationItemsPopup';

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
    const [isOpen, toggleOpen, { setOff: closePopup }] = useToggle(false);

    const styles = useStyles();

    return (
        <>
            <Fab
                variant="extended"
                className={`no-location-items ${styles.container}`}
                onClick={toggleOpen}
            >
                <Badge badgeContent={Object.keys(data).length} color="primary">
                    No Location Items
                </Badge>
            </Fab>
            {isOpen && <NoLocationItemsPopup data={data} onClose={closePopup} />}
        </>
    );
};

import { makeStyles, Button } from '@material-ui/core';
import SnackbarContent from '@material-ui/core/SnackbarContent';

import { useNotificationBar } from './NotificationBarProvider';

const useStyles = makeStyles({
    container: {
        position: 'absolute',
        bottom: '0',
        right: '0',
        zIndex: 10,
        padding: '1em',
    },
    notification: {
        marginTop: '0.5em',
    },
});

const getActionButton = (fn: () => void) => (
    <Button color="secondary" size="small" onClick={fn}>
        Remove
    </Button>
);

export const NotificationBar = () => {
    const { notifications, removeNotification } = useNotificationBar();

    const classes = useStyles();

    return (
        <div className={classes.container}>
            {notifications.map((x) => (
                <SnackbarContent
                    key={x.id}
                    className={classes.notification}
                    message={x.content}
                    action={x.isRemovable && getActionButton(() => removeNotification(x.id))}
                />
            ))}
        </div>
    );
};

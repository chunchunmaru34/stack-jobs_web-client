import React, { useCallback, useRef } from 'react';
import { LinearProgress } from '@material-ui/core';

import { useNotificationBar } from '@components/NotificationBar/NotificationBarProvider';
import { useGeocoding } from '@hooks/useGeocoding';

const NotificationContent = ({ fetched, allItems }: { fetched: number; allItems: number }) => (
    <div>
        <span>
            Fetching {fetched}/{allItems} missing locations
        </span>
        <LinearProgress
            style={{ marginTop: '0.5em' }}
            variant="determinate"
            color="secondary"
            value={(fetched / allItems) * 100}
        />
    </div>
);

export const useGeocodingWithStatus = (locations: string[]) => {
    const { addNotification, changeNotification, removeNotification } = useNotificationBar();

    // todo: solve the problem of state
    const fetchedItems = useRef(0);
    const allItems = useRef(0);
    const openedNotificationId = useRef<number | undefined>();

    const handleStart = useCallback(
        (locs: string[]) => {
            const id = addNotification({
                // content: `Fetching 0/${locs.length} missing locations`,
                content: <NotificationContent fetched={0} allItems={locs.length} />,
                timeout: Infinity,
                isRemovable: false,
            });

            openedNotificationId.current = id;
            allItems.current = locs.length;
        },
        [addNotification]
    );

    const handleNext = useCallback(() => {
        if (openedNotificationId.current) {
            fetchedItems.current = fetchedItems.current + 1;
            changeNotification(openedNotificationId.current, {
                // content: `Fetching ${fetchedItems.current}/${allItems.current} missing locations`,
                content: (
                    <NotificationContent
                        fetched={fetchedItems.current}
                        allItems={allItems.current}
                    />
                ),
            });
        }
    }, [changeNotification]);

    const handleFinish = useCallback(() => {
        const currentNotif = openedNotificationId.current;
        if (currentNotif) {
            changeNotification(currentNotif, {
                content: `Fetched all geodata`,
                isRemovable: true,
            });
            setTimeout(() => removeNotification(currentNotif), 2000);

            fetchedItems.current = 0;
            allItems.current = 0;
            openedNotificationId.current = undefined;
        }
    }, [changeNotification, removeNotification]);

    const result = useGeocoding(locations, {
        onStart: handleStart,
        onNext: handleNext,
        onFinish: handleFinish,
    });

    return result;
};

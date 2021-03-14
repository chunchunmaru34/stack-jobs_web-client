import React, { useCallback, useContext, useMemo, useRef, useState } from 'react';
import { NotificationBar } from './NotificationBar';

type Notification = {
    id: number;
    content: React.ReactNode;
    isRemovable: boolean;
};

type NotificationBarContextValue = {
    notifications: Notification[];
    addNotification: ({
        content,
        timeout,
        isRemovable,
    }: {
        content: React.ReactNode;
        timeout?: number;
        isRemovable?: boolean;
    }) => Notification['id'];
    removeNotification: (id: Notification['id']) => void;
    clearAll: () => void;
    changeNotification: (id: Notification['id'], changes: Partial<Notification>) => void;
};

export const NotificationBarContext = React.createContext<NotificationBarContextValue>({
    notifications: [],
    addNotification: () => 0,
    removeNotification: () => {},
    clearAll: () => {},
    changeNotification: () => {},
});

export const useNotificationBar = () => useContext(NotificationBarContext);

export const NotificationBarProvider = ({ children }: { children: React.ReactNode }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const timeouts = useRef(new Map<Notification['id'], NodeJS.Timeout>());
    const lastId = useRef(0);

    const removeNotification = useCallback((id: Notification['id']) => {
        setNotifications((items) => items.filter((x) => x.id !== id));

        const timeoutId = timeouts.current.get(id);
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeouts.current.delete(id);
        }
    }, []);

    const addNotification = useCallback(
        ({
            content,
            isRemovable = true,
            timeout = 5000,
        }: {
            content: React.ReactNode;
            timeout?: number;
            isRemovable?: boolean;
        }) => {
            const id = lastId.current + 1;
            lastId.current = id;
            setNotifications((items) => [...items, { content, id, isRemovable }]);

            if (Number.isFinite(timeout)) {
                const timeoutId = setTimeout(() => removeNotification(id), timeout);
                timeouts.current.set(id, timeoutId);
            }

            return id;
        },
        []
    );

    const changeNotification = useCallback(
        (id: Notification['id'], { content, isRemovable }: Partial<Notification>) => {
            setNotifications((items) =>
                items.map((x) =>
                    x.id !== id
                        ? x
                        : {
                              ...x,
                              content: content ?? x.content,
                              isRemovable: isRemovable ?? x.isRemovable,
                          }
                )
            );
        },
        []
    );

    const clearAll = useCallback(() => setNotifications([]), []);

    const contextValue = useMemo(
        () => ({
            notifications,
            addNotification,
            removeNotification,
            clearAll,
            changeNotification,
        }),
        [notifications, addNotification, removeNotification, clearAll]
    );

    return (
        <NotificationBarContext.Provider value={contextValue}>
            {children}
            <NotificationBar />
        </NotificationBarContext.Provider>
    );
};

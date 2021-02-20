import React, { useContext, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { Card, CardContent, Typography, IconButton, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import './Popup.css';

type PopupContextValue = {
    onClose: () => void;
};
const PopupContext = React.createContext<PopupContextValue>({
    onClose: () => {},
});

export const Popup = ({
    className = '',
    position,
    children,
    onClose = () => {},
}: {
    className?: string;
    position: { top?: string; right?: string; left?: string; bottom?: string };
    children: React.ReactNode;
    onClose?: () => void;
}) => {
    const contextValue = useMemo(
        () => ({
            onClose,
        }),
        []
    );

    const styles = useMemo(
        () => ({
            top: position.top,
            left: position.left,
            right: position.right,
            bottom: position.bottom,
        }),
        [position]
    );

    return ReactDOM.createPortal(
        <PopupContext.Provider value={contextValue}>
            <Card className={`popup ${className}`} style={styles}>
                <CardContent className="popup__body">{children}</CardContent>
            </Card>
        </PopupContext.Provider>,
        document.body
    );
};

const PopupHeader = ({
    className = '',
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) => {
    const { onClose } = useContext(PopupContext);

    return (
        <div className={`popup__header ${className}`}>
            {children}
            <IconButton className="close-button" onClick={onClose}>
                <CloseIcon />
            </IconButton>
        </div>
    );
};

const PopupContent = ({
    className = '',
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) => {
    return <div className={`popup__content ${className}`}>{children}</div>;
};

const PopupFooter = ({
    className = '',
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) => {
    return <div className={`popup__footer ${className}`}>{children}</div>;
};

Popup.Header = PopupHeader;
Popup.Content = PopupContent;
Popup.Footer = PopupFooter;

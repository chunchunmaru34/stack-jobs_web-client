import React from 'react';

import { NotificationBarProvider } from '@components/NotificationBar/NotificationBarProvider';
import { JobDetailsPanelContextProvider } from 'components/JobDetailsPanel/JobDetailsPanelProvider';

import { Map } from '../Map/Map';

import './App.css';

export const App = () => (
    <div>
        <NotificationBarProvider>
            <JobDetailsPanelContextProvider>
                <Map />
            </JobDetailsPanelContextProvider>
        </NotificationBarProvider>
    </div>
);

import { JobDetailsPanelContextProvider } from 'components/JobDetailsPanel/JobDetailsPanelProvider';
import React from 'react';
import { Map } from '../Map/Map';

import './App.css';

export const App = () => (
    <div>
        <JobDetailsPanelContextProvider>
            <Map />
        </JobDetailsPanelContextProvider>
    </div>
);

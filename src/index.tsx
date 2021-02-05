import ReactDOM from 'react-dom';
import React from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = process.env.MAPBOX_TOKEN ?? '';

import { App } from './App';

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.querySelector('#react-container')
);

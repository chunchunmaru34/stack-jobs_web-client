import { useEffect, useRef } from 'react';
import mapboxgl, { Marker } from 'mapbox-gl';
import { GeoJsonObject } from 'geojson';
import { groupBy, prop } from 'ramda';

import data from './locations.json';
import { useService } from './DependecyContext';
import { DbService } from './services/DbService';
import { IRecord } from '@chunchun-db/client';

type LocationMap = { [key: string]: GeoJsonObject };

type JobCard = {
    companyLocation: string;
};

export const Map = () => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const mapRef = useRef<mapboxgl.Map>();

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: containerRef.current ?? 'body',
            style: 'mapbox://styles/mapbox/streets-v11',
            // center: .state.lng, this.state.lat],
            // zoom: this.state.zoom,
        });

        mapRef.current = map;

        const dbService = DbService.getInstance();
        dbService
            .connect({
                hostName: 'http://192.168.1.30',
                port: 1488,
            })
            .then(() => dbService.getDatabase('stack_jobs'))
            .then((db) => db?.getCollection<IRecord & JobCard>('job_cards'))
            .then((collection) => collection?.getAll())
            .then((items) => {
                if (!items) {
                    return;
                }

                const grouped = groupBy(prop('companyLocation'), items);
                Object.entries(grouped)
                    .map(([location, item]) => {
                        const locationItem = (data as { [key: string]: any })[location];
                        if (!locationItem) {
                            return;
                        }
                        const { lng, lat } = locationItem.geometry;
                        return new mapboxgl.Marker().setLngLat([lng, lat]);
                    })
                    .filter(Boolean)
                    .forEach((marker) => marker?.addTo(map));
            });
    }, [containerRef.current]);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
            }}
        ></div>
    );
};

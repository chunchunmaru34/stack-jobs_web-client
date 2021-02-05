import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

export const Map = () => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: containerRef.current ?? 'body',
            style: 'mapbox://styles/mapbox/streets-v11',
            // center: .state.lng, this.state.lat],
            // zoom: this.state.zoom,
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

import React, { useEffect, useRef, useState } from 'react';

const GooglePieChart = ({ data, title }) => {
    const chartRef = useRef(null);
    const [googleLoaded, setGoogleLoaded] = useState(false);

    useEffect(() => {
        const loadGoogleCharts = () => {
            if (window.google && window.google.visualization && window.google.visualization.arrayToDataTable) {
                setGoogleLoaded(true);
            } else {
                const script = document.createElement('script');
                script.src = 'https://www.gstatic.com/charts/loader.js';
                script.onload = () => {
                    window.google.charts.load('current', { packages: ['corechart'] });
                    window.google.charts.setOnLoadCallback(() => {
                        setGoogleLoaded(true);
                    });
                };
                document.body.appendChild(script);
            }
        };

        loadGoogleCharts();
    }, []);

    useEffect(() => {
        if (googleLoaded && data.length) {
            const drawChart = () => {
                const dataTable = window.google.visualization.arrayToDataTable([
                    ['Season', 'Number of Bookings'],
                    ['Primavară', data[0]],
                    ['Vară', data[1]],
                    ['Toamnă', data[2]],
                    ['Iarnă', data[3]],
                ]);

                const options = {
                    title: title,
                    pieHole: 0.4,
                    colors: ['#fbc02d', '#f57c00', '#0288d1', '#c2185b'],
                    pieSliceText: 'percentage',
                    sliceVisibilityThreshold: 0,
                    chartArea: {
                        left: "10%",
                        top: "10%",
                        width: "70%",
                        height: "70%"
                    }
                };

                const chart = new window.google.visualization.PieChart(chartRef.current);
                chart.draw(dataTable, options);
            };

            drawChart();
        }
    }, [googleLoaded, data]);

    return <div ref={chartRef} style={{ width: '1000px', height: '500px' }}></div>;
};


export default GooglePieChart;

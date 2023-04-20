// Define the data for the first frame

fetch('/dataIL')
    .then(response => response.json())
    .then(data => {
        
        const datetime = data.object1.datetime;
        const locations = data.object1.state;
        const value = data.object1.positiveIncrease;

        var mapData = [
            {
                type: 'choropleth',
                locationmode: 'USA-states',
                locations: locations,
                z: value,
                colorscale: 'Reds',
                autocolorscale: false,
                reversescale: false,
                marker: {
                    line: {
                        color: 'rgb(255,255,255)',
                        width: 2
                    }
                },
                colorbar: {
                    title: 'Title',
                    thickness: 10
                }
            }
        ];

        // Define the layout for the slider and the plot
        var layout = {
            title: `New Covid Daily Positive Cases on ${data.object1.datetime}`,
            geo: {
                scope: 'usa',
                showlakes: true,
                lakecolor: 'rgb(255, 255, 255)'
            },
            sliders: [
                {
                    steps: [
                        {
                            method: 'update',
                            label: data.object1.datetime,
                            args: [
                                { z: [data.object1.positiveIncrease] },
                                { title: `New Covid Daily Positive Cases on ${data.object1.datetime}` }
                            ]
                        },
                        {
                            method: 'update',
                            label: data.object2.datetime,
                            args: [
                                { z: [data.object2.positiveIncrease] },
                                { title: `New Covid Daily Positive Cases on ${data.object2.datetime}` }
                            ]
                        },
                        {
                            method: 'update',
                            label: data.object3.datetime,
                            args: [
                                { z: [data.object3.positiveIncrease] },
                                { title: `New Covid Daily Positive Cases on ${data.object3.datetime}` }
                            ]
                        },
                        {
                            method: 'update',
                            label: data.object4.datetime,
                            args: [
                                { z: [data.object4.positiveIncrease] },
                                { title: `New Covid Daily Positive Cases on ${data.object4.datetime}` }
                            ]
                        },
                        {
                            method: 'update',
                            label: data.object5.datetime,
                            args: [
                                { z: [data.object5.positiveIncrease] },
                                { title: `New Covid Daily Positive Cases on ${data.object5.datetime}` }
                            ]
                        },
                        {
                            method: 'update',
                            label: data.object6.datetime,
                            args: [
                                { z: [data.object6.positiveIncrease] },
                                { title: `New Covid Daily Positive Cases on ${data.object6.datetime}` }
                            ]
                        },
                        {
                            method: 'update',
                            label: data.object7.datetime,
                            args: [
                                { z: [data.object7.positiveIncrease] },
                                { title: `New Covid Daily Positive Cases on ${data.object7.datetime}` }
                            ]
                        },
                        {
                            method: 'update',
                            label: data.object8.datetime,
                            args: [
                                { z: [data.object8.positiveIncrease] },
                                { title: `New Covid Daily Positive Cases on ${data.object8.datetime}` }
                            ]
                        },
                        {
                            method: 'update',
                            label: data.object9.datetime,
                            args: [
                                { z: [data.object9.positiveIncrease] },
                                { title: `New Covid Daily Positive Cases on ${data.object9.datetime}` }
                            ]
                        },
                        {
                            method: 'update',
                            label: data.object10.datetime,
                            args: [
                                { z: [data.object10.positiveIncrease] },
                                { title: `New Covid Daily Positive Cases on ${data.object10.datetime}` }
                            ]
                        }
                    ],
                    active: 0,
                    x: 0.1,
                    len: 0.9,
                    y: 0,
                    yanchor: 'top',
                    pad: { t: 50, b: 10 },
                    currentvalue: {
                        visible: true,
                        prefix: 'Date:',
                        xanchor: 'right',
                        font: {
                            size: 20,
                            color: '#666'
                        }
                    }
                }
            ]
        };

        // Plot the initial chart
        Plotly.newPlot('choropleth', mapData, layout);

        // Update the chart when the slider is changed
        document.getElementById('choropleth').on('plotly_sliderchange', function (eventdata) {
            var currentStep = eventdata.step.label;
            console.log('Current step:', currentStep);
        });

});
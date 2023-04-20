// function updateChart() {
//     d3.json("/data").then(data => 
//         console.log(data));


// }
var data;

fetch('/dataIL')
    .then(response => response.json())
    .then(data => {
        console.log(data);

        var chartDiv = document.getElementById('choropleth');

        if (chartDiv) {
            Plotly.purge(chartDiv, { noUpdate: true });

        }

        // var selectedDate = data[0].datetime;

        var layout = {
            title: "COVID Cases by Day",
            geo: {
                scope: "usa"
            },
            sliders: [{
                steps: [],
                x: 0.1,
                len: 0.9,
                currentvalue: {
                    xanchor: "right",
                    prefix: "Date: ",
                    font: {
                        color: "#888",
                        size: 20
                    }
                },
                transition: {
                    duration: 500,
                    easing: "cubic-in-out"
                }
            }]

        };
        var dates = [];
        // console.log('dates', dates);
        for (var i = 0; i < data.length; i++) {
            if (dates.indexOf(data[i].datetime) === -1) {
                dates.push(data[i].datetime);
            }
        }
        dates.sort()
        console.log(dates);
        for (var i = 0; i < dates.length; i++) {
            // console.log('date', date);
            var date = dates[i];
            var step = {
                label: date,
                method: "update",
                args: [{
                    visible: Array(layout.geo.scope.length).fill(false),
                    type: 'choropleth',
                    locationmode: 'USA-states',
                    locations: [],
                    z: []
                }]
            }
            // console.log(visible);
            for (var j = 0; j < data.length; j++) {
                // console.log('datetime', data[j].datetime);
                if (data[j].datetime === date) {
                    var stateCode = data[j].state;
                    var value = data[j].positiveIncrease;
                    var index = layout.geo.scope.indexOf(stateCode);
                    // console.log("initial map", stateCode, value, index);
                    step.args[0].visible[index] = true;
                    step.args[0].locations.push(stateCode);
                    step.args[0].z.push(value);
                }
            }
            layout.sliders[0].steps.push(step);

        }
        console.log('fetch', data)
        // Get the chart div element
        var chartDiv = document.getElementById('choropleth');

        // If chart div element exists, destroy the chart using Plotly.purge()
        if (chartDiv) {
            Plotly.purge(chartDiv, { noUpdate: true });
        }


        Plotly.newPlot('choropleth', {
            data: [{
                type: 'choropleth',
                locationmode: 'USA-states',
                locations: step.args[0].locations,
                z: step.args[0].z
            }],
            layout: layout
        }).then(function () {
            var plot = document.getElementById('choropleth');

            var locations = [];

            plot.on('plotly_sliderchange', function (event) {

                    console.log('slider changed');

                    var selectedDate = event.step.label;
                    console.log('selectedDate', selectedDate)

                    // var selectedData = data.filter(function (d) {
                    //     return new Date(d.datetime).getTime() === new Date(selectedDate).getTime()
                    // });
                    // console.log("test", selectedData);
                    // var visible = Array(layout.geo.scope.length).fill(false);
                    // console.log(visible)

                    // var locations = [];
                    // var z = [];

                    // console.log(selectedData);
                    // console.log("scope", layout.geo.scope);
                    // // console.log(layout.geo.scope.length);
                    // console.log("stateindex", layout.geo.scope.indexOf(stateCode));



                    // for (var i = 0; i < selectedData.length;i ++) {
                    //     // console.log('datetime', data[j].datetime);

                    //         var stateCode = selectedData[i].state;
                    //         var value = selectedData[i].positiveIncrease;
                    //         var index = layout.geo.scope.indexOf(stateCode);
                    //         console.log("map update", stateCode, value, index);
                    //         locations.push(stateCode);
                    //         z.push(value);         
                    // }

                    // var step = {
                    //     label: selectedDate,
                    //     method: "update",
                    //     args: [{
                    //         visible: Array(layout.geo.scope.length).fill(false),
                    //         type: 'choropleth',
                    //         locationmode: 'USA-states',
                    //         locations: [],
                    //         z: []
                    //     }]
                    // };
                    // layout.sliders[0].steps.push(step);







                    Plotly.update('choropleth', {
                        data: [{
                            visible: Array(layout.geo.scope.length).fill(true),
                            type: 'choropleth',
                            locationmode: 'USA-states',
                            locations: step.args[0].locations,
                            z: step.args[0].z
                        }],
                        layout: layout

                    
                    });
                })
        
        })
    });


import React, { useEffect, useState } from "react";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import 'chartjs-adapter-date-fns';
import 'chartjs-adapter-moment';
import "../styles/Graph.css";

defaults.maintainAspectRatio = false;
defaults.responsive = true;

defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.font.size = 20;
defaults.plugins.title.color = "black";

const options = {
  // responsive: true,
  // scales: {
  //   x: {
  //     // type: 'time',
  //     time: {
  //       unit: 'day',
  //       tooltipFormat: 'DD MMM',
  //       displayFormats: {
  //         day: 'DD MMM',
  //       },
  //     min: '2023-01-01',
  //     max: '2023-01-30',
  //     },
  //     title: {
  //       display: true,
  //       text: 'Date',
  //     },
  //   },
  //   y: {
  //     beginAtZero: true,
  //     title: {
  //       display: true,
  //       text: 'Count',
  //     },
  //   },
  // },
  elements: {
    line: {
      tension: 0.3,
    },
  },
  plugins: {
    title: {
      display: true,
      text: 'SALUT! Analitics',
    },
  },
};

function countEntriesByDay(data, key="none") {
  const counts = {};

  data.forEach(item => {
    const date = new Date(item.time * 1000);
    const dateString = date.toISOString().split('T')[0];

    if (counts[dateString]) {
      counts[dateString]++;
    } else {
      counts[dateString] = 1;
    }
  });

  if (key != "none") {
    var counts1 = {};

    data.forEach(item => {
      const date1 = new Date(item.time * 1000);
      const dateString1 = date1.toISOString().split('T')[0];

      if (counts1[dateString1]) {
        counts1[dateString1]++;
      } else {
        counts1[dateString1] = 1;
      }
    });
    var entries1 = Object.entries(counts);
    entries1.sort((a, b) => new Date(a[0]) - new Date(b[0]));
  }

  // Convert the counts object to an array of [date, count] pairs
  const entries = Object.entries(counts);


  // Sort the array by date
  entries.sort((a, b) => new Date(a[0]) - new Date(b[0]));
  console.log(entries, entries1)

  // If you prefer the result as an object in chronological order

  // const sortedCounts = entries;

  // return sortedCounts;
  if (entries.length != 0) {
    if (key != "none") {
      console.log("bruh", [entries[0][0], entries1[0][0]].sort((a, b) => new Date(a) - new Date(b)));
      var startDate = [entries[0][0], entries1[0][0]].sort((a, b) => new Date(a) - new Date(b))[0];
      var endDate = [entries[entries.length - 1][0], entries1[entries1.length - 1][0]].sort((a, b) => new Date(a) - new Date(b))[0];
    } else {
      var startDate = entries[0][0];
      var endDate = entries[entries.length - 1][0];
    }

    // Result array
    const filledData = [];

    let counterDate = new Date(startDate);
    let finalDate = new Date(endDate);
    let counter = 0;
    while (counterDate <= finalDate) {
      // console.log(counterDate);
      // for (let i = 0; i < entries.length; i++) {

      // }
      let entriesDate = new Date(entries[counter][0]);
      if (entriesDate.toUTCString() != counterDate.toUTCString()){
        // console.log(counterDate.toUTCString(), entriesDate.toUTCString())
        entries.splice(counter, 0, [counterDate.toISOString().split('T')[0], entries[counter - 1][1]]);
      }
      // console.log(ent);
      counterDate.setDate(counterDate.getDate() + 1);
      counter += 1;
    }
    
    return entries;
  } else return [];
  
}

function getConversion(data) {
  try {
    var data_int = countEntriesByDay(data.filter((item) => !item["is_order"]), data.filter((item) => item["is_order"]));
    var data_ord = countEntriesByDay(data.filter((item) => item["is_order"]), data.filter((item) => !item["is_order"]));
    var finalData = [];
    // console.log(data_int, data_ord)
    // if ()
    for (let i = 0; i < data_int.length; i++) {
      // console.log(data_int[i], data_ord[i])
      finalData.push([data_int[i][0], data_ord[i][1] / data_int[i][1]]);
    }
    // console.log('halo')
    // console.log(finalData);
    return finalData;
  }
  catch {
    return data;
  }
  
}


function getTop5 (data, metadata) {
  data = data.map((item) => item[metadata]).sort((a, b) => {return a - b});
  const counts = data.reduce((acc, number) => {
    acc[number] = (acc[number] || 0) + 1;
    return acc;
  }, {});

  
  // Step 2: Sort the counts in descending order and keep the number
  const sortedNumbers = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  
  // Step 3: Select the top five
  return sortedNumbers.slice(0, 5).map(entry => parseInt(entry[0]));
}

const primaryColors = [
  "#4407F1",
  "#0828F1",
  "#064FF0",
  "#02B4EF",
  "#00EFDD"
]

export const Graph = ({mockData, metadata, type}) => {

  console.log("metadata", metadata)

  const [data, setData] = useState(mockData);

  useEffect(() => {
    options.plugins.title.text = type.label
    if (type.label == "Конверсия") {
      setData(getConversion(mockData));
    } else setData(mockData);
  }, [mockData])
  // console.log(mockData)
  return (
    <div className="Graph">
      <div className="dataCard revenueCard">
        <Line
          data={{
            // labels: revenueData.map((data) => data.label),
            labels: [],
            datasets: metadata == "" ? [
              {
                label: type.label,
                data: type.label == 'Конверсия' ? data : countEntriesByDay(mockData),
                backgroundColor: "#064FF0",
                borderColor: "#064FF0",
              },
            ] : getTop5(data, metadata).map( (item, key) => {
              var newData = [];
              for (let i = 0; i < data.length; i++) {
                if (data[i][metadata] == item) {
                  newData.push(data[i]);
                }
              }
              return {
                label: metadata + ": " + item,
                data: countEntriesByDay(newData),
                backgroundColor: primaryColors[key],
                borderColor: primaryColors[key],
              }
            }),
          }}
          options={options}
        />
      </div>

      {/* <div className="dataCard customerCard">
        <Bar
          data={{
            labels: sourceData.map((data) => data.label),
            datasets: [
              {
                label: "Count",
                data: sourceData.map((data) => data.value),
                backgroundColor: [
                  "rgba(43, 63, 229, 0.8)",
                  "rgba(250, 192, 19, 0.8)",
                  "rgba(253, 135, 135, 0.8)",
                ],
                borderRadius: 5,
              },
            ],
          }}
          options={{
            plugins: {
              title: {
                text: "Revenue Source",
              },
            },
          }}
        />
      </div>

      <div className="dataCard categoryCard">
        <Doughnut
          data={{
            labels: sourceData.map((data) => data.label),
            datasets: [
              {
                label: "Count",
                data: sourceData.map((data) => data.value),
                backgroundColor: [
                  "rgba(43, 63, 229, 0.8)",
                  "rgba(250, 192, 19, 0.8)",
                  "rgba(253, 135, 135, 0.8)",
                ],
                borderColor: [
                  "rgba(43, 63, 229, 0.8)",
                  "rgba(250, 192, 19, 0.8)",
                  "rgba(253, 135, 135, 0.8)",
                ],
              },
            ],
          }}
          options={{
            plugins: {
              title: {
                text: "Revenue Sources",
              },
            },
          }}
        />
      </div> */}
    </div>
  );
};

import React, { useEffect } from 'react';
import { useState } from 'react';
import '../styles/ShowDiffPage.css';

import { SidePanel } from './reusable/SidePanel';
import { PopUp } from './PopUp';

import redWideLine1 from '../assets/icons/redWideLine1.svg'
import redWideLine2 from '../assets/icons/redWideLine2.svg'

import { TopBars } from './reusable/TopBars';

import { FilesList } from './FilesList';
import { TableView } from './TableView';

import loop from '../assets/icons/search.svg'
import person from '../assets/icons/person-fill.svg'
import ChooseTable from './ChooseTable';
import DiffCont from './DiffCont';

import axios from 'axios';

function formatUnixTimestamp(unixTimestampStr) {
    // Convert the Unix timestamp string to a number
    const timestamp = parseInt(unixTimestampStr, 10);

    // Create a new Date object using the timestamp (multiplied by 1000 to convert from seconds to milliseconds)
    const date = new Date(timestamp * 1000);

    // Extract and format the components of the date
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed, add 1 to get the correct month number
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    // Construct the formatted date string
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;

    return formattedDate;
}

function ShowDiffPage() {
    const AccountName = 'vdmk'

    // const [filename1, setFilename1] = useState('');
    // const [filename2, setFilename2] = useState('');
    const hack = '2023-12-31T';
    const rn = new Date().toJSON().split("T")[0];

    const [data, setData] = useState([]);

    const [filename1, setFilename1] = useState({ "id": 0, "label": "baseline" });
    const [filename2, setFilename2] = useState({ "id": 0, "label": "baseline" });
    const [version1, setVersion1] = useState({ "id": 0, "label": "baseline" });
    const [version2, setVersion2] = useState({ "id": 0, "label": "baseline" });
    const [isOpen, setIsOpen] = useState(-1);
    const [labels1, setLabels1] = useState([{ "id": 0, "label": "baseline" }, { "id": 1, "label": "discounts_1" }, { "id": 2, "label": "discounts_2" }, { "id": 3, "label": "discounts_3" }]);
    const [labels2, setLabels2] = useState([{ "id": 0, "label": "baseline" }, { "id": 1, "label": "discounts_1" }, { "id": 2, "label": "discounts_2" }, { "id": 3, "label": "discounts_3" }]);
    const [labels3, setLabels3] = useState([{ "id": 0, "label": "baseline" }, { "id": 1, "label": "discounts_1" }, { "id": 2, "label": "discounts_2" }, { "id": 3, "label": "discounts_3" }]);

    const [tableData, setTableData] = useState([])

    useEffect(() => {
        getFiles();
    }, [])

    useEffect(() => {
        if (data.length != 0) {
            setLabels2(data.filter((item) => item["name"].includes(filename1.label)).map((item) => { return item["name"].split("_")[1] }).filter((item, index, array) => { return array.findIndex(i => i === item) === index }).map((item, key) => { return { "id": key, "label": formatUnixTimestamp(item), "meta": item } }));
            setVersion1(data.filter((item) => item["name"].includes(filename1.label)).map((item) => { return item["name"].split("_")[1] }).filter((item, index, array) => { return array.findIndex(i => i === item) === index }).map((item, key) => { return { "id": key, "label": formatUnixTimestamp(item), "meta": item } })[0])
        }
    }, [filename1]);

    useEffect(() => {
        // console.log("smth happened")
        if (data.length != 0) {
            setLabels3(data.filter((item) => item["name"].includes(filename2.label)).map((item) => { return item["name"].split("_")[1] }).filter((item, index, array) => { return array.findIndex(i => i === item) === index }).map((item, key) => { return { "id": key, "label": formatUnixTimestamp(item), "meta": item } }));
            setVersion2(data.filter((item) => item["name"].includes(filename2.label)).map((item) => { return item["name"].split("_")[1] }).filter((item, index, array) => { return array.findIndex(i => i === item) === index }).map((item, key) => { return { "id": key, "label": formatUnixTimestamp(item), "meta": item } })[0]);
            // console.log("bruh", data);
            // console.log('smth', data.filter((item) => item["name"].includes(filename2.label)).map((item) => { return item["name"].split("_")[1] }).filter((item, index, array) => { return array.findIndex(i => i === item) === index }).map((item, key) => { return { "id": key, "label": formatUnixTimestamp(item), "meta": item } })[0])
        }
        
    }, [filename2]);

    useEffect(() => {
        getDiff();
    }, [filename1, filename2, version1, version2])

    const getDiff = async () => {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        await axios.get(`http://45.8.99.29:8080/matrix/get_difference?from_name=${filename1.label}_${version1.meta}&to_name=${filename2.label}_${version2.meta}`, { headers })
            .then(response => {
                if (response.status == 200) {
                    console.log(response.data);
                    var newData = [];
                    if (response.data["updated"] != null)
                    for (let i = 0; i < response.data["updated"].length; i++) {
                        let obj = response.data["updated"][i];
                        newData.push({"microcategory_id": obj[0]["microcategory_id"], "region_id": obj[0]["region_id"], "oldPrice": obj[0]["price"], "newPrice": obj[1]["price"]});
                    }
                    if (response.data["added"] != null)
                    for (let i = 0; i < response.data["added"].length; i++) {
                        let obj = response.data["added"][i];
                        newData.push({"microcategory_id": obj["microcategory_id"], "region_id": obj["region_id"], "oldPrice": 0, "newPrice": obj["price"]});
                    }
                    if (response.data["deleted"] != null)
                    for (let i = 0; i < response.data["deleted"].length; i++) {
                        let obj = response.data["deleted"][i];
                        newData.push({"microcategory_id": obj["microcategory_id"], "region_id": obj["region_id"], "oldPrice": obj["price"], "newPrice": 0});
                    }
                    newData.sort((a, b) => {
                        if (a["microcategory_id"] < b["microcategory_id"]) return -1;
                        if (a["microcategory_id"] > b["microcategory_id"]) return 1;
                        if (a["region_id"] < b["region_id"]) return -1;
                        if (a["region_id"] > b["region_id"]) return 1;
                        // If both key1 and key2 are equal, return 0 (no sorting)
                        return 0;
                    });
                    setTableData(newData);
                    // setFilename1(response.data.filter((item) => item["name"].includes(filename + "_")).sort((a, b) => { return new Date(b["timestamp"]) - new Date(a["timestamp"]) })[0]["name"]);
                    // getMatrix(response.data.filter((item) => item["name"].includes(filename + "_")).sort((a, b) => { return new Date(b["timestamp"]) - new Date(a["timestamp"]) })[0]["name"]);
                }
            })
            .catch(error => {
                console.error(`Error: ${error}`); // Log any errors that occur during the request
            });
    };

    const getFiles = async () => {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        await axios.get(`http://45.8.99.29:8080/matrix/get_matrices_by_duration?time_from=${hack}23%3A59%3A59%2B00%3A00&time_to=${rn}T23%3A59%3A59%2B00%3A00`, { headers })
            .then(response => {
                if (response.status == 200) {
                    console.log(response.data);
                    setData(response.data);
                    setLabels1(response.data.map((item) => { return item["name"].split("_")[0] }).filter((item, index, array) => { return array.findIndex(i => i === item) === index }).map((item, key) => { return { "id": key, "label": item } }));
                    setFilename1(response.data.map((item) => { return item["name"].split("_")[0] }).filter((item, index, array) => { return array.findIndex(i => i === item) === index }).map((item, key) => { return { "id": key, "label": item } })[0]);
                    setFilename2(response.data.map((item) => { return item["name"].split("_")[0] }).filter((item, index, array) => { return array.findIndex(i => i === item) === index }).map((item, key) => { return { "id": key, "label": item } })[0]);
                    // setFilename(response.data.filter((item) => item["name"].includes(filename + "_")).sort((a, b) => { return new Date(b["timestamp"]) - new Date(a["timestamp"]) })[0]["name"]);
                    // getMatrix(response.data.filter((item) => item["name"].includes(filename + "_")).sort((a, b) => { return new Date(b["timestamp"]) - new Date(a["timestamp"]) })[0]["name"]);
                }
            })
            .catch(error => {
                console.error(`Error: ${error}`); // Log any errors that occur during the request
            });
    };

    return (
        <div className='show-diff-page'>
            <img src={redWideLine1} className='wide-line-1'></img>
            <img src={redWideLine2} className='wide-line-2'></img>

            <SidePanel pageState="showdiff_page"> </SidePanel>

            <div className='right-side'>

                <div className='header'>
                    <h2>ИЗМЕНЕНИЯ</h2>
                    <TopBars AccountName={AccountName} />
                </div>

                <div className='components-diff'>
                    <ChooseTable filename1={filename1} setFilename1={setFilename1} filename2={filename2} setFilename2={setFilename2} version1={version1} setVersion1={setVersion1} version2={version2} setVersion2={setVersion2} isOpen={isOpen} setIsOpen={setIsOpen} labels1={labels1} labels2={labels2} labels3={labels3}></ChooseTable>
                    <DiffCont data={tableData}></DiffCont>
                </div>
                {/* <PopUp/> */}
            </div>

            <div className='title-of-winners'>
                <strong> Avito </strong>  x <strong> MISIS </strong> x <strong> MIREA </strong>
            </div>


        </div>
    );
}

export default ShowDiffPage;
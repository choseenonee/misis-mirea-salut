import React, { useEffect } from 'react';
import { useState } from 'react';
import '../styles/TablePage.css';

import { SidePanel } from './reusable/SidePanel';
import { PopUp } from './PopUp';

import pinkWideLine1 from '../assets/icons/pinkWideLine1.svg'
import pinkWideLine2 from '../assets/icons/pinkWideLine2.svg'

import { TopBars } from './reusable/TopBars';

import { FilesList } from './FilesList';
import { TableView } from './TableView';

import loop from '../assets/icons/search.svg'
import person from '../assets/icons/person-fill.svg'
import axios from 'axios';

function TablePage() {
    const hack = '2023-12-31T';
    const rn = new Date().toJSON().split("T")[0];

    const [file, setFile] = useState("baseline_1");
    const [storageString, setStorageString] = useState("");
    const [storageStatus, setStorageStatus] = useState("");
    const [switchStatus, setSwitchStatus] = useState("");
    const [files, setFiles] = useState([])

    useEffect(() => {
        getFiles();
    }, [])

    const getStorage = async () => {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        await axios.get(`http://45.8.99.29:8080/storage/current`, { headers })
            .then(response => {
                if (response.status == 200) {
                    console.log(response.data);
                    var data = response.data
                    if (data["baseline"] == "" && data["discount"] == null) {
                        setStorageString("Storage не установлен")
                    } else {
                        let newStr = data["baseline"]
                        for (let i = 0; i < data["discount"].length; i++){
                            newStr += " " + data["discount"][i];
                        }
                        setStorageString(newStr);
                    }
                }
            })
            .catch(error => {
                console.error(`Error: ${error}`); // Log any errors that occur during the request
            });
    };

    const setStorage = async () => {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        var data = {
            "baseline": "BASELINE_1710378485",
            "discount": [
                "DISCOUNT_1710378486",
                "DISCOUNT_1710378485"
            ]
        }
        setStorageStatus("Начало загрузки данных. Не перезагружайте страницу")
        await axios.post(`http://45.8.99.29:8080/storage/send`, data, { headers })
            .then(response => {
                if (response.status == 200) {
                    setStorageStatus("Успешно.")
                }
            })
            .catch(error => {
                setStorageStatus(`Ошибка ${error}.`);
                console.error(`Error: ${error}`); // Log any errors that occur during the request
            });
    };

    const switchStorage = async () => {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        await axios.post(`http://45.8.99.29:8080/storage/switch`, { headers })
            .then(response => {
                if (response.status == 200) {
                    setSwitchStatus("Успешно.");
                }
            })
            .catch(error => {
                setSwitchStatus(`Ошибка ${error}.`)
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
                    console.log(response.data)
                    setFiles(response.data.map((item) => { return item["name"]}));
                    console.log(response.data.map((item) => { return item["name"].split("_").slice(0, -1).join("") }).filter((item, index, array) => { return array.findIndex(i => i === item) === index }));
                    setFile(response.data.map((item) => { return item["name"]})[0].split("_").slice(0, -1).join(""))
                }
            })
            .catch(error => {
                console.error(`Error: ${error}`); // Log any errors that occur during the request
            });
    };



    const AccountName = 'vdmk'
    return (
        <div className='table-page'>
            <img src={pinkWideLine1} className='wide-line-1'></img>
            <img src={pinkWideLine2} className='wide-line-2'></img>

            <SidePanel pageState="files_page"> </SidePanel>

            <div className='right-side'>

                <div className='header'>
                    <h2>ФАЙЛЫ</h2>
                    <TopBars AccountName={AccountName} />
                </div>

                <div className='storage-container'>
                    <div>
                        <div className='saving-button' style={{width: "170px", display:"flex", justifyContent:"center"}} onClick={() => getStorage()}>
                            Обновить данные
                        </div>
                        <p className='appear-text'>{storageString}</p>
                    </div>
                    <div className='two-buttons'>
                        <div>
                            <div onClick={() => setStorage()} className='saving-button'>
                                Отправить данные
                            </div>
                            <p className='appear-text'>{storageStatus}</p>
                        </div>
                        <div>
                            <div onClick={() => storageString != 'Storage не установлен' ? switchStorage() : setSwitchStatus('Нет данных на сервере.')} className='saving-button'>
                                Применить изменения
                            </div>
                            <p className='appear-text'>{switchStatus}</p>
                        </div>
                    </div>
                    
                    
                </div>

                <div className='components'>
                    <FilesList setOption={setFile} option={file} labels={files} />
                    <TableView file={file} />
                </div>
            </div>

            <div className='title-of-winners'>
                <strong> Avito </strong>  x <strong> MISIS </strong> x <strong> MIREA </strong>
            </div>


        </div>
    );
}

export default TablePage;
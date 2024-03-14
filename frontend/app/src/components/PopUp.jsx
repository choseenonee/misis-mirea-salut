import React from "react";

import "../styles/PopUp.css";

import warning from '../assets/icons/warning.svg'

import { useState } from "react";

import axios from "axios";


export const PopUp = ({isPopUpShow, filename, updated, added, deleted, parent_name}) => {

    function handleYes() {
        isPopUpShow(false)
    }

    function handleCancel() {
        isPopUpShow(false)
    }

    const [file, setFile] = useState(filename);

    const setStorage = async () => {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        let newUpdated = [];
        for (let i = 0; i < updated.length; i++){
            newUpdated.push({"microcategory_id": updated[i]["microcategory_id"], "region_id": updated[i]["region_id"],"price": parseInt(updated[i]["newPrice"])})
        }
        // console.log("pop", deleted)
        var data = {
            // "updated": newUpdated,
            // "added": added,
            // "deleted": deleted,
            "updated": newUpdated,
            "added": [
                {
                  "microcategory_id": 0,
                  "price": 0,
                  "region_id": 0
                }
              ],
              "deleted": [
                {
                  "microcategory_id": 0,
                  "price": 0,
                  "region_id": 0
                }
              ],
            "parent_name": parent_name,
            "new_name": file,
            'is_baseline': file == 'baseline'
        }
        console.log('pop', JSON.stringify(data));
        await axios.post(`http://45.8.99.29:8080/matrix/create`, JSON.stringify(data), { headers })
            .then(response => {
                if (response.status == 200) {
                    console.log("YES", response.data)
                    handleYes();
                }
            })
            .catch(error => {
                console.error(`Error: ${error}`); // Log any errors that occur during the request
            });
    };

  return (
    <div className='pop-up'>

        <img src={warning} className="warning-icon"></img>

        <div className="label-text">
            <p>Уверены, что хотите</p>
            <p>сохранить изменения?</p>
        </div>

        <div>
            <p className="label-text">Название файла</p>
            <input className="input-pop-up" value={file} onChange={(e) => setFile(e.target.value)}/>
        </div>

        <div className="buttons">

            <div className="yes-button" onClick={() => setStorage()}>
                <p>Да</p>
            </div>

            <div className="cancel-button" onClick={handleCancel}>
                <p>Отмена</p>
            </div>

        </div>
            

    </div>
  );
};

import React, { useEffect, useState } from "react";

import "../styles/TableView.css";
import loop from "../assets/icons/search.svg"
import DataTable from "./DataTable";

// import bruh from "../data/matrix-mock.json"
import backBar from "../assets/icons/grayNavBar.svg"
import pinkBar from "../assets/icons/pinkNavBar.svg"

import leftDoubleArrow from "../assets/icons/leftDoubleArrow.svg"
import leftArrow from "../assets/icons/leftArrow.svg"
import rightArrow from "../assets/icons/rightArrow.svg"
import rightDoubleArrow from "../assets/icons/rightDoubleArrow.svg"
import grayPlus from "../assets/icons/grayPlus.svg"

import { PopUp } from "./PopUp";
import axios from 'axios';

export const TableView = ({file}) => {

     const hack = '2023-12-31T';
     const rn = new Date().toJSON().split("T")[0];
     // console.log(rn);

     const [tableData, setTableData] = useState([]);
     const [plainData, setPlainData] = useState([]);
     const [isPopUp, isPopUpShow] = useState(false);
     const [page, setPage] = useState(1);
     const [filename, setFilename] = useState('');

     const [changes, setChanges] = useState([]);
     const [deleted, setDeleted] = useState([]);
     const [added, setAdded] = useState([]);

     const [mcSearch, setMcSearch] = useState("");
     const [lcSearch, setLcSearch] = useState("");

     
     function handleAdd() {
          var template = {"microcategory_id": "", "region_id": "", "price": 0, "id": added.length, "page": page};
          setAdded(oldAdded => [...oldAdded, template]);
          // console.log('hueta happened', added)
     }

     const getMaxPages = async (name) => {
          const headers = {
               'Accept': 'application/json',
               'Content-Type': 'application/json'
          };
          console.log('request', name)
          await axios.get(`http://45.8.99.29:8080/matrix/get_matrix_pages?matrix_name=${name}`, { headers })
               .then(response => {
                    if (response.status == 200) {
                         setMaxPage(response.data);
                    }
               })
               .catch(error => {
                    console.error(`Error: ${error}`); // Log any errors that occur during the request
               });
     }


     const getMatrix = async (name) => {
          const headers = {
               'Accept': 'application/json',
               'Content-Type': 'application/json'
          };
          // console.log("lol", `http://45.8.99.29:8080/matrix/get_matrix?matrix_name=${name}&page=${page}` +mcSearch != "" ? `&microcategory_id=${mcSearch}` : "");
          await axios.get(`http://45.8.99.29:8080/matrix/get_matrix?matrix_name=${name}&page=${page}` + (mcSearch != "" ? `&microcategory_id=${mcSearch}` : "") + (lcSearch != "" ? `&region_id=${lcSearch}` : ""), { headers })
               .then(response => {
                    if (response.status == 200) {
                         setTableData(response.data["data"]);
                         setPlainData(response.data["data"]);
                         // getWholeMatrix(name);
                         // console.log(response.data["data"])
                    }
               })
               .catch(error => {
                    console.error(`Error: ${error}`); // Log any errors that occur during the request
               });
     }


     const getFiles = async () => {
          const headers = {
               'Accept': 'application/json',
               'Content-Type': 'application/json'
          };
          await axios.get(`http://45.8.99.29:8080/matrix/get_matrices_by_duration?time_from=${hack}23%3A59%3A59%2B00%3A00&time_to=${rn}T23%3A59%3A59%2B00%3A00`, { headers })
               .then(response => {
                    if (response.status == 200) {
                         console.log('qq', response.data);
                         setFilename(response.data.filter((item) => item["name"].includes(file + "_")).sort((a, b) => { return new Date(b["timestamp"]) - new Date(a["timestamp"]) })[0]["name"]);
                         getMatrix(response.data.filter((item) => item["name"].includes(file + "_")).sort((a, b) => { return new Date(b["timestamp"]) - new Date(a["timestamp"]) })[0]["name"]);
                         console.log('meow', response.data.filter((item) => item["name"].includes(file + "_")).sort((a, b) => { return new Date(b["timestamp"]) - new Date(a["timestamp"]) })[0]["name"])
                         getMaxPages(response.data.filter((item) => item["name"].includes(file + "_")).sort((a, b) => { return new Date(b["timestamp"]) - new Date(a["timestamp"]) })[0]["name"]);
                    }
               })
               .catch(error => {
                    console.error(`Error: ${error}`); // Log any errors that occur during the request
               });
     };

     useEffect(() => {
          getFiles();
          // setTableData(bruh);
     }, [page, file]);

     // useEffect(() => {
     // }, [page])

     const [maxPage, setMaxPage] = useState(-1);

     function handleSave() {
          isPopUpShow(true);
     }
     
     function nextPage() {
          if (page - (page - 1) % 4 + 4 <= maxPage) setPage(page - (page - 1) % 4 + 4);
     }

     function prevPage() {
          if (page > 4) setPage(page - (page - 1) % 4 - 1);
     }

     function minPage() {
          if (page > 4) setPage(1);
     }

     function maxPageFunc() {
          if (page < maxPage - 4) setPage(maxPage);
     }

     function handleMcSearch(value) {
          setMcSearch(value);
          getMatrix(filename);
          // setTableData(plainData.filter(item => item["microcategory_id"].toString().toLowerCase().startsWith(value.toLowerCase())));
     }
     function handleLcSearch(value) {
          setLcSearch(value);
          getMatrix(filename);
          // setTableData(plainData.filter(item => item["region_id"].toString().toLowerCase().startsWith(value.toLowerCase())));
     }

     return (
          <div className='table-conteiner'>
               <div className="buttons-table">
                    <div className="saving-button" onClick={handleSave}><p>Сохранить изменения</p></div>

                    <div className="search-fields">
                         <div className="search-form">
                              <input value={mcSearch} onChange={(e) => handleMcSearch(e.target.value)} className="search-input" placeholder="Поиск по категории"></input>
                              <img src={loop}></img>
                         </div>

                         <div className="search-form">
                              <input value={lcSearch} onChange={(e) => handleLcSearch(e.target.value)} className="search-input" placeholder="Поиск по региону"></input>
                              <img src={loop}></img>
                         </div>
                    </div>

               </div>

               <div className="column-names-files">
                    <p>microcategory_id</p>
                    <p>region_id</p>
                    <p style={{ "paddingLeft": "50px" }}>Цена</p>
                    <img onClick={() => handleAdd()} src={grayPlus} className='add-img'></img>

               </div>
               {isPopUp==true ? <PopUp filename={file} isPopUpShow={isPopUpShow} updated={changes} added={added} deleted={deleted} parent_name={filename} /> : <div></div> }
               {isPopUp==true ? <div className="blured-data"></div> : <div></div> }

          <div className="table">
               <div className="data">
                    
                    <DataTable data={tableData == null ? [] : tableData} changes={changes} setChanges={setChanges} deleted={deleted} setDeleted={setDeleted} added={added} setAdded={setAdded} page={page}/>
               </div>
          </div>

               <div className='slider-after'>
                    <img onClick={() => minPage()} className='number-cont' src={leftDoubleArrow}></img>
                    <img onClick={() => prevPage()} className='number-cont' src={leftArrow}></img>
                    <div onClick={() => setPage(page - (page - 1) % 4)} className={page == page - (page - 1) % 4 ? 'number-cont-active' : 'number-cont'}><p>{page - (page - 1) % 4}</p></div>
                    {page - (page - 1) % 4 + 1 <= maxPage ? <div onClick={() => setPage(page - (page - 1) % 4 + 1)} className={page == page - (page - 1) % 4 + 1 ? 'number-cont-active' : 'number-cont'}><p>{page - (page - 1) % 4 + 1}</p></div> : <div/>}
                    {page - (page - 1) % 4 + 2 <= maxPage ? <div onClick={() => setPage(page - (page - 1) % 4 + 2)} className={page == page - (page - 1) % 4 + 2 ? 'number-cont-active' : 'number-cont'}><p>{page - (page - 1) % 4 + 2}</p></div> : <div/>}
                    {page - (page - 1) % 4 + 3 <= maxPage ? <div onClick={() => setPage(page - (page - 1) % 4 + 3)} className={page == page - (page - 1) % 4 + 3 ? 'number-cont-active' : 'number-cont'}><p>{page - (page - 1) % 4 + 3}</p></div> : <div/>}
                    <img onClick={() => nextPage()} className='number-cont' src={rightArrow}></img>
                    <img onClick={() => maxPageFunc()}className='number-cont' src={rightDoubleArrow}></img>
               </div>

          </div>
     );
};
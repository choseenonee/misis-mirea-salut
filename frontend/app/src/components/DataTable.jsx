import React, { useEffect, useState } from 'react';
import "../styles/DataTable.css"

import redCross from "../assets/icons/redCross.svg"
import grayPlus from "../assets/icons/grayPlus.svg"
import { useSearchParams } from 'react-router-dom';
import undo from '../assets/icons/undo.svg'

function DataTable({ data, changes, setChanges, deleted, setDeleted, added, setAdded, page }) {
  const [dataa, setData] = useState([]);
  useEffect(() => {
    var newData = data;
    for (let i = 0; i < data.length; i++){
      for (let j = 0; j < changes.length; j++) {
        if (changes[j]["microcategory_id"] == data[i]["microcategory_id"] && changes[j]["region_id"] == data[i]["region_id"]) newData[i]["price"] = changes[j]["newPrice"];
      }
    }
    
    setData(newData);
  }, [data, added]);

  function changePrice(key, value) {
    var flag = false;
    var newChanges = changes;
    for (let i = 0; i < changes.length; i++) {
      if (data[key]["microcategory_id"] == changes[i]["microcategory_id"] && data[key]["region_id"] == changes[i]["region_id"]) {
          newChanges[i]['newPrice'] = value;
        flag = true;
      }
    }
    if (!flag) {
      newChanges.push({"microcategory_id": data[key]["microcategory_id"], "region_id": data[key]["region_id"], "oldPrice": data[key]["price"], 'newPrice': value});
    }
    newChanges = newChanges.filter(item => item["oldPrice"] != parseInt(value));
    setChanges(newChanges);

    var newData = [...dataa];
    newData[key]['price'] = value;
    setData(newData);    
  }

  function handleUndo(key) {
    for (let i = 0; i < changes.length; i++) {
      if (data[key]["microcategory_id"] == changes[i]["microcategory_id"] && data[key]["region_id"] == changes[i]["region_id"]) {
        changePrice(key, changes[i]['oldPrice']);
      }
    }
  }

  function handleDelete(key) {
    setDeleted(oldDeleted => [...oldDeleted, {"microcategory_id": data[key]["microcategory_id"], "region_id": data[key]["region_id"], "price": data[key]["price"]}])
  }

  function handleAddBack(key) {
    var newDeleted = deleted;
    console.log("???", data[key]["microcategory_id"], deleted[0]["microcategory_id"], data[key]["microcategory_id"] == deleted[0]["microcategory_id"]);
    newDeleted = newDeleted.filter(item => item["microcategory_id"] != data[key]["microcategory_id"] || item["region_id"] != data[key]["region_id"]);
    setDeleted(newDeleted);
  }

  function changeAdded(key, value, meta) {
    // console.log('bruh', key, value, meta, added)
    var newAdded = [...added];
    newAdded[key][meta] = value;
    setAdded(newAdded);
  }

  function deleteAdded(key) {
    setAdded(added.filter(item => item["id"] != key));
  }


  return (
    <div>
      {/* <h1>{data[0]["price"]}</h1> */}
        {added.filter(item => item["page"] == page).map((item, key) => (
          <div className='raw-table-added' style={{"backgroundColor":"#D1E7DD"}}>
            <div className='input-div-added'><input type='number' value={item["microcategory_id"]}  onChange={e => changeAdded(key, e.target.value, 'microcategory_id')} className='data-input'></input></div>
            <div className='input-div-added'><input type='number' value={item["region_id"]}  onChange={e => changeAdded(key, e.target.value, 'region_id')} className='data-input'></input></div>

            <div className='input-div new-input'><input type='number' value={item["price"]}  onChange={e => changeAdded(key, e.target.value, 'price')} className='data-input'></input></div>
            <div style={{"width": 29}}/>
            <div className='icons-div'>
              <img onClick={() => deleteAdded(item["id"])} src={redCross} className='crosses-img'></img>
            </div>
        </div>
        ))}
        {dataa.map((item, key) => (
          <div className='raw-table' style={{"backgroundColor": deleted.filter((item1) => item["microcategory_id"] == item1["microcategory_id"] && item["region_id"] == item1["region_id"]).length >= 1 ? "#f7d6e6" : changes.filter((item1) => item["microcategory_id"] == item1["microcategory_id"] && item["region_id"] == item1["region_id"]).length >= 1 ? "#FFF3CD"  : ""}}>
              <p>{item["microcategory_id"]}</p>
              <p>{item["region_id"]}</p>

              <div className='input-div'><input type='number' value={item["price"]}  onChange={e => deleted.filter((item1) => item["microcategory_id"] == item1["microcategory_id"] && item["region_id"] == item1["region_id"]).length >= 1 ? () => {} : changePrice(key, e.target.value)} className='data-input'></input></div>
              {changes.filter((item1) => item["microcategory_id"] == item1["microcategory_id"] && item["region_id"] == item1["region_id"]).length >= 1 ? <img onClick={() => handleUndo(key)} className='crosses-img' src={undo}/> : <div style={{"width": 29}}/>}
              {/* <div className='empty-div'></div> */}
              <div className='icons-div'>
                <img onClick={() => deleted.filter((item1) => item["microcategory_id"] == item1["microcategory_id"] && item["region_id"] == item1["region_id"]).length >= 1 ? handleAddBack(key) : handleDelete(key)} src={deleted.filter((item1) => item["microcategory_id"] == item1["microcategory_id"] && item["region_id"] == item1["region_id"]).length >= 1 ? undo : redCross} className='crosses-img'></img>
              </div>
          </div>
        ))}
    </div>
  );
}

export default DataTable;
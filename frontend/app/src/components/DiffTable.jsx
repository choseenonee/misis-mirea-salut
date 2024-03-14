import React from 'react';
import "../styles/DiffTable.css"

import redCross from "../assets/icons/redCross.svg"
import grayPlus from "../assets/icons/grayPlus.svg"

function DiffTable({ data, type }) {
  return (
    <div>
        {data.map((item) => (
          <div className='raw' style={{"backgroundColor": item["oldPrice"] == 0  ? "#D1E7DD" : item["newPrice"] == 0 ? "#f7d6e6" : "#FFF3CD"}}>
              <p>{!(item["newPrice"] == 0 && type == 'new' || item["oldPrice"] == 0 && type == 'old') ? item["microcategory_id"] : ""}</p>
              <p>{!(item["newPrice"] == 0 && type == 'new' || item["oldPrice"] == 0 && type == 'old') ? item["region_id"] : ""}</p>

              {/* <div className='diff-input-div'> */}
                <p style={{"paddingLeft": 120, "color": "#000"}}>{item["newPrice"] == 0 && type == "new" ? "" : item["oldPrice"] == 0 && type == "old" ? "" : type == "new" ? item["newPrice"] : item["oldPrice"]} </p>
              {/* </div> */}

              <div className='note-div'>
                <p className='note'>ред.</p>
              </div>
          
          </div>
          
        ))}


    </div>
  );
}

export default DiffTable;
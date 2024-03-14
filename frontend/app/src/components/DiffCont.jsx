import React, {useState} from 'react';
import "../styles/DiffCont.css"

import bruh from "../data/matrix-mock.json"
import DiffTable from './DiffTable';

import redArrow from "../assets/icons/redArrow.svg"
import leftDoubleArrow from "../assets/icons/leftDoubleArrow.svg"
import leftArrow from "../assets/icons/leftArrow.svg"
import rightArrow from "../assets/icons/rightArrow.svg"
import rightDoubleArrow from "../assets/icons/rightDoubleArrow.svg"

function DiffCont({data}) {

  const [isChangesOnly, setIsChangesOnly] = useState(false)
  const [isSort1, setIsSort1] = useState(false)
  const [isSort2, setIsSort2] = useState(false)

  return (
    <div className='diff-cont'>
       <div className='tables'>
          <div className='table-before'>
                <div className='column-names'>
                  <p>id 1</p>
                  <p>id 2</p>
                  <p>id price</p>
                </div>

                <div className='data-diff'>
                    <DiffTable data={data} type="old"></DiffTable>
                </div>

                
            

          </div>

          <img src={redArrow}></img>

          <div className='table-after'>
                <div className='column-names'>
                  <p>id 1</p>
                  <p>id 2</p>
                  <p>id price</p>
                </div>

                <div className='data-diff'>
                    <DiffTable data={data} type="new"></DiffTable>
                </div>
                
                
          </div>
      </div>

     
       
    </div>
  );
}

export default DiffCont;
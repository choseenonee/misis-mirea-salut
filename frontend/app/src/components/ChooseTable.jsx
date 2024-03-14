import React, {useState} from 'react';
import "../styles/ChooseTable.css"
import Dropdown from './reusable/Dropdown';

import selectarrow from "../assets/icons/selectarrow.svg"


function ChooseTable({filename1, setFilename1, filename2, setFilename2, version1, setVersion1, version2, setVersion2, isOpen, setIsOpen, labels1, labels2, labels3}) {


  const [dateBefore, setDateBefore] = useState('11.09.2001')
  const [dateAfter, setDateAfter] = useState('11.09.2001')

  console.log('check', filename1, filename2, version1, version2)


  return (
    <div className='choose-table-cont'>
       <div className='head-line'>
        <p className='change-label'>Редактирование таблицы</p>
        
        
        {/* <div className='change-button'><p>Изменить таблицу</p></div> */}
       </div>
       

       <div className='bottom-cont'>
            <div className='date-choose-form'>
            <div className='for-z-index'>
            <Dropdown id={1} label={"Выберите таблицу"} selectedOption={filename1} setSelectedOption={setFilename1} isOpen={isOpen} setIsOpen={setIsOpen} labels={labels1} />
            </div>
                <div className='arrow-with-label'>
                    <p className='upper-label'><strong>Состояние на </strong></p>
                    <Dropdown id={3} label={"Выберите таблицу"} selectedOption={version1} setSelectedOption={setVersion1} isOpen={isOpen} setIsOpen={setIsOpen} labels={labels2} />
                </div>
            </div>

            <div className='date-choose-form'>
            <div className='for-z-index'>
            <Dropdown id={2} label={"Выберите таблицу"} selectedOption={filename2} setSelectedOption={setFilename2} isOpen={isOpen} setIsOpen={setIsOpen} labels={labels1} />
             </div>
              <div className='arrow-with-label'>
                  <p className='upper-label'><strong>Состояние на </strong></p>
                  <Dropdown id={4} label={"Выберите таблицу"} selectedOption={version2} setSelectedOption={setVersion2} isOpen={isOpen} setIsOpen={setIsOpen} labels={labels3} />
              </div>
            </div>

       </div>
    </div>
  );
}

export default ChooseTable;
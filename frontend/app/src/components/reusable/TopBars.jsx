import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import "../../styles/TopBars.css";
import loop from '../../assets/icons/search.svg'
import person from '../../assets/icons/person-fill.svg'



export const TopBars = ({AccountName}) => {

      let navigate = useNavigate();
      function handlePageProfile() {
            navigate("/profile")
      }

     return (
          <div className='top-bars'>
                                
                <div className='form-2'>
                      {/* value={value}  onChange={(e) => handleClickLogin(e.target.value)}*/}
                      <input  className='search' placeholder="Поиск"/>
                      <img src={loop}/>
                </div>

                <div className='form-2' onClick={handlePageProfile} style={{cursor:"pointer"}}>
                      <div className='profile-button'><p>{AccountName}</p></div>
                      <img src={person}/>
                </div>
          
          </div>
     );
};
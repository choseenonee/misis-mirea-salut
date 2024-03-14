import React, { useEffect, useState } from "react";

import "../styles/ProfileEdit.css";
import loop from '../assets/icons/search.svg'
import person from '../assets/icons/person-fill.svg'

import profileLine1 from '../assets/icons/profileLine1.svg'
import profileLine2 from '../assets/icons/profileLine2.svg'
import profileLine3 from '../assets/icons/profileLine3.svg'
import profileLine4 from '../assets/icons/profileLine4.svg'

import avatar from "../assets/icons/i.webp"

import logo from "../assets/icons/logoAvito.svg"

export const ProfileEdit = ({AccountName}) => {


     return (
          <div className='profile-edit'>
                  <p className="profile-edit-label">Редактирование профиля</p>
                <div className="name-surname">
                    <div className="name-form">
                      <p>Имя</p>
                      <input className="input-form" value={"Василий"}></input>
                    </div>

                    <div className="name-form">
                      <p>Фамилия</p>
                      <input className="input-form" value={"Иванов"}></input>
                    </div>
                </div>

               <div className="date-of-birth">
                    <p>Дата рождения</p>
                    <p>12.08.2006</p>
               </div>

              <div className="other-stuff">
                  <div className="name-form">
                          <p>Телефон</p>
                          <input className="input-form" value={"8 (952) 812 88-69"}></input>
                    </div>
                    <div className="name-form">
                          <p>Город</p>
                          <input className="input-form" value={"Иваново"}></input>
                        </div>
                    

              </div>
              <div className="name-form" style={{marginLeft: "15px"}}>
                          <p>Должность</p>
                          <input className="input-form" value={"уборщик в кабинете аналитиков"} style={{width:"95%"}}></input>
              </div>

              <img className="logotip" src={logo} />
          </div>
     );
};
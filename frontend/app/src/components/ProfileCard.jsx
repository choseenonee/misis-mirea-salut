import React, { useEffect, useState } from "react";

import "../styles/ProfileCard.css";
import loop from '../assets/icons/search.svg'
import person from '../assets/icons/person-fill.svg'

import profileLine1 from '../assets/icons/profileLine1.svg'
import profileLine2 from '../assets/icons/profileLine2.svg'
import profileLine3 from '../assets/icons/profileLine3.svg'
import profileLine4 from '../assets/icons/profileLine4.svg'

import avatar from "../assets/icons/i.webp"


export const ProfileCard = ({AccountName}) => {


     return (
          <div className='profile-card'>
                  <div className="avatar">
                    <img src={profileLine1} className="profile-color-line" style={{top:'50px'}}/>
                    <img src={profileLine2} className="profile-color-line" style={{top:'60px'}}/>
                    <img src={profileLine3} className="profile-color-line" style={{top:'70px'}}/>
                    <img src={profileLine4} className="profile-color-line" style={{top:'80px'}}/>

                    <div className="avatar-cont">
                        <img src={avatar} className="avatar-photo"></img>
                    </div>
                    
                  </div>

                  <div className="account-name-cont">
                    <p className="profile-account-name">{AccountName}</p>
                    <p>аналитик Авито</p>
                  </div>

                  <div className="profile-cart-cont">
                    <div className="profile-raw">
                      <p className="profile-chart">Полное имя</p>
                      <p>Василий Иванов</p>
                    </div>

                    <div className="profile-raw">
                      <p className="profile-chart">Дата рождения</p>
                      <p>12.08.2006, 17 лет</p>
                    </div>

                    <div className="profile-raw">
                      <p className="profile-chart">Телефон</p>
                      <p>8 (952) 812 88-69</p>
                    </div>

                    <div className="profile-raw">
                      <p className="profile-chart">Город</p>
                      <p>Иваново</p>
                    </div>

                    <div className="profile-raw">
                      <p className="profile-chart">Должность</p>
                      <p>уборщик в кабинете аналитиков</p>
                    </div>
                  </div>
                
          </div>
     );
};
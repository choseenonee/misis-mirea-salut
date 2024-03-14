import React from "react";
import { useNavigate } from "react-router-dom";

import "../styles/MainGrid.css";

import pinkLine from '../assets/icons/pinkLine.svg'
import bigFile from '../assets/icons/bigFile.svg'
import purple from '../assets/icons/purple.svg'
import greenLine from '../assets/icons/greenLine.svg'
import bigBar from '../assets/icons/bigBar.svg'
import green from '../assets/icons/green.svg'
import redLine from '../assets/icons/redLine.svg'
import bigChange from '../assets/icons/bigChange.svg'
import red from '../assets/icons/red.svg'
import blueLine from '../assets/icons/blueLine.svg'
import bigServer from '../assets/icons/bigServer.svg'
import blue from '../assets/icons/blue.svg'
import ShowDiffPage from "./ShowDiffPage";


export const MainGrid = () => {
  let navigate = useNavigate();
  function handleLogout() {
    navigate('/login');
}
  function handleTablePage(e) {
    navigate('/tables');
  }

  function handleMarketingPage(e) {
    navigate('/marketing');
  }

  function handleShowDiffPage(e) {
    navigate('/showdiff');
  }


  function handleMainPage(e) {
    navigate('/');
  }


  return (
    <div className='main-grid'>

            <div className='grid-conteiner' onClick={handleTablePage}>
              <div className='text-conteiner'>
                  <h2>ФАЙЛЫ</h2>
                  <img src={pinkLine}/>
                  <h3>редактирование таблиц с данными о ценах в рамках категорий</h3>
              </div>
              <img  className="grid-icon" src={bigFile}/>
              <img className='color-icon' src={purple}/>
            </div>

            <div className='grid-conteiner' onClick={handleMarketingPage}>
              <div className='text-conteiner'>
                  <h2>МАРКЕТИНГ</h2>
                  <img src={greenLine}/>
                  <h3>графики анализа данных по локациям и категориям</h3>
              </div>
              <img  className="grid-icon" src={bigBar}/>
              <img className='color-icon' src={green}/>
            </div>

            <div className='grid-conteiner' onClick={handleShowDiffPage}>
              <div className='text-conteiner'>
                  <h2>ИЗМЕНЕНИЯ</h2>
                  <img src={redLine}/>
                  <h3>история правок в таблицах с ценами по датам</h3>
              </div>
              <img  className="grid-icon" src={bigChange}/>
              <img className='color-icon' src={red}/>
            </div>

            <div className='grid-conteiner' onClick={() => window.open("http://81.200.152.232:16686/search")}>
              <div className='text-conteiner'>
                  <h2>СЕРВЕР</h2>
                  <img src={blueLine}/>
                  <h3>скорость передачи данных, анализ производительности </h3>
              </div>
              <img  className="grid-icon" src={bigServer}/>
              <img className='color-icon' src={blue}/>
            </div>
            

          </div>
  );
};

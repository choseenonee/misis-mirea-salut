import React from 'react';
import { useState } from 'react';
// import '../styles/ServerPage.css';

import { SidePanel } from './reusable/SidePanel';
import { PopUp } from './PopUp';

import redWideLine1 from '../assets/icons/redWideLine1.svg'
import redWideLine2 from '../assets/icons/redWideLine2.svg'

import { TopBars } from './reusable/TopBars';

import loop from '../assets/icons/search.svg'
import person from '../assets/icons/person-fill.svg'

function ServerPage() {
    const AccountName = 'vdmk'
    
    return(
        <div className='server-page'>
                <img src={redWideLine1} className='wide-line-1'></img>
                <img src={redWideLine2} className='wide-line-2'></img>
                
                <SidePanel pageState="server-page"> </SidePanel>

                <div className='right-side'>

                    <div className='header'>
                        <h2>СЕРВЕР</h2>
                        <TopBars AccountName={AccountName}/>
                    </div>

                    <div className='components'>
                        
                    </div>
                    {/* <PopUp/> */}
                </div>

                <div className='title-of-winners'>
                    <strong> Avito </strong>  x <strong> MISIS </strong> x <strong> MIREA </strong>
                </div>

            
        </div>
    );
}

export default ServerPage;
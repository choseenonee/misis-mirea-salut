import React from 'react';
import { useState } from 'react';
import '../styles/ProfilePage.css';

import { SidePanel } from './reusable/SidePanel';

import grayWideLine from '../assets/icons/grayWideLine.svg'

import loop from '../assets/icons/search.svg'
import person from '../assets/icons/person-fill.svg'

import { TopBars } from './reusable/TopBars';
import { ProfileCard } from './ProfileCard';
import { ProfileEdit } from './ProfileEdit';



function ProfilePage() {


    const AccountName = 'vdmk'
    return(
        <div className='table-page'>
                <img src={grayWideLine} className='wide-line-1'></img>
                
                <SidePanel pageState=""> </SidePanel>

                <div className='right-side'>

                    <div className='header'>
                        <h2>ПРОФИЛЬ</h2>
                        <TopBars AccountName={AccountName}/>
                    </div>

                    <div className='components'>
                       <ProfileCard AccountName={AccountName}/>
                       <ProfileEdit/>
                    </div>
                </div>

                <div className='title-of-winners'>
                    <strong> Avito </strong>  x <strong> MISIS </strong> x <strong> MIREA </strong>
                </div>

            
        </div>
    );
}

export default ProfilePage;
import React from 'react';

import '../assets/css/main.css';
import '../assets/css/default.css';
import '../assets/css/useractions.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
/* import 'font-awesome/css/font-awesome.min.css'; */

import Tooltip from './Tooltip';

import { BsShareFill, BsFillSendFill, BsFacebook, BsInstagram, BsTwitter, BsYoutube, BsWhatsapp, BsSkype, BsHeadset } from "react-icons/bs";


function UserActions() {
    return (
        <div className="UserActions p-4">
            <h4 className='text-start'>
                Compartilhar:
            </h4>
            <div className="sharethis-inline-share-buttons st-left st-has-labels  st-inline-share-buttons st-animated" id="st-1">
                <div className="st-btn st-first" data-network="facebook" >
                    <img alt="facebook sharing button" src="https://platform-cdn.sharethis.com/img/facebook.svg" />
                    <span className="st-label">Share</span>
                </div>
                <div className="st-btn" data-network="twitter" >
                    <img alt="twitter sharing button" src="https://platform-cdn.sharethis.com/img/twitter.svg" />
                    <span className="st-label">Tweet</span>
                </div>
                <div className="st-btn" data-network="email" >
                    <img alt="email sharing button" src="https://platform-cdn.sharethis.com/img/email.svg" />
                    <span className="st-label">Email</span>
                </div>
                <div className="st-btn" data-network="whatsapp" >
                    <img alt="whatsapp sharing button" src="https://platform-cdn.sharethis.com/img/whatsapp.svg" />
                    <span className="st-label">Whatsapp</span>
                </div>
                <div className="st-btn st-last" data-network="sharethis" >
                    <img alt="sharethis sharing button" src="https://platform-cdn.sharethis.com/img/sharethis.svg" />
                    <span className="st-label">Share</span>
                </div>
            </div>
        </div>
    );
}

export default UserActions;

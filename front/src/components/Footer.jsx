import React from 'react';
import '../assets/css/main.css';
import { BsFacebook, BsTwitter, BsYoutube } from "react-icons/bs";

function Footer(props) {
    return (
        <div className="Footer">
            <div className='container-fluid h-60 d-flex align-items-center w-100'>
                <div className="row d-flex w-100 justify-content-between">
                    <div className="col-md-4 col-sm-4 col-xs-5 d-flex justify-content-center align-items-center">
                        {/* <ul className="social-icons d-flex"> */}
                        {/* <li> */}<a className="mx-4" data-original-title="facebook" href="https://www.facebook.com/Meucartaoweb-296426777221791/" target="_blank"><BsFacebook /></a>{/* </li> */}
                        {/* <li> */}<a className="mx-4" data-original-title="twitter" href="https://twitter.com/meucartaoweb" target="_blank"><BsTwitter /></a>{/* </li> */}
                        {/* <li> */}<a className="mx-4 youtube" data-original-title="youtube" href="https://www.youtube.com/channel/UCSd23dekVLXs8gNcgE9wvPA" target="_blank"><BsYoutube /></a>{/* </li> */}
                        {/* </ul> */}
                    </div>
                    <div className='col-md-6'>
                        <h6 className='title-footer h-100 d-flex justify-content-center align-items-center'>© Copyright - My Card City - 2015-2024</h6>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Footer;

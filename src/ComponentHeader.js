import React from 'react';
import { NavLink as Link } from "react-router-dom";
import { Remote } from './ComponentRemote';

export class Header extends React.Component {

    render() {
      return (
        <header id="header-page">

          <table>
            <tbody>
              <tr>
                <td><img src="./assets/logo.png" className="logo" alt="Anritsu Logo" />
                  <div className="automizer">AUTOMIZER</div>
                </td>
              </tr>
            </tbody>
          </table>


          <nav>
                    <li><Link activeClassName="navLink" exact to="/"><button>Connection</button></Link></li>
                    <li><Link activeClassName="navLink" to="/pim"><button>PIM Mode</button></Link></li>
                    <li><Link activeClassName="navLink" to="/calibration"><button>Calibration</button></Link></li>
                    <li><Link activeClassName="navLink" to="/scanner"><button>Auto Scan</button></Link></li>
                    <Remote />
                  </nav>
          <hr />
                  
        </header>
      )
    }

    divert(){
      window.location.href = ("/");
    }

}
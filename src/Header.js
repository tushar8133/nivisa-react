import React from 'react';
import { NavLink as Link } from "react-router-dom";
import Remote from './Remote';

class Header extends React.Component {

    render() {
      return (
        <header id="header-page">

          <table>
            <tbody>
              <tr>
                <td><img src="/logo.png" className="logo" alt="Anritsu Logo" /></td>
                <td><h2>Anritsu PIM Analyzer Automation</h2>
                  </td>
              </tr>
            </tbody>
          </table>


          <nav>
                    <li><Link activeClassName="navLink" exact to="/"><button>Connection</button></Link></li>
                    <li><Link activeClassName="navLink" to="/pim"><button>PIM Mode</button></Link></li>
                    <li><Link activeClassName="navLink" to="/command"><button>Calibration</button></Link></li>
                    <li><Link activeClassName="navLink" to="/autotest"><button>Auto Test</button></Link></li>
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

export default Header;

import React, { Component } from 'react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import '../styles/header.css';

class Header extends Component {
  state = {
    categories: [{id:1, title:"portrait", path:"portrait"}, {id:2, title:"architecture", path:"architecture"},{id:3, title:"black and white", path:"black-and-white"}]
  }
  render() {
    const categories = this.state.categories;
    return (
      <Router>
        <nav className="navbar navbar-default">
            <div className="container-fluid">
                <div className="navbar-header">
                    <a className="navbar-brand" href="#"></a>
                </div>
                <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    <ul className="nav navbar-nav">

                        <li><Link to="/">Home</Link></li>
                        {categories.map(category =>(
                          <li><Link to={`/${category.path}`}>{category.title}</Link></li>
                        ))}

                    </ul>
                </div>
            </div>
        </nav>
      </Router>
    );
  }
}

export default Header;

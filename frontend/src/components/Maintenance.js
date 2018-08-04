import React from 'react';
import loading from '../images/loading.gif';
import '../styles/maintenance.css';

const Maintenance = () => {

  return (
    <div className="maintenance__container">
      <h1 className="maintenance__title">Website in maintenance</h1>
      <img className="maintenance__image" src={loading} alt="Website in maintenance"/>
      <h2>Stay tuned on social medias</h2>
    </div>
  );

}
export default Maintenance;

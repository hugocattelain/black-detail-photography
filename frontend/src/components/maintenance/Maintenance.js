import React from 'react';
import gif_1 from '../../assets/videos/maintenance_1.mp4';
import gif_2 from '../../assets/videos/maintenance_2.mp4';
import gif_3 from '../../assets/videos/maintenance_3.mp4';
import './maintenance.css';

const Maintenance = ({ safeMode }) => {
  const gifList = [gif_1, gif_2, gif_3];
  const index = Math.round(Math.random() * 2);
  const gif = gifList[index];
  return (
    <div className="maintenance__container">
      <h1 className="maintenance__title">Website in maintenance</h1>
      <h2>Stay tuned on social medias</h2>
      <a
        href="https://www.instagram.com/blck.dtl/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="social__item instagram" />
      </a>
      <a
        href="https://www.facebook.com/blck.dtl/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="social__item facebook" />
      </a>
      <a
        href="https://www.eyeem.com/u/blck_dtl"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="social__item eyeem" />
      </a>
      {safeMode ? (
        <img
          src="https://res.cloudinary.com/blackdetail/image/upload/v1533382333/fine-art-nude/za8lknfkbqnjoxqoshgb.jpg"
          alt="Maintenance Background"
        />
      ) : (
        <video loop autoPlay muted src={gif} type="video/mp4">
          Your browser does not support video
        </video>
      )}
    </div>
  );
};
export default Maintenance;

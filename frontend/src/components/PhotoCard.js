import React, { Component } from 'react';
import PropTypes from 'prop-types';


class PhotoCard extends Component {

	render() {
		return (
			<div>
				<h2>{this.props.data.heading}</h2>
				<p>{this.props.data.text}</p>
			</div>
		);
	}
}

PhotoCard.propTypes = {
  data: PropTypes.object
};

export default PhotoCard;

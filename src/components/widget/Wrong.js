import React from 'react';
import l from './Wrong.less'
export default class Wrong extends React.Component {
	
	render() {
		return (
			<div className={l.wBox}>
				something is wrong!!!
			</div>
		);
	}
}

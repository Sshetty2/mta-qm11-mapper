import React, {useEffect, useState, useCallback} from 'react';

import GoogleMapReact from 'google-map-react';

// import {Select, MenuItem} from '@material-ui/core';
// import {makeStyles} from '@material-ui/core/styles';

const Marker = ({text, direction}) => (
	<div
		style={{
			color: 'white',
			background: direction === '0' ? '#e26d40' : 'green',
			padding: '5px 5px',
			display: 'inline-flex',
			textAlign: 'center',
			alignItems: 'center',
			justifyContent: 'center',
			borderRadius: '100%',
			transform: 'translate(-50%, -80%)',
			WebkitBoxShadow: '0px 10px 13px -7px #000000, inset -23px -16px 4px -6px rgba(0,0,0,0)',
			boxShadow: '0px 10px 13px -7px #000000, inset -23px -16px 4px -6px rgba(0,0,0,0)'
		}}>
		{text}
	</div>
);

// const useStyles = makeStyles(() => ({
// 	selectStyle: {
// 		bottom: '200px',
// 		left: '200px',
// 		fontWeight: 'bold',
// 		textShadow: '-1px -1px 6px rgba(150, 150, 150, 1)',
// 		color: '#446299',
// 		fontSize: '20px'
// 	}
// }));

function App() {
	// const classes = useStyles();
	const [vehicleActivity, setVehicleActivity] = useState([]);

	// const [age, setAge] = useState(10);

	const defaultProps = {
		center: {
			lat: 40.71641,
			lng: -73.84363
		},
		zoom: 13
	};

	const prefix = 'MTABC_'
	const line = 'QM11';
	const direction = '0';
	//seconds
	const refreshInterval = 15;

	const fetchMtaData = async query => {
		const response = await fetch(query);

		const json = await response.json();

		const {
			Siri: {
				ServiceDelivery: {VehicleMonitoringDelivery}
			}
		} = json;
		const vehicleActivity = VehicleMonitoringDelivery[0].VehicleActivity;
		console.log({vehicleActivity});
		setVehicleActivity(vehicleActivity);
	};

	useEffect(() => {
		// fetchMtaData(
		// 	`/api/siri/vehicle-monitoring.json?key=${process.env.REACT_APP_MTA_API_KEY}`
		// );
			fetchMtaData(
        // `${process.env.REACT_APP_SERVER_ENDPOINT_ADDRESS}/getOneLine?line=${line}`
        `https://bustime.mta.info/api/siri/vehicle-monitoring.json?key=91158df9-bfc7-4575-8718-c35327c901a3&LineRef=${prefix}${line}`
      );

		setInterval(() => {
			fetchMtaData(
        // `${process.env.REACT_APP_SERVER_ENDPOINT_ADDRESS}/getOneLine?line=${line}`
        `https://bustime.mta.info/api/siri/vehicle-monitoring.json?key=91158df9-bfc7-4575-8718-c35327c901a3&LineRef=${prefix}${line}`
      );
		}, refreshInterval * 1000);
	}, []);

	// const handleChange = event => {
	// 	console.log(event.target.value);
	// 	setAge(event.target.value);
	// };

	const renderMarkers = useCallback(
		() =>
			vehicleActivity.map(
				(
					{
						MonitoredVehicleJourney: {
							VehicleLocation: {Latitude: latitude, Longitude: longitude},
							DirectionRef: direction
						}
					},
					idx
				) => <Marker key={idx} lat={latitude} lng={longitude} text={line} direction={direction} />
			),
		[vehicleActivity, line]
	);
	return (
		<div style={{height: '100vh', width: '100%'}}>
			<GoogleMapReact
				bootstrapURLKeys={{key: `${process.env.REACT_APP_GOOGLE_API_KEY}`}}
				defaultCenter={defaultProps.center}
				defaultZoom={defaultProps.zoom}>
				{vehicleActivity && renderMarkers()}
			</GoogleMapReact>
			{/* <Select
				className={classes.selectStyle}
				labelId='demo-simple-select-label'
				id='demo-simple-select'
				value={age}
				disableUnderline
				onChange={handleChange}>
				<MenuItem value={10}>Ten</MenuItem>
				<MenuItem value={20}>Twenty</MenuItem>
				<MenuItem value={30}>Thirty</MenuItem>
			</Select> */}
		</div>
	);
}

export default App;

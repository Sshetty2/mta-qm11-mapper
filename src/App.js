import React, {useEffect, useState, useCallback} from 'react';
import GoogleMapReact from 'google-map-react';

const Marker = ({text}) => (
	<div
		style={{
			color: 'white',
			background: '#e26d40',
			padding: '5px 5px',
			display: 'inline-flex',
			textAlign: 'center',
			alignItems: 'center',
			justifyContent: 'center',
			borderRadius: '100%',
			transform: 'translate(-50%, -80%)',
			WebkitBoxShadow:"0px 10px 13px -7px #000000, inset -23px -16px 4px -6px rgba(0,0,0,0)",
			boxShadow:"0px 10px 13px -7px #000000, inset -23px -16px 4px -6px rgba(0,0,0,0)"
		}}>
		{text}
	</div>
);

function App() {
	const [vehicleActivity, setVehicleActivity] = useState([]);

	const defaultProps = {
		center: {
			lat: 40.71641,
			lng: -73.84363
		},
		zoom: 13
	};

	const line = 'Q60';
	const direction = '1';
	//seconds
	const refreshInterval = 1.5;

	const fetchMtaData = async () => {
		const response = await fetch(
			`/api/siri/vehicle-monitoring.json?key=${process.env.REACT_APP_MTA_API_KEY}&LineRef=MTABC_Q60&DirectionRef=${direction}`
		);

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
		fetchMtaData();
		setInterval(() => {
			fetchMtaData();
		}, refreshInterval * 1000);
	}, []);

	const renderMarkers = useCallback(
		() =>
			vehicleActivity.map(
				(
					{
						MonitoredVehicleJourney: {
							VehicleLocation: {Latitude: latitude, Longitude: longitude}
						}
					},
					idx
				) => <Marker key={idx} lat={latitude} lng={longitude} text={line} />
			),
		[vehicleActivity, line]
	);
	return (
		// Important! Always set the container height explicitly
		<div style={{height: '100vh', width: '100%'}}>
			<GoogleMapReact
				bootstrapURLKeys={{key: `${process.env.REACT_APP_GOOGLE_API_KEY}`}}
				defaultCenter={defaultProps.center}
				defaultZoom={defaultProps.zoom}>
				{vehicleActivity && renderMarkers()}
			</GoogleMapReact>
		</div>
	);
}

export default App;

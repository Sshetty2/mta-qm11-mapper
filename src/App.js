import React, {useEffect, useState} from 'react';
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({text}) => (
	<div
		style={{
			color: 'white',
			background: 'grey',
			padding: '15px 10px',
			display: 'inline-flex',
			textAlign: 'center',
			alignItems: 'center',
			justifyContent: 'center',
			borderRadius: '100%',
			transform: 'translate(-50%, -50%)'
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

	const fetchMtaData = async () => {
		const response = await fetch(
			`/api/siri/vehicle-monitoring.json?key=${process.env.REACT_APP_MTA_API_KEY}&LineRef=MTABC_QM11`
		);

		const json = await response.json();

		const {
			Siri: {
				ServiceDelivery: {VehicleMonitoringDelivery}
			}
		} = json;
		const vehicleActivity = VehicleMonitoringDelivery[0].VehicleActivity;
		console.log(vehicleActivity);
		setVehicleActivity(vehicleActivity);
	};

	useEffect(() => {
		fetchMtaData();
	}, []);

	return (
		// Important! Always set the container height explicitly
		<div style={{height: '100vh', width: '100%'}}>
			<GoogleMapReact
				bootstrapURLKeys={{key: `${process.env.REACT_APP_GOOGLE_API_KEY}`}}
				defaultCenter={defaultProps.center}
				defaultZoom={defaultProps.zoom}>
				{vehicleActivity &&
					vehicleActivity.map(({MonitoredVehicleJourney: {VehicleLocation: {Latitude, Longitude}}}, idx) => (
						<AnyReactComponent key={idx} lat={Latitude} lng={Longitude} text='My Marker' />
					))}
			</GoogleMapReact>
		</div>
	);
}

export default App;

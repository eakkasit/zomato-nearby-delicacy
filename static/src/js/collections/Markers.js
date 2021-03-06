
// import ko from 'knockout';

export class Markers {

	// Data about each marker
	points= [];


	constructor(map) {
		this._map= map;
	}

	// Wrapper to addMarker in GoogleMaps
	addMarker(data) {

		this.points.push(data);

		const marker= this._map.addMarker({
			title: data.title,
			position: {
				lat: data.location.latitude*1,
				lng: data.location.longitude*1,
			}
		}, {
			strokeColor: '#' + data.ratings.rating_color
		});

		this.addMarkerWindow(data, marker);
	}


	/**
	 * Create a infoWindow for a marker
	 * 
	 * @param {Object} data    The data to render into the content template
	 * @param {Marker} marker  The map marker
	 */
	addMarkerWindow(data, marker) {

		const infoWindow= this._map.window(this.getContent(data));

		marker._infoWindow= infoWindow;

		// When you click the marker
		marker.addListener('click', () => this.markerClickHandler(marker));
	}


	/**
	 * Marker click handler
	 */
	markerClickHandler(marker) {

		marker.setAnimation(this._map.ANIMATIONS.BOUNCE);

		this._displayWindow(marker);

		setTimeout(() => marker.setAnimation(null), 1000);
	}


	_displayWindow(marker) {

		// Hide all other infoWindows
		this._map.markers
			.forEach( marker => marker._infoWindow.close());

		// Show this one
		marker._infoWindow.open(this._map._map, marker);
	}


	/**
	 * Render the data into the template string
	 * 
	 * @param  {Object} data  The data
	 * 
	 * @return {String}       Template content
	 */
	getContent(data) {

		return `
			<div class='info-window'>
				<div class='info-window__title'>${data.title}</div>
				<div class='info-window__address'>${data.location.address}</div>
				<div class='info-window__ratings' style='color: #${data.ratings.rating_color};'>
					<span class='rating-label'>${data.ratings.rating_text}</span>
					<span class='rating-score'>${data.ratings.aggregate_rating}</span>
				</div>
				<div class='info-window__img'>
					<img src='${data.image}' alt='${data.title}' />
				</div>
				<div class='info-window__menu'>
					<a href='${data.menu}' target='_parent _blank' rel='noopener'>Go To Menu</a>
				</div>
			</div>
		`;
	}


	// Remove a marker
	removeMarker(index) {
		this.points.splice(index, 1);
	}


	getMarker(index) {
		return this._map.markers[index];
	}

	// Hide a marker
	hideMarker(index) {
		this._map.hideMarker(index);
	}

	// Show a hidden marker
	showMarker(index) {
		this._map.showMarker(index);
	}

	showWindow(index) {

		const marker= this._map.markers[index];

		this._displayWindow(marker);
	}

	// Fit to bounds
	fitMarkers() {
		this._map.fitMarkers();
	}
}

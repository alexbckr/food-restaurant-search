import React from "react";
import mapboxgl from "mapbox-gl";

export default class MapComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: 10,
      lat: 11,
      userLat: 0,
      userLng: 0,
      zoom: 3,
      mapVar: null,
      markers: []
    };
  }

  componentDidUpdate() {
    //drops a marker when the user clicks locate on a new restaurant card,
    //given that props isn't null or undefined
    if (this.props.restaurant !== null && this.props.restaurant !== undefined) {
      //checks if restaurants are the same
      if (this.props.restaurant !== this.state.restaurant) {
        //fly to the restaurant
        this.setState({ restaurant: this.props.restaurant });
        this.state.mapVar.flyTo({
          center: [
            this.props.restaurant.coordinates.longitude,
            this.props.restaurant.coordinates.latitude
          ],
          essential: true,
          zoom: 15
        });
        //drop a marker on the restaurant
        this.dropMarker(this.props.restaurant);
      }
    }

    //sets up the user's marker, given that it hasn't already been set up
    if (this.props.lat !== this.state.userLat) {
      this.setState({ userLat: this.props.lat, userLng: this.props.lng });
      this.state.mapVar.flyTo({
        center: [this.props.lng, this.props.lat],
        essential: true,
        zoom: 15
      });
      this.setUserMarker();
    }
  }

  /*
  drops a blue marker at the user's location
  */
  setUserMarker() {
    var el = document.createElement("div");
    el.className = "user-marker";
    // make a marker for each feature and add to the map
    new mapboxgl.Marker(el)
      .setLngLat([this.props.lng, this.props.lat])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }) // add popups
          .setHTML("<h3><strong>You are here</strong></h3>")
      )
      .addTo(this.state.mapVar);
  }

  /*
  drops a red marker at a given restaurant's location
  */
  dropMarker(restaurant) {
    // create a HTML element for each feature
    var el = document.createElement("div");
    el.className = "marker";
    // make a marker for each feature and add to the map
    var currentMarker = new mapboxgl.Marker(el)
      .setLngLat([
        restaurant.coordinates.longitude,
        restaurant.coordinates.latitude
      ])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }) // add popups
          .setHTML(
            "<h3><strong>" +
              restaurant.name +
              "</strong></h3><p>" +
              restaurant.location.address1 +
              "</p>"
          )
      )
      .addTo(this.state.mapVar);

    //passing markers to App.js
    this.state.markers.push(currentMarker);
    this.props.passMarkers(this.state.markers);
  }

  componentDidMount() {
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-96.57, 39.828],
      zoom: this.state.zoom
    });
    this.setState({
      mapVar: map
    });

    map.on("move", () => {
      this.setState({
        lng: map.getCenter().lng.toFixed(4),
        lat: map.getCenter().lat.toFixed(4),
        zoom: map.getZoom().toFixed(2)
      });
    });
  }

  render() {
    return (
      <div ref={el => (this.mapContainer = el)} className="mapContainer" />
    );
  }
}

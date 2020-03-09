/*
Alex Becker - 3/8/2020
Created for Capital One's SWE Summit challenge using Yelp's Fusion API and Mapbox
icons:
"Dish" by PauseO8 https://www.flaticon.com/free-icon/dish_857681
"Diet" by freepik https://www.flaticon.com/free-icon/diet_706164
*/

import React, { Component } from "react";
import "./App.css";
import RestaurantCard from "./RestaurantCard.js";
import MapComponent from "./MapComponent.js";
var limit = "10";
require('dotenv').config()

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: 0,
      lng: 0,
      sortByValue: "1",
      priceValue: "4",
      relevantRestaurant: null,
      markers: null,
      API_KEY: process.env.REACT_APP_API_KEY_YELP
    };
  }

  /*
  helper function - passes markers array from map component to App.js
  */
  passMarkers(m) {
    this.setState({
      markers: m
    })
  }

  /*
  makes clear markers button visible
  */
  clearVisible() {
    document.getElementById("clear-markers").style.visibility="visible"
    console.log("COME ON DUDE")
  }

  /*
  removes markers from the map
  */
  clearMarkers() {
    var boundObject = this
    console.log("clear markers clicked")
    var markers = boundObject.state.markers
    console.log(markers)
    if (markers != null) {
      //for each marker, use .remove function
      markers.forEach(marker => {
        marker.remove()
      })
      document.getElementById("clear-markers").style.visibility="hidden"
    }
  }

  /*
  helper method for connection between App.js and RestaurantCard.js child, the focus restaurant
  that we'll pass to the Map component
  */
  setRelevantRestaurant(rest) {
    this.setState({
      relevantRestaurant: rest
    });
  }

  /*
  used when select price is changed - sets the state to the correct value
  */
  handlePriceChange(event) {
    this.setState({ priceValue: event.target.value });
  }

  /*
  called when Sort By select is changed - sets the correct state
  */
  handleSortByChange(event) {
    this.setState({ sortByValue: event.target.value });
  }

  /*
  handles Go button onClick event
  */
  goButtonHandler() {
    //get input from input box
    const input = document.getElementById("input").value;
    //handle no value given
    if (input === "") {
      alert(
        "No search entered! Provide a food type or request a recommendation"
      );
      console.log("error - no search entered");
      return -1;
    }
    //set Go button to loading
    document.getElementById("go").className += " is-loading";
    const boundObject = this;
    boundObject.performSearch(input);
  }

  /*
  this function performs the fetch from Yelp's Fusion API
  */
  performFetch(endpoint, reqOptions) {
    console.log("final endpoint: " + endpoint)
    console.log("starting fetch");
    fetch(endpoint, reqOptions)
      .then(response => {
        return response.json();
      })
      .then(response => {
        console.log("data fetched successfully");
        const restaurants = response.businesses;
        //handles "no restaurants found" case
        if (restaurants.length === 0) {
          alert("no restaurants found! try a new term");
          console.log("error - no restaurants found");
          return -1;
        }
        //remove empty image and text
        this.setState({
          populated: true
        });
        //populate the card div with each restaurant card
        var restaurantCards = [];
        restaurants.forEach(restaurant => {
          const restaurantCard = (
            <RestaurantCard
              clearVisible={this.clearVisible}
              setRelevantRestaurant={this.setRelevantRestaurant.bind(this)}
              key={restaurant.id}
              restaurant={restaurant}
            />
          );
          restaurantCards.push(restaurantCard);
          this.setState({ rows: restaurantCards });
          console.log("fetch complete");
        });
      })
      //set buttons back to normal state
      .then(response => {
        document.getElementById("go").className = "button is-link";
        document.getElementById("recommend").className = "button is-link";
      })
      .catch(error => console.log("error", error));
  }

  /*
  handles recommend button click
  */
  recommendButtonHandler() {
    //set recommend button to loading
    document.getElementById("recommend").className += " is-loading";
    var myHeaders = new Headers();
    //set up endpoint
    var SEARCH_ENDPOINT =
      "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?categories=restaurants&location=LOCATION&term=";
    SEARCH_ENDPOINT += "&limit=" + limit;
    const locationEndpoint =
      "latitude=" + this.state.lat + "&longitude=" + this.state.lng;
    SEARCH_ENDPOINT = SEARCH_ENDPOINT.replace(
      "location=LOCATION",
      locationEndpoint
    );
    //sorting by rating
    SEARCH_ENDPOINT += "&sort_by=rating";
    myHeaders.append(
      "Authorization",
      "Bearer " + this.state.API_KEY
    );
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    this.performFetch(SEARCH_ENDPOINT, requestOptions);
  }

  /*
  requests user location usering HTML 5 Geolocation
  */
  findCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          lng: position.coords.longitude,
          lat: position.coords.latitude
        });
      },
      error => console.log("error ", error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  /*
  performs search given a search term and options of sortby and price
  */
  performSearch(searchTerm) {
    var myHeaders = new Headers();
    var SEARCH_ENDPOINT =
      "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?categories=restaurants&location=LOCATION&term=";
    SEARCH_ENDPOINT += searchTerm;
    SEARCH_ENDPOINT += "&limit=" + limit;

    //switch statement for sort, appends a sort to query
    switch (this.state.sortByValue) {
      case "2":
        SEARCH_ENDPOINT += "&sort_by=distance";
        break;
      case "3":
        SEARCH_ENDPOINT += "&sort_by=rating";
        break;
      case "4":
        SEARCH_ENDPOINT += "&sort_by=review_count";
        break;
      default:
        SEARCH_ENDPOINT += "&sort_by=best_match";
        break;
    }

    //switch for price, appends price to query
    switch (this.state.priceValue) {
      case "3":
        SEARCH_ENDPOINT += "&price=1,2,3";
        break;
      case "2":
        SEARCH_ENDPOINT += "&price=1,2";
        break;
      case "1":
        SEARCH_ENDPOINT += "&price=1";
        break;
      default:
        SEARCH_ENDPOINT += "&price=1,2,3,4";
        break;
    }

    //appending location to query
    const lat = this.state.lat;
    const lng = this.state.lng;
    const locationEndpoint = "latitude=" + lat + "&longitude=" + lng;
    SEARCH_ENDPOINT = SEARCH_ENDPOINT.replace(
      "location=LOCATION",
      locationEndpoint
    );

    myHeaders.append(
      "Authorization",
      "Bearer " + this.state.API_KEY
);
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    //call fetch function with new endpoint and specified options
    this.performFetch(SEARCH_ENDPOINT, requestOptions);
  }

  componentDidMount() {
    //find user coordinates
    this.findCoordinates();
    //allow use of enter button
    var input = document.getElementById("input");
    input.addEventListener("keyup", function(event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("go").click();
      }
    });
    //hide clear markers button - this will reappear when the user puts some parkers on the map
    document.getElementById("clear-markers").style.visibility="hidden"
  }

  render() {
    return (
      <div className="App">
        <table className="title-bar" align="center">
          <tbody>
            <tr>
              <td width="10"></td>
              <td>
                <img
                  alt="app icon"
                  className="header-image"
                  src="foodicon.svg"
                  draggable="false"
                />
              </td>
              <td width="4"></td>
              <td className="title">food.</td>
            </tr>
          </tbody>
        </table>

        <div className="input-container">
          <table>
            <tbody>
              <tr>
                <td>
                  <p>Search for</p>
                </td>
                <td className="textDivider"></td>
                <td
                  style={{
                    width: "17.5vw"
                  }}
                >
                  <input
                    id="input"
                    className="input is-rounded"
                    type="text"
                    placeholder="what are you in the mood for?"
                    style={{
                      display: "inline-block",
                      width: "100%"
                    }}
                    autoFocus
                  ></input>
                </td>
                <td className="textDivider"></td>
                <td>
                  <p>near me</p>
                </td>
                <td className="buttonDivider"></td>
                <td>
                  <button
                    onClick={this.goButtonHandler.bind(this)}
                    className="button is-link"
                    id="go"
                    type="button"
                  >
                    Go
                  </button>
                </td>
                <td width="textDivider"></td>
                <td className="buttonDivider"></td>
                <td>
                  <div className="field">
                    <div className="control">
                      <div className="select">
                        <select
                          value={this.state.priceValue}
                          onChange={this.handlePriceChange.bind(this)}
                        >
                          <option value="4">{"< "} $$$$</option>
                          <option value="3">{"< "} $$$</option>
                          <option value="2">{"< "} $$</option>
                          <option value="1">$</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="buttonDivider"></td>
                <td>
                  <p> Sort by </p>
                </td>
                <td width="5px"></td>
                <td>
                  <div className="field">
                    <div className="control">
                      <div className="select">
                        <select
                          value={this.state.sortByValue}
                          onChange={this.handleSortByChange.bind(this)}
                        >
                          <option value="1">Best Match</option>
                          <option value="2">Distance</option>
                          <option value="3">Rating</option>
                          <option value="4">Review Count</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </td>
                <td width="10vw"></td>
                <td className="divider">|</td>
                <td width="10vw"></td>
                <td>
                  <button
                    onClick={this.recommendButtonHandler.bind(this)}
                    className="button is-link"
                    id="recommend"
                    type="button"
                  >
                    Recommend Me a Restaurant
                  </button>
                </td>
                <td width="10vw"></td>
                <td>
                  <button className="button is-warning" id="clear-markers" onClick={this.clearMarkers.bind(this)}>
                    Clear Markers
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="sidebyside">
          <div className="card-div">
            <p>{this.state.rows}</p>{" "}
            <img
              draggable="false"
              className="populate-img"
              src={this.state.populated ? "" : "./populate-food.png"}
            />
            <p className="populate">
              {this.state.populated
                ? ""
                : "restaurants will appear here after a search"}
            </p>
          </div>
          <MapComponent
            restaurant={this.state.relevantRestaurant}
            passMarkers={this.passMarkers.bind(this)}
            lat={this.state.lat}
            lng={this.state.lng}
            ref={e => {
              this.map = e;
            }}
            className="map"
          />
        </div>
        <div className="made-with-container" height="3vh">
          <p className="made-with">
            made with{" "}
            <a className="link" href="https://www.yelp.com/fusion">
              <img alt="yelp icon" src="./yelp.png" className="made-with-image" />
              Yelp's Fusion API{" "}
            </a>{" "}
            and{" "}
            <a
              rel="noopener noreferrer"
              target="_blank"
              className="link"
              href="https://www.mapbox.com/?utm_medium=sem&utm_source=google&utm_campaign=sem|google|brand|chko-googlesearch-pr01-mapboxbrand-br.broad-us-landingpage-search&utm_term=brand&utm_content=chko-googlesearch-pr01-mapboxbrand-br.broad-us-landingpage-search&gclid=Cj0KCQiA1-3yBRCmARIsAN7B4H22rmHIHPgfTjT2bhF9FTRHG0fr_uOlx2R25chKWxSfq-6AkPJdzrIaArl7EALw_wcB"
            >
              <img
                alt="mapbox icon"
                src="./mapbox-icon.png"
                className="made-with-image"
              />{" "}
              Mapbox
            </a>
          </p>
        </div>
      </div>
    );
  }
}
export default App;

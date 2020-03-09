import React from "react";
var imgPath = "";

class RestaurantCard extends React.Component {
  constructor(props) {
    super(props);

    //set up phone number
    var phoneNumber = this.props.restaurant.phone;
    var pt1 = "(" + phoneNumber.substring(2, 5) + ")-";
    var pt2 = phoneNumber.substring(5, 8) + "-";
    var pt3 = phoneNumber.substring(8, 12);
    var formattedPN = pt1 + pt2 + pt3;
    this.state = {
      pn: formattedPN
    }
    //switch statement for rating
    switch (this.props.restaurant.rating) {
      case 1:
        imgPath = "./yelp_stars/web_and_ios/large/large_1.png";
        break;
      case 1.5:
        imgPath = "./yelp_stars/web_and_ios/large/large_1_half.png";
        break;
      case 2:
        imgPath = "./yelp_stars/web_and_ios/large/large_2.png";
        break;
      case 2.5:
        imgPath = "./yelp_stars/web_and_ios/large/large_2_half.png";
        break;
      case 3:
        imgPath = "./yelp_stars/web_and_ios/large/large_3.png";
        break;
      case 3.5:
        imgPath = "./yelp_stars/web_and_ios/large/large_3_half.png";
        break;
      case 4:
        imgPath = "./yelp_stars/web_and_ios/large/large_4.png";
        break;
      case 4.5:
        imgPath = "./yelp_stars/web_and_ios/large/large_4_half.png";
        break;
      case 5:
        imgPath = "./yelp_stars/web_and_ios/large/large_5.png";
        break;
      default:
        imgPath = "./yelp_stars/web_and_ios/large/large_0.png";
        break;
    }
  }

  /*
  handles locate button onClick event
  */
  locateButtonHandler() {
    //make the clear button visible, since we're dropping a marker
    this.props.clearVisible()
    //pass relevant restaurant to parent
    this.props.setRelevantRestaurant(this.props.restaurant);
  }

  render() {
    return (
      <div className="card">
        <div className="card-content">
          <img
            alt="restaurant"
            draggable="false"
            className="restaurant-image"
            src={this.props.restaurant.image_url}
          />
          <p className="subtitle">
            <a
              rel="noopener noreferrer"
              target="_blank"
              className="link"
              href={this.props.restaurant.url}
            >
              {this.props.restaurant.name}
            </a>
          </p>

          <img
            alt={this.props.restaurant.rating}
            src={imgPath}
            draggable="false"
          />
        </div>
        <footer className="card-footer">
          <span className="card-footer-item pn">
            <span>
              <p>{(this.state.pn==="()--") ? "no phone number listed" : this.state.pn}</p>
            </span>
          </span>
          <p className="card-footer-item">
              <button
                className="button is-link"
                onClick={this.locateButtonHandler.bind(this)}
              >
                Locate
              </button>
          </p>
        </footer>
      </div>
    );
  }
}

export default RestaurantCard;

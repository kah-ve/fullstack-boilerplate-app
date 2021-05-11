import React from 'react';
import './FrontPage.css';

class FrontPage extends React.Component {
    constructor(props) {
      super(props)
    }

    componentDidMount() {
      fetch("http://localhost:5000/api/v1.0/test")
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({
              isLoaded: true,
              items: result.items,
            });
          },
          (error) => {
            this.setState({
              isLoaded: true,
              error,
            });
          }
        )
    }

    render() {
      return (
        <div id="front-page-container">
          <div id="greeting">
            My React Apps
          </div>
          <div className="linkButtons">
            <div className="theLink" to="">Output: {this.props.name}</div>
          </div>
        </div>
      );
    }
}

export default FrontPage;

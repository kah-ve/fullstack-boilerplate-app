import './App.css';
import FrontPage from './components/FrontPage/FrontPage.js';
import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: {},
    };
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
    const {error, isLoaded, items} = this.state;
    if (error) {
      return <FrontPage name={error}/>
    } else if (!isLoaded) {
      return <FrontPage name={'Loading...'}/>
    } else {
      return (
        <FrontPage name={items[0].name} id={items[0].id} price={items[0].price}/>
      );
    }
  }
}


export default App;

import React, { StrictMode } from 'react';
import './FrontPage.css';

async function sleep(ms) {
  await new Promise(resolve => {
    setTimeout(resolve, ms);
  })
}
class FrontPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      response: 'Nothing to Post',
      date: '081120',
      temperature: 58,
      precipitation: 32,
      climate: 'The climate is quite the occassion!',
      description: "A truly rainy day it is indeed."
    }

    this.get_response = this.get_response.bind(this);
    this.post_to_db = this.post_to_db.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.parseOutput = this.parseOutput.bind(this);
    this.getKey = this.getKey.bind(this);
    this.submitForm = this.submitForm.bind(this)

    this.keyCount = 0;
  }

  getKey() {
    return this.keyCount++;
  }

  handleChange(evt) {
    const value = evt.target.value;
    console.log(`Value changing is ${value}`)
    console.log(`Name that is changing ${evt.target.name}`)
    this.setState({
      [evt.target.name]: value
    });
  }

  async get_response() {
    this.setState({
      response: 'Loading...'
    })

    console.log("Trying to get response!")
    try {
      const res = await fetch("http://localhost:5000/api/getinfo");
      const res_json = await res.json();
      console.log(res_json)
      this.setState({
        response: res_json !== null && res_json[0] && res_json[0].length > 0 ? res_json : 'Nothing to Post'
      });
    }
    catch (error) {
      console.error(error);
      this.setState({
        response: 'Nothing to Post'
      })
    }
  }


  async post_to_db() {
    console.log('Posting to DB!')

    let value = {
      'date': this.state.date,
      'temperature': this.state.temperature,
      'precipitation': this.state.precipitation,
      'climate': this.state.climate,
      'description': this.state.description
    }

    let data = JSON.stringify(value)

    fetch("http://localhost:5000/api/insert", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'no-cors',
      body: data
    })

    this.setState({
      date: this.state.date.toString() + 1,
    })
  }

  parseOutput() {
    let value_arr = this.state.response;

    if (typeof value_arr === "string") {
      return value_arr
    }

    const paddedString = (input) => {
      let inputString = input.toString().trim();
      let placeholderLength = 10;
      if (placeholderLength < inputString.length)
        return inputString;

      return inputString + ' '.repeat(placeholderLength - inputString.length);
    }

    return (
      value_arr.map(element =>
        <div className="outputTextFormat" key={this.getKey()}>
          <pre className='identifier'>{paddedString(element[0])}</pre>
          <pre className='identifier'>{paddedString(element[1])}</pre>
          <pre className='identifier'>{paddedString(element[2])}</pre>
          <pre className='identifier'>{paddedString(element[3])}</pre>
          <pre className='identifier'>{paddedString(element[4])}</pre></div>
      )
    )
  }

  submitForm(e) {
    if (e.key === 'Enter') {
      this.post_to_db();
    }
  }

  render() {
    return (
      <div id="front-page-container" onKeyDown={this.submitForm}>
        <div id="greeting">
          REACT FLASK POSTGRES
        </div>
        <div className="linkButtons">
          <div className="theLink" onClick={this.post_to_db}>POST TO DB</div>
          <div className="theLink" onClick={this.get_response}>GET FROM DB</div>
        </div>
        <div className="inputsAndDisplay">
          <InputBox handleChange={this.handleChange} />
          <div className="outputBox">
            {this.parseOutput()}
          </div>
        </div>
      </div>
    );
  }
}

class InputBox extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <form type="submit" className="inputFields">
        <div className="inputBoxes">Date</div>
        <input className="inputText" onChange={this.props.handleChange} type="text" name="date" defaultValue="081120" />
        <div className="inputBoxes">Temperature</div>
        <input className="inputText" onChange={this.props.handleChange} type="text" name="temperature" defaultValue="58" />
        <div className="inputBoxes">Precipitation</div>
        <input className="inputText" onChange={this.props.handleChange} type="text" name="precipitation" defaultValue="32" />
        <div className="inputBoxes">Climate</div>
        <input className="inputText" onChange={this.props.handleChange} type="text" name="climate" defaultValue="The climate is quite the occassion!" />
        <div className="inputBoxes">Description</div>
        <input className="inputText" onChange={this.props.handleChange} type="text" name="description" defaultValue="A truly rainy day it is indeed." />
      </form>
    )
  }
}

export default FrontPage;

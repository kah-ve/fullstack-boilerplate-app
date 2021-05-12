import React, { StrictMode } from 'react';
import './FrontPage.css';

async function sleep(ms) {
  await new Promise(resolve => {
    console.log(resolve);
    setTimeout(resolve, ms);
  })
}
class FrontPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      response: 'Nothing to Post',
      admission: 0,
      name: 'Luther',
      age: 32,
      course: 'World Ending 101',
      department: 'Villainship'
    }

    this.get_response = this.get_response.bind(this);
    this.post_to_db = this.post_to_db.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(evt) {
    const value = evt.target.value;
    this.setState({
      [evt.target.name]: value
    });
  }

  async get_response() {
    this.setState({
      response: 'Loading...'
    })

    sleep(500).then(async () => {
      console.log("Trying to get response!")
      try {
        const res = await fetch("http://localhost:5000/api/getinfo");
        const res_json = await res.json();
        this.setState({
          response: res_json[0] ? res_json !== null && res_json.length > 0 : 'Nothing to Post'
        })
      }
      catch (error) {
        console.error(error);
        this.setState({
          response: 'error'
        })
      }
    })
  }

  async post_to_db() {
    console.log('Posting to DB!')

    sleep(500).then(async () => {
      let value = {
        'admission': this.state.admission,
        'name': this.state.name,
        'age': this.state.age,
        'course': this.state.course,
        'department': this.state.department
      }

      console.log(value)

      let data = JSON.stringify(value)

      fetch("http://localhost:5000/api/insert", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: data
      })
    })
  }

  render() {
    return (
      <div id="front-page-container">
        <div id="greeting">
          REACT FLASK POSTGRES
        </div>
        <div className="linkButtons">
          <div className="theLink" onClick={this.post_to_db}>POST TO DB</div>
          <div className="theLink" onClick={this.get_response}>GET FROM DB</div>
        </div>
        <div className="inputsAndDisplay">
          <InputBox handleChange={this.handleChange} />
          <div className="outputBox">{this.state.response}</div>
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
        <div className="inputBoxes" onChange={this.props.handleChange}>Admission</div>
        <input className="inputText" type="text" name="admission" defaultValue="1" />
        <div className="inputBoxes" onChange={this.props.handleChange}>Name</div>
        <input className="inputText" type="text" name="name" defaultValue="Luther" />
        <div className="inputBoxes" onChange={this.props.handleChange}>Age</div>
        <input className="inputText" type="text" name="age" defaultValue="32" />
        <div className="inputBoxes" onChange={this.props.handleChange}>Course</div>
        <input className="inputText" type="text" name="course" defaultValue="World Ending 101" />
        <div className="inputBoxes" onChange={this.props.handleChange}>Department</div>
        <input className="inputText" type="text" name="department" defaultValue="Villainship" />
      </form>
    )
  }
}

export default FrontPage;

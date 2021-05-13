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
      admission: 1,
      name: 'Luther',
      age: 32,
      course: 'World Ending 101',
      department: 'Villainship'
    }

    this.get_response = this.get_response.bind(this);
    this.post_to_db = this.post_to_db.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.parseOutput = this.parseOutput.bind(this);

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

    sleep(500).then(async () => {
      console.log("Trying to get response!")
      try {
        const res = await fetch("http://localhost:5000/api/getinfo");
        const res_json = await res.json();
        console.log(res_json)
        this.setState({
          response: res_json !== null && res_json[0].length > 0 ? res_json : 'Nothing to Post'
        });
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

  parseOutput() {
    let value_arr = this.state.response;

    if (typeof value_arr === "string") {
      return value_arr
    }

    return (
      value_arr.map(element =>
        <div>
          <span className='identifier'>Admission:</span> {element[0]},
          <span className='identifier'>Name:</span> {element[1]},
          <span className='identifier'>Age:</span> {element[2]},
          <span className='identifier'>Course:</span> {element[3]},
          <span className='identifier'>Department:</span> {element[4]}</div>
      )
    )
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
        <div className="inputBoxes">Admission</div>
        <input className="inputText" onChange={this.props.handleChange} type="text" name="admission" defaultValue="1" />
        <div className="inputBoxes">Name</div>
        <input className="inputText" onChange={this.props.handleChange} type="text" name="name" defaultValue="Luther" />
        <div className="inputBoxes">Age</div>
        <input className="inputText" onChange={this.props.handleChange} type="text" name="age" defaultValue="32" />
        <div className="inputBoxes">Course</div>
        <input className="inputText" onChange={this.props.handleChange} type="text" name="course" defaultValue="World Ending 101" />
        <div className="inputBoxes">Department</div>
        <input className="inputText" onChange={this.props.handleChange} type="text" name="department" defaultValue="Villainship" />
      </form>
    )
  }
}

export default FrontPage;

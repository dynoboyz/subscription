import React from "react";
import ReactDOM from "react-dom";
import DatePicker from 'react-datepicker';

import './App.scss';
import "./styles.css";
import 'react-datepicker/dist/react-datepicker.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: "",
      type: 1,
      day: "",
      start_dt: "",
      end_dt: "",
      errors: [],
      isLoading: false
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeType = this.handleChangeType.bind(this);
    this.handleChangeDay = this.handleChangeDay.bind(this);
    this.handleChangeStart = this.handleChangeStart.bind(this);
    this.handleChangeEnd = this.handleChangeEnd.bind(this);
  }

  handleChangeType(event) {
    this.setState({
      type: event.target.value
    });
  }

  handleChangeDay(event) {
    this.setState({
      day: event.target.value
    });
  }

  handleChangeStart(date) {
    this.setState({
      start_dt: date
    });
  }

  handleChangeEnd(date) {
    this.setState({
      end_dt: date
    });
  }

  hasError(key) {
    return this.state.errors.indexOf(key) !== -1;
  }

  handleInputChange(event) {
    var key = event.target.name;
    var value = event.target.value;
    var obj = {};
    obj[key] = value;
    this.setState(obj);
  }

  handleSubmit(event) {
    event.preventDefault();

    // Validate
    var errors = [];

    // Set error
    if (this.state.amount === "") { errors.push("amount"); }
    if (this.state.type === "") { errors.push("type"); }
    if (this.state.day === "") { errors.push("day"); }
    if (this.state.start_dt === "") { errors.push("start_dt"); }
    if (this.state.end_dt === "") { errors.push("end_dt"); }

    this.setState({
      errors: errors
    });

    if (errors.length > 0) {
      return false;
    } else {
      this.setState({isLoading: true})
      // send POST JSON to API
      fetch('http://localhost:8080/subscription', {
        method: 'POST',
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: this.state.amount,
          type: this.state.type,
          day: this.state.day,
          start_dt: this.state.start_dt,
          end_dt: this.state.end_dt
        })
      })
      .then((response) => response.json())
      .then((json) => alert(json.messages))
      .catch((error) => alert(error))
      .finally(() => this.setState({isLoading: false}));
    }
  }

  render() {
    return  <div style={{ flex: 1, padding: 24 }}>
    {this.state.isLoading ? <div className="loader center"><i className="fa fa-cog fa-spin" /></div> : (
      <form className="row" style={{margin: '5% 5% 5% 5%'}}>
        <div className="col-lg-12">
          <label htmlFor="amount">Amount ($)</label>
          <input
            autoComplete="off"
            className={this.hasError("amount") ? "form-control is-invalid" : "form-control"}
            name="amount"
            value={this.state.amount}
            onChange={this.handleInputChange} />
          <div className={this.hasError("amount") ? "inline-errormsg" : "hidden"}>
            Please enter a value
          </div>
        </div>
        <div className="col-lg-12">
          <label htmlFor="type">Subscription Type:
            <select value={this.state.type} onChange={this.handleChangeType} className="form-control">
              <option value="1">Daily</option>
              <option value="2">Weekly</option>
              <option value="3">Monthly</option>
            </select>
          </label>
        </div>
        {this.state.type == 2 &&
        <div className="col-lg-12">
          <label htmlFor="type">Day of Week:
            <select value={this.state.day} onChange={this.handleChangeDay} className="form-control">
              <option value="0">Monday</option>
              <option value="1">Tuesday</option>
              <option value="2">Wednesday</option>
              <option value="3">Thursday</option>
              <option value="4">Friday</option>
              <option value="5">Saturday</option>
              <option value="6">Sunday</option>
            </select>
          </label>
          <div className={this.hasError("day") ? "inline-errormsg" : "hidden"}>
            Please select day of Week
          </div>
        </div>
        }
        {this.state.type == 3 &&
        <div className="col-lg-12">
          <label htmlFor="day" className="react-datepicker-wrapper">Day of Month</label>
          <input
            autoComplete="off"
            className={this.hasError("day") ? "form-control is-invalid" : "form-control"}
            name="day"
            value={this.state.day}
            onChange={this.handleInputChange} />
          <div className={this.hasError("day") ? "inline-errormsg" : "hidden"}>
            Please enter day of Month (1-30)
          </div>
        </div>
        }
        <div className="col-lg-12">
          <label htmlFor="start_dt">Start Date</label>
          <br/>
          <DatePicker
            selected={this.state.start_dt}
            onChange={this.handleChangeStart}
            className={this.hasError("start_dt") ? "form-control is-invalid" : "form-control"}
            name="start_dt" />
            <div className={this.hasError("start_dt") ? "inline-errormsg" : "hidden"}>
              Please select Start Date
            </div>
        </div>
        <div className="col-lg-12">
          <label htmlFor="end_dt">End Date</label>
          <br/>
          <DatePicker
            selected={this.state.end_dt}
            onChange={this.handleChangeEnd}
            className={this.hasError("end_dt") ? "form-control is-invalid" : "form-control"}
            name="end_dt" />
            <div className={this.hasError("end_dt") ? "inline-errormsg" : "hidden"}>
              Please select End Date
            </div>
        </div>

        <div className="col-lg-12  padd-top">
          <button className="btn btn-success" onClick={this.handleSubmit}>
            Create
          </button>
        </div>
      </form>
      )}
      </div>
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

export default App;
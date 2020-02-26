import React from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

class UpdateCourse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      course: [],
      user: [],
      authenticatedUser: Cookies.getJSON("authenticatedUser") || null
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    fetch(`http://localhost:5000/api/courses/${this.props.match.params.id}`)
      .then(response => response.json())
      .then(responseData => {
        this.setState({
          course: responseData.course,
          user: responseData.course.user,
          title: responseData.course.title,
          description: responseData.course.description,
          estimatedTime: responseData.course.estimatedTime,
          materialsNeeded: responseData.course.materialsNeeded
        });
      });
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    const { context } = this.props;
    const authUser = context.authenticatedUser;

    const {
      course,
      title,
      description,
      estimatedTime,
      materialsNeeded
    } = this.state;
    console.log(title);
    const update = {
      course,
      title,
      description,
      estimatedTime,
      materialsNeeded
    };
    context.data
      .updateCourse(update, authUser.emailAddress, authUser.password)
      .then(error => {
        if (error.length) {
          this.setState({ error });
          console.log(error);
        } else {
          context.actions
            .signIn(authUser.emailAddress, authUser.password)
            .then(() => {
              this.props.history.push(`/courses/${this.state.course.id}`);
            });
        }
      })
      .catch(err => {
        console.log(err && err.length);
        this.props.history.push("/error");
      });

    event.preventDefault();
  }

  render() {
    return (
      <div>
        <div id="root">
          <div>
            <div className="bounds course--detail">
              <h1>Update Course</h1>
              <div>
                <form onSubmit={this.handleSubmit}>
                  <div className="grid-66">
                    <div className="course--header">
                      <label className="course--label">
                        Course Title
                        <input
                          id="title"
                          name="title"
                          type="text"
                          className="input-title course--title--input"
                          value={this.state.title}
                          onChange={this.handleInputChange}
                        />
                      </label>

                      <p>
                        By {this.state.user.firstName}{" "}
                        {this.state.user.lastName}
                      </p>
                    </div>
                    <div className="course--description">
                      <div>
                        <textarea
                          id="description"
                          name="description"
                          className=""
                          value={this.state.description}
                          onChange={this.handleInputChange}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  <div className="grid-25 grid-right">
                    <div className="course--stats">
                      <ul className="course--stats--list">
                        <li className="course--stats--list--item">
                          <h4>Estimated Time</h4>
                          <div>
                            <input
                              id="estimatedTime"
                              name="estimatedTime"
                              type="text"
                              className="course--time--input"
                              onChange={this.handleInputChange}
                              value={this.state.estimatedTime}
                            />
                          </div>
                        </li>
                        <li className="course--stats--list--item">
                          <h4>Materials Needed</h4>
                          <div>
                            <textarea
                              id="materialsNeeded"
                              name="materialsNeeded"
                              className=""
                              onChange={this.handleInputChange}
                              value={this.state.materialsNeeded}
                            ></textarea>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="grid-100 pad-bottom">
                    <button className="button" type="submit">
                      Update Course
                    </button>
                    <Link className="button button-secondary" to={`/`}>
                      Cancel
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default UpdateCourse;

import React from 'react';
import './Profile.css';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.user.name
    }
  }

  onFormChange = (event) => {
    switch(event.target.id) {
      case 'user-name':
        this.setState({ name: event.target.value });
        break;
      case 'user-age':
        this.setState({ age: event.target.value });
        break;
      case 'user-pet':
        this.setState({ pet: event.target.value });
        break;
      default:
        return;
    }
  }

  onProfileUpdate = (data) => {
    fetch(`http://localhost:3000/profile/${this.props.user.id}`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': window.sessionStorage.getItem('token')
      },
      body: JSON.stringify({ formInput: data })
    }).then(response => {
      if (response.status === 200 || response.status === 304) {
        this.props.toggleModal();
        this.props.loadUser({ ...this.props.user, ...data })
      }
    }).catch(err => console.log(err))
  }

  render() {
    const { user, toggleModal } = this.props;
    const { name, age, pet } = this.state;

    return (
      <div className="profile-modal">
        <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
          <main className="pa4 black-80 w-80">
            <img
              src="http://tachyons.io/img/logo.jpg"
              className="br-100 h3 w3 dib" alt="avatar" 
            />
            <h1>{this.state.name}</h1>
            <h4>{`Image submitted: ${user.entries}`}</h4>
            <p>{`Age: ${this.state.age}`}</p>
            <p>{`Pet: ${this.state.pet}`}</p> 
            <p>{`Member sinced: ${new Date(user.joined).toLocaleDateString()}`}</p>
            <hr />
            <div className="mt3">
              <label className="db fw6 lh-copy f6" htmlFor="user-name">Name</label>
              <input
                className="pa2 ba hover-bg-black hover-white w-100"
                type="text"
                placeholder={user.name}
                id="user-name"
                onChange={this.onFormChange}
              />
            </div>
            <div className="mt3">
              <label className="db fw6 lh-copy f6" htmlFor="user-age">Age</label>
              <input
                className="pa2 ba hover-bg-black hover-white w-100"
                type="text"
                placeholder={user.age}
                id="user-age"
                onChange={this.onFormChange}
              />
            </div>
            <div className="mt3">
              <label className="db fw6 lh-copy f6" htmlFor="user-pet">Pet</label>
              <input
                className="pa2 ba hover-bg-black hover-white w-100"
                type="text"
                placeholder={user.pet}
                id="user-pet"
                onChange={this.onFormChange}
              />
            </div>
            <div className="mt4" style={{display: 'flex', justifyContent: 'space-evenly'}}>
              <button
                className="b pa2 grow pointer hover-white w-40 bg-light-blue b--black-20"
                onClick={() => this.onProfileUpdate({ name, age, pet })}
              >
                Save
              </button>
              <button className="b pa2 grow pointer hover-white w-40 bg-light-red b--black-20"
                onClick={toggleModal}>
                Cancel
              </button>
            </div>
          </main>
          <div className="modal-close" onClick={toggleModal}>&times;</div>
        </article>
      </div>
    )
  }
}

export default Profile;
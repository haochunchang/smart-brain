import React, { Component } from 'react';
import Particles from 'react-particles-js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Modal from './components/Modal/Modal';
import Profile from './components/Profile/Profile';

import { APIfetch } from './api';

import './App.css';

const particlesOptions = {
  //customize this to your liking
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 1500
      }
    }
  }
}

const initialState = {
  input: '',
  imageUrl: '',
  boxes: [],
  route: 'signin',
  isSignedIn: false,
  isProfileOpen: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: '',
    pet: '',
    age: 0
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  componentDidMount() {
    const token = window.sessionStorage.getItem('token');
    const body = null;

    if (token) {
      APIfetch('http://localhost:3000/signin', 'post', body, token)
        .then(data => {
          if (data && data.id) {
            APIfetch(`http://localhost:3000/profile/${data.id}`, 'get', body, token)
              .then(user => {
                if (user && user.email) {
                  this.loadUser(user);
                  this.onRouteChange('home');
                }
              }).catch(console.log)
          }
        })
        .catch(console.log)
    }
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined,
      age: data.age,
      pet: data.pet
    }})
  }

  calculateFaceLocations = (data) => {
    if (data && data.outputs) {
      const clarifaiFaces = data.outputs[0].data.regions;
      const image = document.getElementById('inputimage');
      const width = Number(image.width);
      const height = Number(image.height);
  
      return clarifaiFaces.map((face) => {
        const clarifaiFace = face.region_info.bounding_box;
        return {
          leftCol: clarifaiFace.left_col * width,
          topRow: clarifaiFace.top_row * height,
          rightCol: width - (clarifaiFace.right_col * width),
          bottomRow: height - (clarifaiFace.bottom_row * height)
        }
      })
    }
    return
  }

  displayFaceBoxes = (boxes) => {
    if (boxes) {
      this.setState({boxes: boxes});
    }
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});

    const token = window.sessionStorage.getItem('token');
    const req_input_body = JSON.stringify({
      input: this.state.input
    });

    APIfetch('http://localhost:3000/imageurl', 'post', req_input_body, token)
      .then(response => {
        if (response) {

          const req_id_body = JSON.stringify({ 
            id: this.state.user.id
          });

          APIfetch('http://localhost:3000/image', 'put', req_id_body, token)
            .then(count => {
              this.setState(
                Object.assign(this.state.user, { entries: count })
              )
            })
            .catch(console.log)
        }
        this.displayFaceBoxes(this.calculateFaceLocations(response))
      })
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      window.sessionStorage.removeItem('token');
      return this.setState(initialState)
    }
    if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  toggleModal = () => {
    this.setState(prevState => ({
      ...prevState,
      isProfileOpen: !prevState.isProfileOpen
    }))
  }

  render() {
    const { isSignedIn, imageUrl, route, boxes, isProfileOpen, user } = this.state;
    return (
      <div className="App">
         <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation 
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
          toggleModal={this.toggleModal}
        />
          { isProfileOpen && 
            <Modal>
              <Profile
                isProfileOpen={isProfileOpen}
                toggleModal={this.toggleModal}
                loadUser={this.loadUser}
                user={user}
              />
            </Modal>
          }
        { route === 'home'
          ? <div>
              <Logo />
              <Rank
                name={user.name}
                entries={user.entries}
              />
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
            </div>
          : (
             route === 'signin'
             ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
             : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )
        }
      </div>
    );
  }
}

export default App;

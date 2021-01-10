import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyBxJqf5SH_1hp-quzE8lVjTyryWY7Q2AXs",
  authDomain: "piedrapapeltijera-cc32a.firebaseapp.com",
  databaseURL: "https://piedrapapeltijera-cc32a.firebaseio.com",
  projectId: "piedrapapeltijera-cc32a",
  storageBucket: "piedrapapeltijera-cc32a.appspot.com",
  messagingSenderId: "583053769337",
  appId: "1:583053769337:web:e61abcc981cc7025c332a8"})

const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();


function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>⚛️🔥💬</h1>
        <SignOut />
        <Random />

      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Ingresar</button>
      <p>Home</p>
    </>
  )

}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function random2(){
  var words = ["monitor", "program", "application", "keyboard", "javascript", "gaming", "network"];

  var word = words[Math.floor(Math.random() * words.length)];
  
  console.log(word);  
  }

function Random() {
  return auth.currentUser && (
    <button className="random" onClick={() => random2()}>Random</button>
  )
}

function abc(){
  alert("hola")
}


function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });
  const arrayPrueba = messages;
                     
  const [formValue, setFormValue] = useState('');
  const [palEspanol, setpalEspanol] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      espanol: palEspanol,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })
    
    setFormValue('');
    setpalEspanol('')
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Ingles" />
      <input value={palEspanol} onChange={(e) => setpalEspanol(e.target.value)} placeholder="Español" />

      <button type="submit" disabled={!formValue}>🕊️</button>
      <button type="submit" onChange={(e) => random2()} >Random</button>

    </form>
  </>)
}


function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>{text}</p>
    </div>
  </>)
}


export default App;

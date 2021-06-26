import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import notes from "../notes"

function App(props) {
  return (
    <div>
      <Header />
      {notes.map(noteObj => {
        return( 
        <Note 
          id = {noteObj.key}
          title = {noteObj.title} 
          content = {noteObj.content}
        />
      )
      })}
      <Footer />
    </div>
  );
}

export default App;

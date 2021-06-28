import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";

function App() {

  const [noteArr, setNoteArr] = React.useState([]);
//Spread previous array and add newItem
  function addNote(newItem){
    setNoteArr(prevArr =>{
      return [
        ...prevArr, newItem
      ]
    })
  }
  //Search for obj in Array via id property and filter new array excluding ID'd object
  function deleteNote(id){
    setNoteArr(prevArr=>{
      return prevArr.filter( (note, index) => {
         return index !== id;
      })
    })
  }

  console.log(noteArr.length);
  return (
    <div>
      <Header />
      <CreateArea 
        addNote = {addNote}
      />
      {/* We mark each noteObj by their index in the noteArr */}
      {noteArr.map( (note, index) => {
        return <Note key= {index} id={index} title={note.title} content={note.content} delNote={deleteNote}/>
      })}
      <Footer />
    </div>
  );
}

export default App;


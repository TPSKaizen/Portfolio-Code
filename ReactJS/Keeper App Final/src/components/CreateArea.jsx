import React from "react";
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Zoom from '@material-ui/core/Zoom';


function CreateArea(props) {

  const [noteObj, setNObj] = React.useState({
    title: "",
    content: ""
  });

  function passBack(event){
    //destructure event.target for easier manipulation
    let {name, value} = event.target;
    //set noteObj with  previous values and only overwrite existing property as specified by the received name and value
    setNObj(prevObj =>{
      return {
        ...prevObj,
        [name]: value
      }
    })
  }

  //clears input fields
  function reset(){
    setNObj( prevVal =>{
      return {
        title:"",
        content: "",
      }
    })
  }

  const [clicked, setClicked] = React.useState(false);

  function handleClick(){
    setClicked(prevVal=>{
      return(true)
    })
  }

  return (
    <div>
    {/* Code below in form is just to stop the page from auto refreshing*/}
      <form className ="create-note" onSubmit={e => { e.preventDefault();}}   >
        {clicked && <input onChange={passBack} name="title" placeholder="Title" value= {noteObj.title} /> }
        <textarea onChange={passBack} onClick={handleClick} name="content" placeholder="Take a note..." rows= {clicked ? "3" : "1"} value= {noteObj.content} />
        
        { clicked && <Zoom in={true}> 
        <Fab onClick={ () => 
        {props.addNote(noteObj);
         reset();
        }

        }><AddIcon /></Fab></Zoom> }
      </form>
    </div>
  );
}

export default CreateArea;

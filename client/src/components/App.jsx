import React, { useEffect, useState } from "react";
import Header from "./Header";
import Note from "./Note";
import Footer from "./Footer";

function App() {

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [backendData, setBackendData] = useState([{}]); // storing backend data
  const [dataUpdated, setDataUpdated] = useState(true); // useeffect dependency

  function handleChangeTitle(event) { 
    setTitle(event.target.value);
  }

  function handleChangeContent(event) {
    setContent(event.target.value);
  }

  function deleteNote(id) {
    console.log(`trying to delete ${id}`)

    async function deleteData () {
      console.log("deleting data");
      const response = await fetch("/api/deleteData", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          id: id.toString()
        })
      })
      if(response?.status === 200) {
        setDataUpdated(!dataUpdated);
      }
    };

    deleteData();
  }


  function handleClick(event) {
    event.preventDefault();
  
    if (title.trim() === "" && content.trim() === "") {
      alert("Please enter a title and content for your note");
      return;
    } else if (title.trim() === "") {
      alert("Please enter a title for your note");
      return;
    } else if (content.trim() === "") {
      alert("Please enter some content in your note");
      return;
    }
  
    const newNote = {
      _id: Date.now(), 
      title: title,
      content: content,
    };
  
    setBackendData([...backendData, newNote]);
    setTitle("");
    setContent("");
  }
  
  

  useEffect(()=>{
    fetch("/api").then(
      response => response.json() 
    ).then(
      data =>{
        setBackendData(data);
        console.log(data);
      }
    )
  },[dataUpdated])

  return (
    <div className="container">
      <Header />
      <div>
        
      </div>
      <form onSubmit={handleClick}>
        <input
          onChange={handleChangeTitle}
          type="text"
          placeholder="Title"
          value={title}
        />
        <br />
        <textarea
          onChange={handleChangeContent}
          type="text"
          placeholder="Take a note..."
          value={content}
          rows="2"
        />
        <br />
        <button type="submit" onClick={handleClick}>
          +
        </button>
      </form>
      {(backendData.length === 0)? (
        <p>Loading notes...</p> 
      ):(
        backendData.map((note) => (
          <Note
          key={note._id}
          id={note._id}
          title={note.title}
          content={note.content}
          onDelete={deleteNote}
        />
        ))
      )}
      <Footer />
    </div>
  );
}

export default App;

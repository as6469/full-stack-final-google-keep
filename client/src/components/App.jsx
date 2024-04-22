import React, { useEffect, useState } from "react";
import Header from "./Header";
import Note from "./Note";
import Footer from "./Footer";

function App() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [backendData, setBackendData] = useState([]);
  const [dataUpdated, setDataUpdated] = useState(true);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("notes"));
    if (storedData && storedData.length) {
      setBackendData(storedData);
    } else {
      fetchNotes();
    }
  }, []);

  async function fetchNotes() {
    const response = await fetch("/api");
    const data = await response.json();
    setBackendData(data);
    localStorage.setItem("notes", JSON.stringify(data));
  }

  function handleChangeTitle(event) {
    setTitle(event.target.value);
  }

  function handleChangeContent(event) {
    setContent(event.target.value);
  }

  function deleteNoteLocally(id) {
    setBackendData(backendData.filter((note) => note._id !== id));
    localStorage.setItem(
      "notes",
      JSON.stringify(backendData.filter((note) => note._id !== id))
    );
  }

  function deleteNote(id) {
    deleteNoteLocally(id);

    async function deleteData() {
      const response = await fetch("/api/deleteData", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id.toString(),
        }),
      });
      if (response?.status !== 200) {
        setDataUpdated(!dataUpdated);
      }
    }

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
    localStorage.setItem(
      "notes",
      JSON.stringify([...backendData, newNote])
    );
    setTitle("");
    setContent("");
  }

  return (
    <div className="container">
      <Header />
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
        <button type="submit">+</button>
      </form>
      {backendData.length === 0 ? (
        <p>Loading notes...</p>
      ) : (
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

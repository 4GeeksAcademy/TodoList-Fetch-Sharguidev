import React, { useState, useEffect } from "react";

function ToDoListFetch() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');



  function createTask() {

    let jsonTask = { label: newTask, is_done: false };
    fetch("https://playground.4geeks.com/todo/todos/gobando", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonTask)
    }
    )
      .then(resp => {
        if (resp.ok) {
          getTodos();
          setNewTask('');
        } else createUser();
      });
  }


  function createUser() {
    fetch("https://playground.4geeks.com/todo/users/gobando", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({})
    })
      .then(resp => { 

        if (!resp.ok){ 
          throw new Error("Error Creating User")
        } 

        createTask();

      })
      .catch(err => { console.log(err); })

  }


  function getTodos() {
    fetch("https://playground.4geeks.com/todo/users/gobando")
      .then(resp => {
        if (!resp.ok) {
          throw new Error("Something went wrong while getting todos");
        }
        return resp.json();
      })
      .then(result => {
        setTasks(result.todos);
      })
      .catch(() => {
        createUser();
      })
  }
 
  const clearAll = () => {
    fetch("https://playground.4geeks.com/todo/users/gobando",{
      method: "DELETE"
    }
    )
    .then(resp =>{
      if(resp.ok){
        setTasks([])
      }
    })
  }
  
  useEffect(() => {
    getTodos();
  }, []);

  const handleChange = (event) => {
    let inputValue = event.target.value
    setNewTask(inputValue) 
  }


  const handleKeyDown = (event) => {
    let keyName = event.key
  if(keyName === 'Enter' && newTask.trim() !== ''){
    createTask();
    
  
    }
  }


  const handleDelete = (idToBeDeleted) => {
    fetch(`https://playground.4geeks.com/todo/todos/${idToBeDeleted}`,{
      method: "DELETE"
    }
    )
    .then(resp =>{
      if(resp.ok){
        getTodos()
      }
    })
  }

  
  return <div className="container">
    <h1>To Do List </h1>
    <input type="text" value={newTask} onChange={handleChange} onKeyDown={handleKeyDown}/>
    <p>{tasks.length ? `${tasks.length} item(s) left`:'No tasks, add a task'}</p> 
    <button onClick={clearAll} className="btn btn-danger  mb-3">Clear all</button>
    <ul>
      {tasks.map(   (toDo, index) => (<li key={index}>
        {toDo.label}
        <span onClick={() => handleDelete(toDo.id)}> x</span>
      </li>)  ) } 
    </ul>
  </div>  


  


  


  
} 


export default ToDoListFetch;
import { useState, useEffect } from 'react';
import Header from './components/Layout/Header';
import ProjectList from './components/Projects/ProjectList';
import ProjectForm from './components/Projects/ProjectForm';
import './App.css';

function App() {
  const [projects, setProjects] = useState([]);
  const API_URL = 'https://hourly-reports.onrender.com/Projects';

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleAddProject = async (projectName) => {
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectName }),
      });
      fetchProjects();
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  return (
    <div className="App">
      <Header />
      <ProjectForm onSubmit={handleAddProject} />
      <ProjectList projects={projects} onDelete={handleDelete} />
    </div>
  );
}

export default App;
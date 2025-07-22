import React, { useState } from 'react';

const ProjectForm = ({ onSubmit }) => {
  const [newProject, setNewProject] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(newProject);
    setNewProject('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={newProject}
        onChange={(e) => setNewProject(e.target.value)}
        placeholder="Enter project name"
        required
      />
      <button type="submit">Add Project</button>
    </form>
  );
};

export default ProjectForm;
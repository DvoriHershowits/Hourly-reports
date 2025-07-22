import React from 'react';

const ProjectList = ({ projects, onDelete }) => {
  return (
    <div className="projects-list">
      {projects.map(project => (
        <div key={project.id} className="project-item">
          <span>{project.projectName}</span>
          <button onClick={() => onDelete(project.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default ProjectList;
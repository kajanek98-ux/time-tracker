import React, { useState, useEffect } from 'https://esm.sh/react@18';
import ReactDOM from 'https://esm.sh/react-dom@18';

const Play = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>;
const Pause = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>;
const Plus = ({size = 20}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const Trash2 = ({size = 18}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
const Clock = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const FolderOpen = ({size = 20}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>;
const ChevronDown = ({size = 20}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>;
const ChevronRight = ({size = 20}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>;

function ProjectTimeTracker() {
  const [projects, setProjects] = useState([]);
  const [activeTimer, setActiveTimer] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [expandedProjects, setExpandedProjects] = useState({});
  const [addingElementTo, setAddingElementTo] = useState(null);
  const [newElementName, setNewElementName] = useState('');

  useEffect(() => {
    let interval;
    if (activeTimer) {
      interval = setInterval(() => {
        setCurrentTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTimer]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addProject = () => {
    if (newProjectName.trim()) {
      const newProject = {
        id: Date.now(),
        name: newProjectName,
        elements: [],
        totalTime: 0
      };
      setProjects([...projects, newProject]);
      setNewProjectName('');
      setShowNewProject(false);
      setExpandedProjects({...expandedProjects, [newProject.id]: true});
    }
  };

  const addElement = (projectId, elementName) => {
    setProjects(projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          elements: [...project.elements, {
            id: Date.now(),
            name: elementName,
            time: 0
          }]
        };
      }
      return project;
    }));
  };

  const toggleTimer = (projectId, elementId = null) => {
    if (activeTimer?.projectId === projectId && activeTimer?.elementId === elementId) {
      setProjects(projects.map(project => {
        if (project.id === projectId) {
          if (elementId) {
            return {
              ...project,
              elements: project.elements.map(el => 
                el.id === elementId ? {...el, time: el.time + currentTime} : el
              ),
              totalTime: project.totalTime + currentTime
            };
          } else {
            return {
              ...project,
              totalTime: project.totalTime + currentTime
            };
          }
        }
        return project;
      }));
      setActiveTimer(null);
      setCurrentTime(0);
    } else {
      if (activeTimer) {
        toggleTimer(activeTimer.projectId, activeTimer.elementId);
      }
      setActiveTimer({ projectId, elementId });
      setCurrentTime(0);
    }
  };

  const deleteProject = (projectId) => {
    if (activeTimer?.projectId === projectId) {
      setActiveTimer(null);
      setCurrentTime(0);
    }
    setProjects(projects.filter(p => p.id !== projectId));
  };

  const deleteElement = (projectId, elementId) => {
    if (activeTimer?.elementId === elementId) {
      setActiveTimer(null);
      setCurrentTime(0);
    }
    setProjects(projects.map(project => {
      if (project.id === projectId) {
        const element = project.elements.find(el => el.id === elementId);
        return {
          ...project,
          elements: project.elements.filter(el => el.id !== elementId),
          totalTime: project.totalTime - (element?.time || 0)
        };
      }
      return project;
    }));
  };

  const toggleProject = (projectId) => {
    setExpandedProjects({
      ...expandedProjects,
      [projectId]: !expandedProjects[projectId]
    });
  };

  return React.createElement('div', {className: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4"},
    React.createElement('div', {className: "max-w-4xl mx-auto"},
      React.createElement('div', {className: "bg-white rounded-lg shadow-lg p-6 mb-6"},
        React.createElement('h1', {className: "text-3xl font-bold text-gray-800 flex items-center gap-2 mb-2"},
          React.createElement(Clock, null),
          'Project Time Tracker'
        ),
        React.createElement('p', {className: "text-gray-600"}, 'Track time for your projects and tasks')
      ),
      React.createElement('div', {className: "mb-6"},
        !showNewProject ? 
          React.createElement('button', {
            onClick: () => setShowNewProject(true),
            className: "w-full bg-indigo-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-700 transition"
          },
            React.createElement(Plus, {size: 20}),
            'Create New Project'
          ) :
          React.createElement('div', {className: "bg-white rounded-lg shadow p-4"},
            React.createElement('input', {
              type: "text",
              value: newProjectName,
              onChange: (e) => setNewProjectName(e.target.value),
              placeholder: "Enter project name...",
              className: "w-full border border-gray-300 rounded px-3 py-2 mb-3",
              onKeyPress: (e) => e.key === 'Enter' && addProject(),
              autoFocus: true
            }),
            React.createElement('div', {className: "flex gap-2"},
              React.createElement('button', {
                onClick: addProject,
                className: "flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
              }, 'Add Project'),
              React.createElement('button', {
                onClick: () => {
                  setShowNewProject(false);
                  setNewProjectName('');
                },
                className: "flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
              }, 'Cancel')
            )
          )
      ),
      projects.length === 0 ?
        React.createElement('div', {className: "bg-white rounded-lg shadow p-8 text-center text-gray-500"},
          React.createElement(FolderOpen, {size: 48}, null),
          React.createElement('p', null, 'No projects yet. Create your first project to get started!')
        ) :
        projects.map(project =>
          React.createElement('div', {key: project.id, className: "bg-white rounded-lg shadow mb-4 overflow-hidden"},
            React.createElement('div', {className: "bg-indigo-600 text-white p-4"},
              React.createElement('div', {className: "flex items-center justify-between"},
                React.createElement('div', {className: "flex items-center gap-2 flex-1"},
                  React.createElement('button', {
                    onClick: () => toggleProject(project.id),
                    className: "hover:bg-indigo-700 rounded p-1"
                  },
                    expandedProjects[project.id] ? React.createElement(ChevronDown, {size: 20}) : React.createElement(ChevronRight, {size: 20})
                  ),
                  React.createElement(FolderOpen, {size: 20}),
                  React.createElement('h2', {className: "text-xl font-semibold"}, project.name)
                ),
                React.createElement('div', {className: "flex items-center gap-3"},
                  React.createElement('span', {className: "text-sm bg-indigo-700 px-3 py-1 rounded"},
                    'Total: ' + formatTime(project.totalTime + (activeTimer?.projectId === project.id && !activeTimer?.elementId ? currentTime : 0))
                  ),
                  React.createElement('button', {
                    onClick: () => toggleTimer(project.id),
                    className: `p-2 rounded ${activeTimer?.projectId === project.id && !activeTimer?.elementId ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`
                  },
                    activeTimer?.projectId === project.id && !activeTimer?.elementId ? React.createElement(Pause) : React.createElement(Play)
                  ),
                  React.createElement('button', {
                    onClick: () => deleteProject(project.id),
                    className: "p-2 bg-red-500 hover:bg-red-600 rounded"
                  }, React.createElement(Trash2, {size: 18}))
                )
              )
            ),
            expandedProjects[project.id] && React.createElement('div', {className: "p-4"},
              project.elements.map(element =>
                React.createElement('div', {key: element.id, className: "flex items-center justify-between bg-gray-50 p-3 rounded mb-2"},
                  React.createElement('span', {className: "font-medium text-gray-700"}, element.name),
                  React.createElement('div', {className: "flex items-center gap-3"},
                    React.createElement('span', {className: "text-gray-600 font-mono"},
                      formatTime(element.time + (activeTimer?.elementId === element.id ? currentTime : 0))
                    ),
                    React.createElement('button', {
                      onClick: () => toggleTimer(project.id, element.id),
                      className: `p-2 rounded ${activeTimer?.elementId === element.id ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`
                    },
                      activeTimer?.elementId === element.id ? React.createElement(Pause, {size: 16}) : React.createElement(Play, {size: 16})
                    ),
                    React.createElement('button', {
                      onClick: () => deleteElement(project.id, element.id),
                      className: "p-2 bg-red-500 hover:bg-red-600 text-white rounded"
                    }, React.createElement(Trash2, {size: 16}))
                  )
                )
              ),
              addingElementTo === project.id ?
                React.createElement('div', {className: "mt-3"},
                  React.createElement('input', {
                    type: "text",
                    value: newElementName,
                    onChange: (e) => setNewElementName(e.target.value),
                    placeholder: "Enter task name...",
                    className: "w-full border border-gray-300 rounded px-3 py-2 mb-2",
                    onKeyPress: (e) => {
                      if (e.key === 'Enter' && newElementName.trim()) {
                        addElement(project.id, newElementName);
                        setNewElementName('');
                        setAddingElementTo(null);
                      }
                    },
                    autoFocus: true
                  }),
                  React.createElement('div', {className: "flex gap-2"},
                    React.createElement('button', {
                      onClick: () => {
                        if (newElementName.trim()) {
                          addElement(project.id, newElementName);
                          setNewElementName('');
                          setAddingElementTo(null);
                        }
                      },
                      className: "flex-1 bg-green-600 text-white py-2 rounded text-sm hover:bg-green-700"
                    }, 'Add Task'),
                    React.createElement('button', {
                      onClick: () => {
                        setAddingElementTo(null);
                        setNewElementName('');
                      },
                      className: "flex-1 bg-gray-300 text-gray-700 py-2 rounded text-sm hover:bg-gray-400"
                    }, 'Cancel')
                  )
                ) :
                React.createElement('button', {
                  onClick: () => setAddingElementTo(project.id),
                  className: "w-full mt-3 border-2 border-dashed border-gray-300 text-gray-600 py-2 rounded hover:border-indigo-400 hover:text-indigo-600 flex items-center justify-center gap-2"
                },
                  React.createElement(Plus, {size: 18}),
                  'Add Task'
                )
            )
          )
        )
    )
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  React.createElement(ProjectTimeTracker)
);

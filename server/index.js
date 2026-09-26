import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const DB_FILE = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());

// Helper function to read database safely
const readDB = () => {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading DB:', err);
    return null;
  }
};

// Helper function to write database safely
const writeDB = (data) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing DB:', err);
    return false;
  }
};

// Helper function to log audit history entries
const logHistory = (db, adminName, action, entityType, entityId, entityName, details) => {
  if (!db.history) db.history = [];
  const historyEntry = {
    id: `hist_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    adminName: adminName || 'Admin User',
    action, // e.g. EDIT, CREATE, DELETE, STATUS_CHANGE
    entityType, // e.g. PROJECT, TASK, IDEA, TEAM
    entityId,
    entityName,
    details,
    timestamp: new Date().toISOString()
  };
  db.history.unshift(historyEntry);
  return historyEntry;
};

// --- REST API ENDPOINTS ---

// 1. Get full state
app.get('/api/state', (req, res) => {
  const db = readDB();
  if (!db) return res.status(500).json({ error: 'Failed to read database.' });
  res.json(db);
});

// 2. Admin Auth Login & Name Capture
app.post('/api/auth/login', (req, res) => {
  const { email, password, adminName } = req.body;
  const db = readDB();
  if (!db) return res.status(500).json({ error: 'Database unavailable.' });

  if (email === db.admin.email && password === db.admin.password) {
    const capturedName = adminName ? adminName.trim() : 'Admin';
    logHistory(db, capturedName, 'ADMIN_LOGIN', 'AUTH', 'session_01', 'Admin Session', `Admin '${capturedName}' logged into Operations Center.`);
    writeDB(db);
    return res.json({
      success: true,
      adminName: capturedName,
      message: `Welcome ${capturedName}! Admin access granted.`
    });
  } else {
    return res.status(401).json({ success: false, error: 'Invalid Admin credentials.' });
  }
});

// 3. Projects CRUD
app.post('/api/projects', (req, res) => {
  const { project, adminName } = req.body;
  const db = readDB();
  if (!db) return res.status(500).json({ error: 'DB error' });

  const newProject = {
    id: `proj_${Date.now()}`,
    ...project,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.projects.unshift(newProject);
  logHistory(db, adminName, 'CREATE_PROJECT', 'PROJECT', newProject.id, newProject.name, `Created project '${newProject.name}' (${newProject.category}).`);
  writeDB(db);
  res.json({ success: true, project: newProject });
});

app.put('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  const { updates, adminName } = req.body;
  const db = readDB();
  if (!db) return res.status(500).json({ error: 'DB error' });

  const index = db.projects.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ error: 'Project not found' });

  const oldProject = db.projects[index];
  const updatedProject = {
    ...oldProject,
    ...updates,
    updatedAt: new Date().toISOString()
  };

  db.projects[index] = updatedProject;
  logHistory(db, adminName, 'EDIT_PROJECT', 'PROJECT', id, updatedProject.name, `Updated project '${updatedProject.name}'. Modified progress to ${updatedProject.progress}%.`);
  writeDB(db);
  res.json({ success: true, project: updatedProject });
});

app.delete('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  const { adminName } = req.body || {};
  const db = readDB();
  if (!db) return res.status(500).json({ error: 'DB error' });

  const project = db.projects.find(p => p.id === id);
  if (!project) return res.status(404).json({ error: 'Project not found' });

  db.projects = db.projects.filter(p => p.id !== id);
  logHistory(db, adminName, 'DELETE_PROJECT', 'PROJECT', id, project.name, `Deleted project '${project.name}'.`);
  writeDB(db);
  res.json({ success: true, message: `Project '${project.name}' deleted.` });
});

// 4. Tasks & Work Queue CRUD
app.post('/api/tasks', (req, res) => {
  const { task, adminName } = req.body;
  const db = readDB();
  if (!db) return res.status(500).json({ error: 'DB error' });

  const newTask = {
    id: `task_${Date.now()}`,
    ...task,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.tasks.unshift(newTask);
  logHistory(db, adminName, 'CREATE_TASK', 'TASK', newTask.id, newTask.title, `Created task '${newTask.title}' in ${newTask.type}.`);
  writeDB(db);
  res.json({ success: true, task: newTask });
});

app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { updates, adminName } = req.body;
  const db = readDB();
  if (!db) return res.status(500).json({ error: 'DB error' });

  const index = db.tasks.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ error: 'Task not found' });

  const oldTask = db.tasks[index];
  const updatedTask = {
    ...oldTask,
    ...updates,
    updatedAt: new Date().toISOString()
  };

  db.tasks[index] = updatedTask;
  const detailStr = updates.status ? `Status changed to '${updatedTask.status}'` : `Updated task '${updatedTask.title}'.`;
  logHistory(db, adminName, 'EDIT_TASK', 'TASK', id, updatedTask.title, detailStr);
  writeDB(db);
  res.json({ success: true, task: updatedTask });
});

app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { adminName } = req.body || {};
  const db = readDB();
  if (!db) return res.status(500).json({ error: 'DB error' });

  const task = db.tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  db.tasks = db.tasks.filter(t => t.id !== id);
  logHistory(db, adminName, 'DELETE_TASK', 'TASK', id, task.title, `Deleted task '${task.title}'.`);
  writeDB(db);
  res.json({ success: true, message: `Task '${task.title}' deleted.` });
});

// 5. Future Ideas CRUD
app.post('/api/ideas', (req, res) => {
  const { idea, adminName } = req.body;
  const db = readDB();
  if (!db) return res.status(500).json({ error: 'DB error' });

  const newIdea = {
    id: `idea_${Date.now()}`,
    ...idea,
    createdAt: new Date().toISOString()
  };

  db.ideas.unshift(newIdea);
  logHistory(db, adminName, 'CREATE_IDEA', 'IDEA', newIdea.id, newIdea.title, `Added future idea '${newIdea.title}'.`);
  writeDB(db);
  res.json({ success: true, idea: newIdea });
});

app.put('/api/ideas/:id', (req, res) => {
  const { id } = req.params;
  const { updates, adminName } = req.body;
  const db = readDB();
  if (!db) return res.status(500).json({ error: 'DB error' });

  const index = db.ideas.findIndex(i => i.id === id);
  if (index === -1) return res.status(404).json({ error: 'Idea not found' });

  const updatedIdea = { ...db.ideas[index], ...updates };
  db.ideas[index] = updatedIdea;
  logHistory(db, adminName, 'EDIT_IDEA', 'IDEA', id, updatedIdea.title, `Updated idea '${updatedIdea.title}' (Status: ${updatedIdea.status}).`);
  writeDB(db);
  res.json({ success: true, idea: updatedIdea });
});

app.delete('/api/ideas/:id', (req, res) => {
  const { id } = req.params;
  const { adminName } = req.body || {};
  const db = readDB();
  if (!db) return res.status(500).json({ error: 'DB error' });

  const idea = db.ideas.find(i => i.id === id);
  if (!idea) return res.status(404).json({ error: 'Idea not found' });

  db.ideas = db.ideas.filter(i => i.id !== id);
  logHistory(db, adminName, 'DELETE_IDEA', 'IDEA', id, idea.title, `Deleted idea '${idea.title}'.`);
  writeDB(db);
  res.json({ success: true, message: `Idea deleted.` });
});

// 6. Team Members CRUD
app.post('/api/team', (req, res) => {
  const { member, adminName } = req.body;
  const db = readDB();
  if (!db) return res.status(500).json({ error: 'DB error' });

  const newMember = {
    id: `team_${Date.now()}`,
    ...member
  };

  db.team.push(newMember);
  logHistory(db, adminName, 'CREATE_TEAM', 'TEAM', newMember.id, newMember.name, `Registered team member '${newMember.name}' (${newMember.role}).`);
  writeDB(db);
  res.json({ success: true, member: newMember });
});

app.put('/api/team/:id', (req, res) => {
  const { id } = req.params;
  const { updates, adminName } = req.body;
  const db = readDB();
  if (!db) return res.status(500).json({ error: 'DB error' });

  const index = db.team.findIndex(m => m.id === id);
  if (index === -1) return res.status(404).json({ error: 'Member not found' });

  const updatedMember = { ...db.team[index], ...updates };
  db.team[index] = updatedMember;
  logHistory(db, adminName, 'EDIT_TEAM', 'TEAM', id, updatedMember.name, `Updated team profile for '${updatedMember.name}'.`);
  writeDB(db);
  res.json({ success: true, member: updatedMember });
});

app.delete('/api/team/:id', (req, res) => {
  const { id } = req.params;
  const { adminName } = req.body || {};
  const db = readDB();
  if (!db) return res.status(500).json({ error: 'DB error' });

  const member = db.team.find(m => m.id === id);
  if (!member) return res.status(404).json({ error: 'Member not found' });

  db.team = db.team.filter(m => m.id !== id);
  logHistory(db, adminName, 'DELETE_TEAM', 'TEAM', id, member.name, `Removed team member '${member.name}'.`);
  writeDB(db);
  res.json({ success: true, message: `Team member deleted.` });
});

// 7. Get History Audit Log
app.get('/api/history', (req, res) => {
  const db = readDB();
  if (!db) return res.status(500).json({ error: 'DB error' });
  res.json(db.history || []);
});

// 8. Start server
app.listen(PORT, () => {
  console.log(`D-CORE Operations REST API Server running on port ${PORT}`);
});

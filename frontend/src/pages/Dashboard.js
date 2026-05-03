import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import TaskForm from '../components/TaskForm';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const { user, logout } = useContext(AuthContext);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const updateStatus = async (id) => {
    try {
      await api.patch(`/tasks/${id}`, { status: 'Done' });
      fetchTasks();
    } catch (err) {
      alert('Failed to update task status.');
    }
  };

  const overdueCount = tasks.filter(
    (t) => new Date(t.deadline) < new Date() && t.status !== 'Done'
  ).length;

  return (
    <div className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>Dashboard</h1>
          <p style={{ color: '#64748b', margin: 0 }}>Role: {user?.role}</p>
        </div>
        <button onClick={logout} style={{ background: '#ef4444', width: 'auto' }}>
          Logout
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card">
          <div style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: '600' }}>TOTAL TASKS</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{tasks.length}</div>
        </div>
        <div className="card" style={{ borderLeft: '4px solid #ef4444' }}>
          <div style={{ color: '#ef4444', fontSize: '0.875rem', fontWeight: '600' }}>OVERDUE</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444' }}>{overdueCount}</div>
        </div>
      </div>

      {user?.role === 'Admin' && (
        <div className="card" style={{ background: '#eff6ff', marginBottom: '2rem' }}>
          <h3 style={{ marginTop: 0 }}>Assign New Task</h3>
          <TaskForm onTaskCreated={fetchTasks} />
        </div>
      )}

      <h3 style={{ marginBottom: '1rem' }}>Task List</h3>
      {tasks.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: '#64748b' }}>No tasks assigned yet.</div>
      ) : (
        tasks.map((t) => (
          <div key={t._id} className="task-card">
            <div>
              <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{t.title}</div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                Deadline: {new Date(t.deadline).toLocaleDateString()}
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ 
                fontSize: '0.75rem', 
                fontWeight: '700',
                padding: '4px 8px', 
                borderRadius: '4px',
                background: t.status === 'Done' ? '#dcfce7' : '#fef9c3',
                color: t.status === 'Done' ? '#166534' : '#854d0e',
                textTransform: 'uppercase'
              }}>
                {t.status}
              </span>
              
              {t.status !== 'Done' && (
                <button 
                  onClick={() => updateStatus(t._id)}
                  style={{ padding: '6px 12px', fontSize: '0.875rem', background: '#22c55e', width: 'auto' }}
                >
                  Complete
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Dashboard;
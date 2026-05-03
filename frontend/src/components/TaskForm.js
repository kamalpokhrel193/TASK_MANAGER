import { useState, useEffect } from 'react';
import api from '../services/api';

const TaskForm = ({ onTaskCreated }) => {
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const res = await api.get('/auth/users');
        console.log("Debug: Members fetched ->", res.data);
        setMembers(res.data);
      } catch (err) {
        console.error('Frontend error fetching members:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!assignedTo || assignedTo === "") {
      return alert('Please select a valid team member');
    }

    try {
      await api.post('/tasks', { 
        title, 
        deadline, 
        assignedTo, 
        project: 'General Project' 
      });
      
      setTitle('');
      setDeadline('');
      setAssignedTo('');
      
      if (onTaskCreated) onTaskCreated();
      alert('Task assigned successfully!');
    } catch (err) {
      console.error("Task creation error:", err.response?.data);
      alert(err.response?.data?.message || 'Failed to create task.');
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
      <h3 style={{ marginBottom: '15px', fontSize: '1rem', color: '#1e293b' }}>Assign New Task</h3>
      
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '15px', alignItems: 'end' }}>
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '5px' }}>TASK TITLE</label>
          <input 
            type="text" 
            placeholder="e.g. Design UI" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
        </div>

        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '5px' }}>DEADLINE</label>
          <input 
            type="date" 
            value={deadline} 
            onChange={(e) => setDeadline(e.target.value)} 
            required 
          />
        </div>

        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '5px' }}>ASSIGN TO</label>
          <select 
            value={assignedTo} 
            onChange={(e) => setAssignedTo(e.target.value)} 
            required
            style={{ width: '100%' }}
          >
            <option value="">{loading ? 'Loading...' : 'Select Member'}</option>
            {members.length > 0 ? (
              members.map(user => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))
            ) : (
              !loading && <option disabled>No members found</option>
            )}
          </select>
        </div>

        <button type="submit" className="btn-primary" style={{ padding: '10px 25px' }}>
          Assign
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
import React, { useState } from 'react';
import axios from 'axios';

export default function LeaveForm(){
  const [form, setForm] = useState({
    employeeName: '',
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [msg, setMsg] = useState('');

  const handleChange = e => setForm({...form, [e.target.name]: e.target.value});

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/leaves', form); // proxy will forward to http://localhost:5000
      setMsg('Leave created: ' + (res.data._id || 'OK'));
    } catch(err){
      setMsg('Error: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input name="employeeName" placeholder="Employee Name" value={form.employeeName} onChange={handleChange} required /><br/>
        <input name="leaveType" placeholder="Leave Type" value={form.leaveType} onChange={handleChange} /><br/>
        <input name="startDate" type="date" value={form.startDate} onChange={handleChange} /><br/>
        <input name="endDate" type="date" value={form.endDate} onChange={handleChange} /><br/>
        <textarea name="reason" placeholder="Reason" value={form.reason} onChange={handleChange} /><br/>
        <button type="submit">Submit</button>
      </form>
      <div style={{marginTop:10}}>{msg}</div>
    </div>
  );
}
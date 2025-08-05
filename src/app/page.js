'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    area: '',
    remarks: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>Data Collection Form for IYF GZB</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input name="name" placeholder="Name" onChange={handleChange} />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} />
        <input name="phone" placeholder="Phone" onChange={handleChange} />

        {/* Updated area as a select dropdown */}
        <select name="area" onChange={handleChange} value={formData.area}>
          <option value="">Select Area</option>
          <option value="muradnagar">Muradnagar</option>
          <option value="temple preaching">Temple Preaching</option>
          <option value="south ghaziabad">South Ghaziabad</option>
          <option value="east ghaziabad">East Ghaziabad</option>
        </select>

        <textarea
          name="remarks"
          placeholder="Remarks (optional)"
          rows="4"
          onChange={handleChange}
        />
        <button type="submit">Submit</button>
      </form>
      {message && <p className={styles.message}>{message}</p>}
    </main>
  );
}

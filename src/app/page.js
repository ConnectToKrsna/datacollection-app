'use client';

import { useState } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
export default function Home() {
  const initialForm = {
    name: '',
    email: '',
    phone: '',
    area: '',
    remarks: '',
  };

  const [formData, setFormData] = useState(initialForm);
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

    if (res.ok) {
      alert('Submitted successfully!');
      setFormData(initialForm); // Reset form
    }
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>Data Collection Form for IYF GZB</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
        />

        <select
          name="area"
          value={formData.area}
          onChange={handleChange}
        >
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
          value={formData.remarks}
          onChange={handleChange}
        />
        <button type="submit">Submit</button>
      </form>
      {message && <p className={styles.message}>{message}</p>}

      <p className={styles.link}>
  <Link href="/list">View Registered Data</Link>
</p>
    </main>
  );
}

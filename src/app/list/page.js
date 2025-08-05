'use client';

import { useEffect, useState } from 'react';
import styles from './list.module.css';

export default function ListPage() {
  const [data, setData] = useState([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [inputPassword, setInputPassword] = useState('');
  const correctPassword = 'iyfsecret123';

  useEffect(() => {
    if (authenticated) {
      async function fetchData() {
        const res = await fetch('/api/list');
        const result = await res.json();
        setData(result.entries || []);
      }

      fetchData();
    }
  }, [authenticated]);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (inputPassword === correctPassword) {
      setAuthenticated(true);
    } else {
      alert('Incorrect password!');
      setInputPassword('');
    }
  };

  const downloadCSV = () => {
    if (!data || data.length === 0) return;

    const header = ['Name', 'Email', 'Phone', 'Area', 'Remarks'];
    const rows = data.map(entry =>
      [entry.name, entry.email, entry.phone, entry.area, entry.remarks]
        .map(value => `"${String(value || '').replace(/"/g, '""')}"`)
        .join(',')
    );

    const csvContent = [header.join(','), ...rows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'registrations.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className={styles.container}>
      {!authenticated ? (
        <form onSubmit={handlePasswordSubmit} className={styles.passwordForm}>
          <h2 className={styles.heading}>Enter Password to Access the List</h2>
          <input
            type="password"
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
            placeholder="Enter password"
            className={styles.passwordInput}
          />
          <button type="submit" className={styles.downloadBtn}>
            Submit
          </button>
        </form>
      ) : (
        <>
          <h1 className={styles.heading}>Registered Users</h1>

          {data.length > 0 && (
            <button className={styles.downloadBtn} onClick={downloadCSV}>
              Download as CSV
            </button>
          )}

          {data.length === 0 ? (
            <p>No data available.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Area</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {data.map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.name}</td>
                    <td>{entry.email}</td>
                    <td>{entry.phone}</td>
                    <td>{entry.area}</td>
                    <td>{entry.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </main>
  );
}

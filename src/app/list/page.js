'use client';

import { useEffect, useState } from 'react';
import styles from './list.module.css';

const ENTRIES_PER_PAGE = 25;
const AREAS = ['All', 'Muradnagar', 'Temple Preaching', 'South Ghaziabad', 'East Ghaziabad'];

export default function ListPage() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [areaFilter, setAreaFilter] = useState('All');
  const [authenticated, setAuthenticated] = useState(false);
  const [inputPassword, setInputPassword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
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

  // Filter logic
  useEffect(() => {
    if (areaFilter === 'All') {
      setFilteredData(data);
    } else {
      setFilteredData(data.filter(entry => entry.area?.toLowerCase() === areaFilter.toLowerCase()));
    }
    setCurrentPage(1); // Reset to first page on filter change
  }, [areaFilter, data]);

  const totalPages = Math.ceil(filteredData.length / ENTRIES_PER_PAGE);
  const currentData = filteredData.slice(
    (currentPage - 1) * ENTRIES_PER_PAGE,
    currentPage * ENTRIES_PER_PAGE
  );

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
    if (!filteredData || filteredData.length === 0) return;

    const header = ['Name', 'Email', 'Phone', 'Area', 'Remarks'];
    const rows = filteredData.map(entry =>
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

          <div className={styles.controls}>
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className={styles.select}
            >
              {AREAS.map(area => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>

            <button className={styles.downloadBtn} onClick={downloadCSV}>
              Download CSV
            </button>
          </div>

          {currentData.length === 0 ? (
            <p>No data available.</p>
          ) : (
            <>
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
                  {currentData.map((entry, index) => (
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

              <div className={styles.pagination}>
                <button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </>
      )}
    </main>
  );
}

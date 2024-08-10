import React, { useState } from 'react';

function App() {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await fetch(`/api/search?keyword=${keyword}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error fetching the data: ", error);
    }
  };

  return (
    <div className="App">
      <h1>Market Index Search</h1>
      <input 
        type="text" 
        value={keyword} 
        onChange={(e) => setKeyword(e.target.value)} 
        placeholder="Enter index name"
      />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {results.map((result, index) => (
          <li key={index}>
            <strong>{result.idxNm}</strong>: Close Price - {result.clpr}, Change - {result.vs}, Change Rate - {result.fltRt}%
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
import React, { useState } from 'react';

function App() {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const response = await fetch(`/api/search?keyword=${keyword}`);
    const data = await response.json();
    setResults(data);
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
          <li key={index}>{result.idxNm} - {result.clpr}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
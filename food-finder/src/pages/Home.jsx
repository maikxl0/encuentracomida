import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRandom, FaSearch } from "react-icons/fa";

function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  function handleSearch() {
    const term = searchTerm.trim();
    if (!term) {
      setErrorMessage("Escribe una comida primero.");
      return;
    }
    setErrorMessage("");
    navigate(`/collection/${encodeURIComponent(term)}`);
  }

  function handleRandomize() {
    setErrorMessage("");
    navigate("/collection/random");
  }

  return (
    <div className="page">
      <h1 className="title">Food Finder</h1>

      <div className="search-section">
        <input
          type="text"
          placeholder="Busca comida: pizza, sushi, tacos..."
          className="search-input"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") handleSearch();
          }}
        />

        <button className="search-button" onClick={handleSearch}>
          <FaSearch />
          Buscar
        </button>

        <button className="random-button" onClick={handleRandomize}>
          <FaRandom />
          Aleatorio
        </button>
      </div>

      {errorMessage && <p className="status-text error-text">{errorMessage}</p>}
    </div>
  );
}

export default Home;

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRandom, FaSearch } from "react-icons/fa";
import { getRandomFoodPhoto } from "../api/foodApi";

function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [randomImage, setRandomImage] = useState(null);
  const [isRandomLoading, setIsRandomLoading] = useState(false);
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

  async function handleRandomize() {
    setIsRandomLoading(true);
    setErrorMessage("");

    try {
      const image = await getRandomFoodPhoto();
      if (!image?.id) {
        throw new Error("No encontre imagen aleatoria.");
      }
      setRandomImage(image);
    } catch (error) {
      setErrorMessage(error.message || "No se pudo cargar imagen aleatoria.");
    } finally {
      setIsRandomLoading(false);
    }
  }

  useEffect(() => {
    void handleRandomize();
  }, []);

  return (
    <div className="page">
      <h1 className="title">Buscador de comidas</h1>

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

        <button
          className="random-button"
          onClick={() => void handleRandomize()}
          disabled={isRandomLoading}
        >
          <FaRandom />
          Aleatorio
        </button>
      </div>

      {errorMessage && <p className="status-text error-text">{errorMessage}</p>}

      <section className="home-random-section">
        {randomImage?.id && (
          <Link to={`/image/${randomImage.id}`} className="home-random-link">
            <img
              src={randomImage.urls?.regular || randomImage.urls?.small}
              alt={randomImage.alt_description || "Comida aleatoria"}
              className="home-random-image"
            />
          </Link>
        )}
      </section>
    </div>
  );
}

export default Home;

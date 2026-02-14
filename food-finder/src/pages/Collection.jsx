import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getRandomFoodPhoto, searchFoodPhotos } from "../api/foodApi";

function Collection() {
  const { query } = useParams();
  const decodedQuery = decodeURIComponent(query || "");
  const isRandomRoute = decodedQuery.toLowerCase() === "random";

  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("Coleccion");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadCollection() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        if (isRandomRoute) {
          const photo = await getRandomFoodPhoto();
          if (!photo?.id) throw new Error("No encontre imagen aleatoria.");
          setImages([photo]);
          setTitle("Comida aleatoria");
          return;
        }

        const response = await searchFoodPhotos(decodedQuery, 1, 20);
        setImages(response?.results ?? []);
        setTitle(`Resultados: "${decodedQuery}"`);
      } catch (error) {
        setErrorMessage(error.message || "No se pudo cargar la coleccion.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadCollection();
  }, [decodedQuery, isRandomRoute]);

  return (
    <div className="page">
      <div className="top-nav">
        <Link to="/" className="back-link">Volver al inicio</Link>
      </div>

      <h1 className="title">{title}</h1>

      {errorMessage && <p className="status-text error-text">{errorMessage}</p>}

      {!isLoading && !errorMessage && images.length === 0 && (
        <p className="status-text">No encontre imagenes.</p>
      )}

      {!isLoading && !errorMessage && images.length > 0 && (
        <div className="collection-grid">
          {images.map((image) => (
            <Link key={image.id} to={`/image/${image.id}`} className="image-card">
              <img
                src={image.urls?.small}
                alt={image.alt_description || "Comida"}
                className="collection-image"
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Collection;

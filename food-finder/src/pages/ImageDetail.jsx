import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getFoodPhotoById } from "../api/foodApi";

function ImageDetail() {
  const { imageId } = useParams();
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadImage() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const imageResponse = await getFoodPhotoById(imageId);
        if (!imageResponse?.urls?.regular) throw new Error("Imagen no encontrada.");
        setImage(imageResponse);
      } catch (error) {
        setErrorMessage(error.message || "No se pudo cargar el detalle.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadImage();
  }, [imageId]);

  return (
    <div className="page">
      <div className="top-nav">
        <Link to="/" className="back-link">Volver al inicio</Link>
      </div>

      <h1 className="title">Detalle</h1>

      {errorMessage && <p className="status-text error-text">{errorMessage}</p>}

      {!isLoading && !errorMessage && image && (
        <div className="detail-layout">
          <img
            src={image.urls.regular}
            alt={image.alt_description || "Comida"}
            className="detail-image"
          />
          <div className="detail-panel">
            <h2 className="detail-title">{image.alt_description || "Foto de comida"}</h2>
            <p><strong>ID:</strong> {image.id}</p>
            <p><strong>Fotografo:</strong> {image.user?.name || "Desconocido"}</p>
            <p><strong>Tamano:</strong> {image.width}x{image.height}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageDetail;

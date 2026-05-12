import threading
from sentence_transformers import SentenceTransformer
import numpy as np
from numpy.typing import NDArray

class Embedder:
    def __init__(self, model_name: str = "Voicelab/sbert-large-cased-pl"):
        self.model_name = model_name
        self._model = None
        self._embedding_size = None

    @property
    def model(self):
        if self._model is None:
            self._model = SentenceTransformer(self.model_name)
            # Ensure model is properly loaded before device transfer
            if hasattr(self._model, 'is_meta') and self._model.is_meta:
                self._model = self._model.to_empty(device='cpu')
            else:
                self._model = self._model.to(device='cpu')
        return self._model

    @property
    def embedding_size(self) -> int:
        if self._embedding_size is None:
            self._embedding_size = self.model.get_sentence_embedding_dimension()
        return self._embedding_size     # type: ignore

    def encode(self, text: str | list[str], batch_size: int = 32) -> np.ndarray:
        """
            For each value inside a list generates an embedding.
            Returns the array of embeddings i.e. res[i] = embedding(text[i]).
        """
        return self.model.encode(text, batch_size=batch_size, show_progress_bar=False)   # type: ignore

    def encode_chunks(self, chunks: list[str]) -> NDArray[np.float64]:
        """Generate embeddings for list of chunks and return there mean."""
        if not chunks:
            # no chunks return 0 vector
            return np.zeros(self.embedding_size)

        embeddings = self.encode(chunks)
        return np.mean(embeddings, axis=0)

    def combine_embeddings(self, embeddings: None | list[NDArray[np.float64]],
                           weights: None | list[float] = None) -> NDArray[np.float64]:
        """Combines embeddings into weighted embedding (mean if weights is None)"""
        if not embeddings:
            return np.zeros(self.embedding_size)

        if weights is None:
            return np.mean(embeddings, axis=0)
        else:
            if len(weights) != len(embeddings):
                raise ValueError("Number of values must be same as number of embeddings")

            # Normalize weights
            weights_sum = sum(weights)
            if weights_sum == 0:
                return np.mean(embeddings, axis=0)

            normalized_weights = [w / weights_sum for w in weights]

            weighted_embeddings = np.zeros(self.embedding_size)
            for emb, weight in zip(embeddings, normalized_weights):
                weighted_embeddings += emb * weight

            return weighted_embeddings

_embedder_instance = None
_embedder_lock = threading.Lock()

def get_embedder() -> Embedder:
    global _embedder_instance

    if _embedder_instance is None:
        with _embedder_lock:
            if _embedder_instance is None:
                _embedder_instance = Embedder()

    return _embedder_instance
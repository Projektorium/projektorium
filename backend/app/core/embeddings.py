import os
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
            token = os.getenv("HF_TOKEN")
            if not token:
                raise RuntimeError("Brak HF_TOKEN w środowisku")

            self._model = SentenceTransformer(
                # "sdadas/st-polish-paraphrase-from-distilroberta",
                "sdadas/stella-pl",
                device="cpu",
                token=token
            )
        return self._model

    @property
    def embedding_size(self) -> int:
        if self._embedding_size is None:
            self._embedding_size = self.model.get_sentence_embedding_dimension()
        return self._embedding_size

    def encode(self, text: str | list[str], batch_size: int = 32) -> np.ndarray:
        return self.model.encode(text, batch_size=batch_size, show_progress_bar=False)

    def encode_chunks(self, chunks: list[str]) -> NDArray[np.float64]:
        if not chunks:
            return np.zeros(self.embedding_size, dtype=np.float64)

        embeddings = self.encode(chunks)
        return np.mean(embeddings, axis=0, dtype=np.float64)

    def combine_embeddings(
        self,
        embeddings: None | list[NDArray[np.float64]],
        weights: None | list[float] = None
    ) -> NDArray[np.float64]:
        if not embeddings:
            return np.zeros(self.embedding_size, dtype=np.float64)

        if weights is None:
            return np.mean(embeddings, axis=0, dtype=np.float64)

        if len(weights) != len(embeddings):
            raise ValueError("Number of values must be same as number of embeddings")

        weights_sum = sum(weights)
        if weights_sum == 0:
            return np.mean(embeddings, axis=0, dtype=np.float64)

        normalized_weights = [w / weights_sum for w in weights]

        weighted_embeddings = np.zeros(self.embedding_size, dtype=np.float64)
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
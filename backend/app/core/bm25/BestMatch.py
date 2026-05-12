from typing import Any, Sequence
from abc import ABC, abstractmethod
import threading
import math
import re
from collections import Counter
from sqlmodel import Session


class BestMatch(ABC):
    """
    Base class for BM25 search implementation.
    Provides thread-safe IDF calculation and BM25 scoring.
    """
    def __init__(self, k1: float = 1.5, b: float = 0.75):
        self.k1 = k1  # Controls term frequency saturation
        self.b = b    # Controls document length normalization
        self.lock = threading.Lock()
        self.idf: dict[str, float] = {}
        self.avgdl: float = 0.0  # Average document length
        self.total_docs: int = 0

    @staticmethod
    def tokenize(text: str) -> list[str]:
        """Tokenize text into words, lowercase and remove punctuation."""
        # Remove markdown.
        text = text.replace('*', '')
        text = re.sub(r'[^\w\s]', ' ', text.lower())
        # Split on whitespace and filter out empty strings
        return [word for word in text.split() if word]

    @staticmethod
    def compute_term_frequency(text: str) -> dict[str, int]:
        tokens = BestMatch.tokenize(text)
        return dict(Counter(tokens))

    def __compute_idf(self, term: str, doc_freq: int, total_docs: int) -> float:
        """ Compute IDF for a `term` given its document frequency, i.e.
            the number of documents where this `term` is present.
        """
        if total_docs == 0:
            return 0.0
        # BM25 IDF formula: log((N - df + 0.5) / (df + 0.5) + 1) https://en.wikipedia.org/wiki/Okapi_BM25
        return math.log((total_docs - doc_freq + 0.5) / (doc_freq + 0.5) + 1)

    def update_idf(self, session: Session) -> None:
        """
        Update IDF values from database.
        Computes new values locally first, then updates shared dict with minimal lock time.
        """
        # Compute new IDF values
        new_idf, new_avgdl, new_total_docs = self._update_idf_internal(session)

        with self.lock:
            self.idf = new_idf
            self.avgdl = new_avgdl
            self.total_docs = new_total_docs

    @abstractmethod
    def _update_idf_internal(self, session: Session) -> tuple[dict[str, float], float, int]:
        """
            Returns idf dic, avgdl, number of docs.
        """
        pass

    @abstractmethod
    def get_document_text(self, doc: Any) -> str:
        """Extract searchable text from a document."""
        pass

    def compute_bm25_score(self, query: str, document: Any) -> float:
        """
        Compute BM25 score for a document given a query.
        Thread-safe for IDF access.
        """
        query_terms = self.tokenize(query)
        doc_text = self.get_document_text(document)
        doc_terms = self.compute_term_frequency(doc_text)
        doc_length = sum(doc_terms.values())

        score = 0.0

        with self.lock:
            # If IDF is empty, return 0
            if not self.idf or self.avgdl == 0:
                return 0.0

            for term in query_terms:
                if term not in self.idf:
                    continue

                tf = doc_terms.get(term, 0)
                idf = self.idf[term]

                # BM25 formula
                numerator = idf * tf * (self.k1 + 1)
                denominator = tf + self.k1 * (1 - self.b + self.b * (doc_length / self.avgdl))

                score += numerator / denominator

        return score

    def compute_self_bm25_score(self, document: Any) -> float:
        """
        Compute BM25 score for a document using itself as the query.
        This measures how well the document's terms represent themselves.
        Thread-safe for IDF access.
        """
        doc_text = self.get_document_text(document)
        doc_terms = self.compute_term_frequency(doc_text)
        doc_length = sum(doc_terms.values())

        # Use document terms as query terms (unique terms only)
        query_terms = list(doc_terms.keys())

        score = 0.0

        with self.lock:
            # If IDF is empty, return 0
            if not self.idf or self.avgdl == 0:
                return 0.0

            for term in query_terms:
                if term not in self.idf:
                    continue

                tf = doc_terms[term]  # We know this term exists in doc_terms
                idf = self.idf[term]

                # BM25 formula
                numerator = idf * tf * (self.k1 + 1)
                denominator = tf + self.k1 * (1 - self.b + self.b * (doc_length / self.avgdl))

                score += numerator / denominator

        return score

    def _compute_idf_from_documents(self, documents: Sequence[Any]) -> tuple[dict[str, float], float, int]:
        """
        Generic method to compute IDF values from any iterable of documents.
        """
        total_docs = len(documents)

        if total_docs == 0:
            return {}, 0.0, 0

        # Calculate document frequencies
        term_doc_freq: dict[str, int] = {}
        total_length = 0

        for doc in documents:
            doc_text = self.get_document_text(doc)
            terms = set(self.tokenize(doc_text))  # Unique terms per document
            total_length += len(self.tokenize(doc_text))  # Total terms for avgdl

            for term in terms:
                term_doc_freq[term] = term_doc_freq.get(term, 0) + 1

        # Calculate average document length
        avgdl = total_length / total_docs if total_docs > 0 else 0.0

        # Calculate IDF for each term
        idf_dict = {}
        for term, doc_freq in term_doc_freq.items():
            idf_dict[term] = self.__compute_idf(term, doc_freq, total_docs)

        return idf_dict, avgdl, total_docs





# def get_user_bm25() -> UserBestMatch:
#     return user_bm25


# # Example of a background task to update IDF periodically
# def update_all_bm25_indices(session: Session):
#     """Update all BM25 indices. Can be run as a background task."""
#     project_bm25.update_idf(session)
#     user_bm25.update_idf(session)
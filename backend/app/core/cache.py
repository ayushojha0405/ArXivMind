import threading
import time
from typing import Any, Hashable, Optional


class TTLCache:
    """Thread-safe in-memory cache with TTL eviction."""

    def __init__(self, maxsize: int = 256, ttl_seconds: int = 300):
        self.maxsize = maxsize
        self.ttl_seconds = ttl_seconds
        self._cache: dict[Hashable, tuple[Any, float]] = {}
        self._lock = threading.Lock()

    def get(self, key: Hashable) -> Optional[Any]:
        with self._lock:
            entry = self._cache.get(key)
            if entry is None:
                return None
            value, expiry = entry
            if time.monotonic() > expiry:
                del self._cache[key]
                return None
            return value

    def set(self, key: Hashable, value: Any) -> None:
        with self._lock:
            if len(self._cache) >= self.maxsize and key not in self._cache:
                oldest_key = min(self._cache, key=lambda k: self._cache[k][1])
                del self._cache[oldest_key]
            self._cache[key] = (value, time.monotonic() + self.ttl_seconds)

    def clear(self) -> None:
        with self._lock:
            self._cache.clear()


search_cache = TTLCache(maxsize=512, ttl_seconds=300)
paper_list_cache = TTLCache(maxsize=1, ttl_seconds=600)

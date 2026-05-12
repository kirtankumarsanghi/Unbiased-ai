from __future__ import annotations

from typing import Optional

import httpx

from app.core.config import settings


class OpenAIClient:
    def __init__(self) -> None:
        self.api_key = settings.OPENAI_API_KEY
        self.base_url = settings.OPENAI_BASE_URL.rstrip("/")
        self.model = settings.OPENAI_MODEL
        self.timeout = settings.OPENAI_TIMEOUT_SECONDS

    def enabled(self) -> bool:
        return bool(self.api_key)

    async def generate_text(
        self,
        system_prompt: str,
        user_prompt: str,
        *,
        max_tokens: int = 220,
        temperature: float = 0.3,
    ) -> Optional[str]:
        if not self.enabled():
            return None

        payload = {
            "model": self.model,
            "temperature": temperature,
            "max_tokens": max_tokens,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
        }

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    headers=headers,
                    json=payload,
                )
                response.raise_for_status()
                data = response.json()
        except Exception:
            return None

        try:
            content = data["choices"][0]["message"]["content"]
        except Exception:
            return None

        return content.strip() or None


_client: OpenAIClient | None = None


def get_openai_client() -> OpenAIClient:
    global _client
    if _client is None:
        _client = OpenAIClient()
    return _client

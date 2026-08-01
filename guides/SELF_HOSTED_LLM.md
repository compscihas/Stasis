# Self-hosted LLM setup

Run an OpenAI-compatible server reachable from the phone. Examples include Ollama with its OpenAI compatibility endpoint, LM Studio, vLLM, or llama.cpp server.

Example `.env`:

```dotenv
STASIS_LLM_BASE_URL=http://192.168.1.50:8000/v1
STASIS_LLM_MODEL=llama3.1:8b
```

Build/run with `--dart-define-from-file=.env`, or configure the same values under AI Coach. API keys are optional for a trusted LAN server and stored in Keychain/Keystore when provided.

The server must accept `POST /v1/chat/completions` and return `choices[0].message`. Enable OpenAI tool calling for the best experience. If the model produces unreliable `tool_calls`, enable “Bounded context fallback.” That mode reads fixed allow-listed derived views locally, sends at most 48 KiB of JSON context, exposes no raw/GPS data, and does not execute write tools.

Use local HTTP only during development and only on a trusted private network. For production, place the model behind authenticated HTTPS (or an encrypted VPN), restrict ingress, and avoid prompt/body logs because derived health context is sensitive.

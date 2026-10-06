---
name: api-design
description: Resource-oriented API design following the Google API Design Guide, plus errors, pagination, idempotency and versioning. Use when designing or reviewing an HTTP/RPC API.
---

# Skill: API Design

## Orientação a recursos (Google API Design Guide)

- Modele a API como **recursos** (substantivos) organizados em hierarquia: `/customers/{id}/orders/{id}`.
- Use os **métodos padrão** antes de inventar outros: `List`, `Get`, `Create`, `Update`, `Delete` (HTTP: `GET` coleção, `GET`, `POST`, `PATCH`, `DELETE`).
- Métodos customizados só quando não couber nos padrões (ex.: `POST /orders/{id}:cancel`).
- Nomes consistentes, no plural para coleções, sem abreviações inventadas.

## Contratos

- **Erros:** status HTTP correto + corpo estável (`code`, `message`, `details`). Nunca exponha stack trace.
- **Paginação:** toda `List` pagina desde a primeira versão (`page_size` + `page_token`). Adicionar depois quebra clientes.
- **Idempotência:** operações que podem ser repetidas por retry (`POST` de pagamento, criação) aceitam uma `Idempotency-Key`.
- **Atualização parcial:** `PATCH` com os campos enviados (ou field mask), não substituição total implícita.
- **Versionamento:** versão maior no caminho (`/v1/`). Mudanças compatíveis (campo novo opcional) não exigem versão nova; remover ou renomear campo exige.

## Fonte da verdade

```text
contrato → OpenAPI → implementação → Postman / testes
```

- O arquivo OpenAPI é a fonte da verdade da API. Código, documentação e coleção do Postman derivam dele; nunca o contrário.
- Mudou o contrato? Atualize o OpenAPI primeiro, depois o código e a coleção.
- A coleção do Postman é gerada pela importação do OpenAPI, organizada por recurso, com environments (`local`, `staging`), variáveis (`{{base_url}}`, `{{token}}`) e testes por status documentado. Environments versionados nunca contêm tokens reais.

## Checklist de revisão

- [ ] Recursos e métodos padrão antes de customizados
- [ ] Formato de erro único em toda a API
- [ ] Listas paginadas
- [ ] Escritas repetíveis com idempotência
- [ ] Autenticação e autorização definidas por endpoint
- [ ] OpenAPI escrito antes da implementação e igual ao código
- [ ] Coleção do Postman gerada do OpenAPI, sem tokens reais

## Fonte

- Google Cloud, "API Design Guide": https://cloud.google.com/apis/design

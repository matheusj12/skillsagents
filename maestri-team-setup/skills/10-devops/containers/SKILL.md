---
name: containers
description: Build small, reproducible and safe container images following Docker's official build best practices. Use when writing or reviewing a Dockerfile or compose setup.
---

# Skill: Containers

## Princípio

A imagem final contém só o necessário para rodar, é reproduzível e não roda como root.

## Quando usar

Escrever ou revisar `Dockerfile`, `compose.yaml` ou a imagem de um serviço.

## Decisões

- **Multi-stage build:** compile num estágio, copie só o artefato para o estágio final.
- **Imagem base:** oficial ou de publicador verificado, a menor que atende. Fixe a versão; em produção, fixe por digest (`imagem:tag@sha256:...`).
- **Cache:** instruções que mudam pouco primeiro; `apt-get update` e `install` no mesmo `RUN`.
- **Contexto de build:** `.dockerignore` para tirar `.git`, `node_modules`, `.env` e builds locais.
- **Um container, uma responsabilidade;** containers efêmeros, sem estado local.
- **Usuário:** `USER` não-root sempre que o serviço não precisar de privilégio.
- **Secrets:** nunca em `ENV`, `ARG` ou camada da imagem; use build secrets ou injeção em runtime.
- **Saúde:** health check e logs em stdout/stderr.

## Erros comuns

- Imagem com ferramentas de build e código-fonte inteiro.
- `latest` como versão.
- `.env` copiado para dentro da imagem.
- Vários processos sem relação no mesmo container.

## Checklist

- [ ] Multi-stage e base mínima fixada
- [ ] `.dockerignore` presente
- [ ] Roda como não-root
- [ ] Nenhum secret na imagem (`docker history` limpo)
- [ ] Health check e logs em stdout

## Referências

- Docker, "Building best practices": https://docs.docker.com/build/building/best-practices/
- Docker, "Build secrets": https://docs.docker.com/build/building/secrets/

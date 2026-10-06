---
name: release-readiness
description: Final delivery checklist - exact deliverable, clean build, dependencies, env, migrations, containers, tests, leftovers and docs. Use before declaring anything ready to ship.
---

# Skill: Release Readiness

Pergunta: **isso pode ser entregue agora, por outra pessoa, numa máquina limpa?**

## 1. Entregável

- [ ] O escopo do entregável está explícito (ex.: só `back_end/`, um pacote, uma imagem).
- [ ] Nada além do entregável está incluído; nada dele está faltando.

## 2. Build e dependências

- [ ] Build limpo a partir de um clone novo, sem cache local.
- [ ] Dependências declaradas e travadas (lockfile versionado).
- [ ] Nenhuma dependência só da máquina de quem desenvolveu.

## 3. Configuração

- [ ] `.env.example` com todas as variáveis necessárias e valores fictícios.
- [ ] Nenhum `.env` real, secret, token ou chave no entregável.
- [ ] Configuração de produção separada da de desenvolvimento.

## 4. Dados

- [ ] Migrations versionadas, aplicam do zero e sobre a versão anterior.
- [ ] Plano de rollback para mudanças de schema.

## 5. Execução

- [ ] Docker/compose sobe o sistema com o comando documentado.
- [ ] Health check responde.
- [ ] Testes passam no CI.

## 6. API

- [ ] OpenAPI, implementação e coleção do Postman descrevem as mesmas rotas, schemas e status.
- [ ] Environments do Postman sem tokens ou senhas reais.

## 7. Limpeza

- [ ] Sem arquivos temporários, logs, dumps, `node_modules`, builds locais ou código de debug.
- [ ] `.gitignore` cobre o que não deve ser versionado.

## 8. Documentação

- [ ] README com setup, execução e variáveis (ver `15-documentation/project-docs`).
- [ ] Mudanças incompatíveis descritas.

## Veredito

`PRONTO` só com todos os itens aplicáveis marcados. Caso contrário `BLOQUEADO`, listando item, motivo e responsável.

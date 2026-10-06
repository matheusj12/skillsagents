---
name: schema-and-migrations
description: Relational schema design and zero-downtime migrations using expand/contract. Use when creating tables, changing columns or migrating data in production.
---

# Skill: Schema e Migrations

## Schema

- Modele a partir das consultas que o sistema precisa fazer, não só das entidades.
- Chave primária em toda tabela; chaves estrangeiras e `NOT NULL` para garantir integridade no banco, não só na aplicação.
- Índice para cada filtro e join frequente; meça antes de adicionar mais.
- Use o tipo certo (timestamps com fuso, decimal para dinheiro, nunca float para valores monetários).

## Migrations sem downtime: expand / contract

Nunca faça uma mudança incompatível em um passo. Divida em:

1. **Expand:** adicione o novo (coluna, tabela) sem remover o antigo. Código antigo continua funcionando.
2. **Migrate:** a aplicação passa a escrever nos dois; faça backfill dos dados existentes em lotes.
3. **Switch:** leituras passam para o novo.
4. **Contract:** quando nada mais usa o antigo, remova-o em uma migration separada.

## Regras

- Toda migration é versionada, revisada e testada em uma cópia realista dos dados.
- Tenha rollback ou um caminho de correção para cada passo.
- Backfills grandes rodam em lotes, fora da migration de schema, para não travar tabelas.
- Faça backup e confirme antes de qualquer operação destrutiva (`DROP`, `DELETE` em massa).

## Fonte

- Martin Fowler, "Parallel Change": https://martinfowler.com/bliki/ParallelChange.html
- PostgreSQL docs: https://www.postgresql.org/docs/current/ddl.html

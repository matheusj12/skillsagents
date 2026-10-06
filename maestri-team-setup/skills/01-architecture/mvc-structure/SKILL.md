---
name: mvc-structure
description: Default architecture for web applications and APIs - MVC layer responsibilities and folder structure, following the framework's own convention first. Use when starting or reviewing a web/API project.
---

# Skill: Estrutura MVC (padrão para web e API)

A equipe é genérica e atua em qualquer tipo de projeto. MVC é o padrão para **aplicações web e APIs**; em outro padrão nesses projetos, registre a justificativa em ADR (`15-documentation/architecture-decision-records`). Em projeto existente, siga a estrutura que já existe.

Não se aplica a CLI, biblioteca, pipeline de dados, modelo de ML, app mobile, automação ou infraestrutura: nesses casos o Software Architect escolhe o padrão adequado ao tipo de projeto.

## Responsabilidade de cada camada

| Camada | Faz | Não faz |
|---|---|---|
| **Model** | dados, validação de domínio, relacionamentos, acesso ao banco | HTTP, formatação de resposta, lógica de tela |
| **View** | apresentação (HTML, templates ou serialização da resposta) | regra de negócio, consulta ao banco |
| **Controller** | recebe a requisição, valida a entrada, chama model/service, devolve a view/resposta | regra de negócio extensa, SQL |
| **Service** (opcional) | regra de negócio que envolve vários models ou integrações externas | HTTP, apresentação |

Regra prática: **controller fino**. Quando um controller passa a conter regra de negócio, ela vai para um service.

## Convenção do framework primeiro

| Framework | Model | View | Controller | Rotas |
|---|---|---|---|---|
| Laravel | `app/Models/` | `resources/views/` | `app/Http/Controllers/` | `routes/` |
| Ruby on Rails | `app/models/` | `app/views/` | `app/controllers/` | `config/routes.rb` |
| ASP.NET Core MVC | `Models/` | `Views/` | `Controllers/` | atributos / `Program.cs` |
| Django (MTV) | `models.py` | `templates/` | `views.py` (papel de controller) | `urls.py` |

Use a estrutura do framework; não crie pastas paralelas a ela.

## Árvore padrão (quando o framework não define)

Ex.: Node/Express, FastAPI, Flask.

```text
src/
├── config/        configuração e variáveis de ambiente
├── routes/        mapeamento rota → controller
├── controllers/   um arquivo por recurso
├── services/      regras de negócio
├── models/        entidades e acesso a dados
├── views/         templates ou serializers de resposta
├── middlewares/   autenticação, logs, tratamento de erro
└── utils/         funções puras reutilizáveis
tests/             espelha a estrutura de src/
```

## Convenções

- Um recurso, um nome em todas as camadas: `orders` → `routes/orders`, `controllers/orders`, `services/orders`, `models/order`.
- Dependência só para baixo: route → controller → service → model. Model nunca importa controller.
- Testes espelham a pasta do código testado.

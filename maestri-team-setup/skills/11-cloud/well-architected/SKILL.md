---
name: well-architected
description: AWS Well-Architected Framework pillars as a cloud design and review checklist (provider-neutral). Use when designing or reviewing cloud infrastructure.
---

# Skill: Well-Architected (AWS)

Os seis pilares servem como checklist neutro de fornecedor para qualquer nuvem.

| Pilar | Pergunta central |
|---|---|
| **Excelência operacional** | Conseguimos operar, observar e mudar o sistema com segurança? (infra como código, deploys pequenos e reversíveis) |
| **Segurança** | Identidades com menor privilégio, dados criptografados, rastreabilidade? |
| **Confiabilidade** | O sistema se recupera de falhas? (múltiplas zonas, retries com backoff, backups testados) |
| **Eficiência de performance** | Os recursos certos para a carga, medidos? |
| **Otimização de custos** | Pagamos só pelo que usamos? Sabemos quanto cada parte custa? |
| **Sustentabilidade** | Minimizamos recursos ociosos e desperdício? |

## Regras

- Infraestrutura sempre declarativa e versionada (ex.: Terraform).
- Comece pelo serviço gerenciado mais simples que atende; evite operar o que o provedor já opera.
- Todo trade-off entre pilares (ex.: custo × confiabilidade) é decisão explícita, registrada.

## Fonte

- AWS Well-Architected Framework: https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html

---
name: simplicity-first
description: Team-wide engineering simplicity rules - think before coding, smallest correct change, no speculative abstraction, verify before declaring done. Use when designing, implementing or reviewing any change.
---

# Skill: Simplicity First

## Princípio

A solução certa é a mais simples que resolve o requisito por completo. Simplicidade não é etapa; é o critério de cada decisão.

## Regras

1. **Pense antes de codar:** declare as suposições; se o pedido tem duas leituras, escolha uma explicitamente ou pergunte.
2. **Menor mudança correta:** cada linha alterada se explica pelo requisito. Nada de "já que estou aqui".
3. **Sem especulação:** nenhuma abstração, configuração, camada ou dependência para uma necessidade futura que não existe.
4. **Reutilize antes de criar:** procure o que o projeto já tem.
5. **Verifique:** defina antes como provar que funciona e rode antes de dizer "pronto".

## Sinais de alerta

- Interface ou classe com uma única implementação "para o futuro".
- Arquivo de configuração para um valor que nunca muda.
- 200 linhas onde 20 resolvem.
- Refatoração fora do escopo da tarefa.

## Checklist

- [ ] Suposições declaradas
- [ ] Toda mudança se liga ao requisito
- [ ] Nenhuma abstração especulativa
- [ ] Resultado verificado por um comando que rodou

---

Inspirado nos princípios de Andrej Karpathy sobre programação com LLMs, como compilados em [multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills). Texto próprio; nada foi copiado.

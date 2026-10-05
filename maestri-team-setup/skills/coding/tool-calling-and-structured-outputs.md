# Skill: Tool Calling & Structured Outputs

## Padrões de Código para Integração de LLM

### 1. Function / Tool Calling
O LLM não executa código diretamente; ele retorna uma estrutura JSON especificando qual ferramenta chamar e com quais argumentos.

### 2. Structured Outputs
Garantir respostas estritamente no formato desejado utilizando bibliotecas de validação como **Pydantic** (Python) ou **Zod** (TypeScript/Node.js).

```python
from pydantic import BaseModel

class PedidoDelivery(BaseModel):
    id_pedido: str
    itens: list[str]
    valor_total: float
    status: str
```

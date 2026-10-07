---
name: secure-coding
description: Secure coding rules for implementers based on OWASP Top 10, ASVS and Cheat Sheets - access control, injection, secrets, dependencies, errors and logging. Use when writing or reviewing code that handles input, auth, data or dependencies.
---

# Skill: Secure Coding

## Princípio

Toda entrada é não confiável até ser validada, e todo acesso é negado até ser autorizado.

## Quando usar

Código que recebe entrada externa, autentica, autoriza, guarda dados sensíveis, chama outros serviços ou adiciona dependências. Threat modeling do sistema fica em `09-security/threat-modeling`.

## Decisões

- **Controle de acesso:** autorize no servidor em **toda** ação e recurso; nunca confie no front ou em IDs enviados pelo cliente.
- **Injeção:** queries parametrizadas; nunca concatene entrada em SQL, shell, caminhos ou templates.
- **Autenticação:** use biblioteca/serviço estabelecido; senhas com hash adaptativo (Argon2id, bcrypt); sessões e tokens com expiração.
- **Criptografia:** TLS em trânsito; algoritmos padrão de bibliotecas mantidas; nunca crypto próprio.
- **Secrets:** em variável de ambiente ou cofre; nunca no código, log ou repositório.
- **Dependências:** versões travadas no lockfile e varredura de vulnerabilidades (ex.: Trivy) no CI.
- **SSRF:** chamadas a URLs vindas do usuário só para destinos permitidos.
- **Erros e logs:** mensagem genérica para o cliente; detalhe no log sem dados sensíveis; registre eventos de segurança.

## Erros comuns

- Checar permissão só na interface.
- "Sanitizar" texto em vez de parametrizar.
- Stack trace na resposta da API.
- Token ou senha em log.

## Checklist

- [ ] Autorização no servidor em cada endpoint/ação
- [ ] Nenhuma concatenação de entrada em query ou comando
- [ ] Nenhum secret no código ou log
- [ ] Dependências travadas e verificadas
- [ ] Erros sem detalhe interno para o cliente

## Referências

- OWASP Top 10: https://owasp.org/Top10/
- OWASP ASVS: https://owasp.org/www-project-application-security-verification-standard/
- OWASP Cheat Sheet Series: https://cheatsheetseries.owasp.org/

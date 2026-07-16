# CLAUDE.md — Diretrizes do projeto RetratoFit IA

## Convenção de commits

Todos os commits deste projeto devem ser escritos em português do Brasil.

**Formato:** `tipo: descrição curta no imperativo`

### Tipos permitidos

| Tipo | Uso |
|---|---|
| `feat` | nova funcionalidade |
| `fix` | correção de bug |
| `docs` | alteração em documentação (README, comentários) |
| `refactor` | mudança de código que não altera comportamento |
| `style` | formatação, sem mudança de lógica |
| `chore` | configuração, dependências, tarefas de manutenção |
| `test` | adição ou ajuste de testes |

### Exemplos

```
feat: adiciona captura de foto via camera do navegador
fix: corrige import de tipos no api.ts
chore: configura .gitignore para proteger variaveis de ambiente
docs: atualiza README com instrucoes de setup
```

### Regras

- Descrição curta na primeira linha (até ~72 caracteres)
- Sem acentuação problemática que quebre terminal, mas pode usar português normal
- Corpo do commit (se necessário) também em português, explicando o "porquê", não só o "o quê"
- Nunca commitar em inglês, mesmo que o código esteja em inglês

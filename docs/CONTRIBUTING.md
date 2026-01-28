# ANASY - Padrões de Código e Contribuição

## 1. Estrutura de Pastas
- Siga a arquitetura Clean Architecture descrita em ARQUITETURA_TECNICA.md.
- Separe controllers, services, repositories, models, middleware, routes, utils, jobs, websocket, config.

## 2. Convenções de Código
- Use TypeScript em todo backend.
- Siga o padrão de nomenclatura camelCase para variáveis e funções, PascalCase para classes.
- Use async/await para operações assíncronas.
- Sempre trate erros com try/catch e delegue para middleware de erro.
- Use import/export ES6.

## 3. Commits
- Use Conventional Commits:
  - feat: Nova funcionalidade
  - fix: Correção de bug
  - docs: Documentação
  - refactor: Refatoração
  - test: Testes
  - chore: Tarefas de build/config

## 4. Pull Requests
- Sempre crie PRs para novas features/correções.
- Descreva claramente o que foi feito e relacione ao roadmap.
- Solicite revisão de pelo menos 1 membro.

## 5. Testes
- Todo service e controller deve ter testes unitários (Jest).
- Use mocks para dependências externas.
- Testes devem rodar limpos (npm test) antes de merge.

## 6. Lint e Prettier
- Rode `npm run lint` e `npm run format` antes de subir código.
- Corrija todos os avisos/erros de lint.

## 7. Segurança
- Nunca exponha segredos no código.
- Use variáveis de ambiente para credenciais.
- Senhas sempre com hash (bcrypt).

## 8. Documentação
- Atualize API_REFERENCE.md e docs relevantes a cada nova feature.
- Mantenha ARQUITETURA_TECNICA.md alinhado com a evolução do sistema.

## 9. Fluxo de Trabalho
1. Crie uma branch a partir de main.
2. Implemente a feature/correção.
3. Adicione/atualize testes.
4. Rode lint, format e test.
5. Abra PR e solicite revisão.
6. Faça merge após aprovação.

---

Para detalhes completos, consulte ARQUITETURA_TECNICA.md e ROADMAP_TECNICO.md.

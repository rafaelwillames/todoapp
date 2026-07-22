# TodoAPP

Aplicação de tarefas (to-do) leve, sem dependências e sem etapa de build.
Roda direto no navegador abrindo `index.html`.

## Funcionalidades

- **Adicionar** tarefas pelo formulário no topo.
- **Editar** o título (botão "Editar" ou duplo clique no título; `Enter` salva, `Esc` cancela).
- **Excluir** tarefas (botão "Excluir").
- **Marcar / desmarcar** como concluída (checkbox).
- Extras de apoio: filtros (Todas / Pendentes / Concluídas), contador de pendentes,
  "Limpar concluídas" e persistência automática via `localStorage`.

## Estrutura

| Arquivo       | Responsabilidade                                              |
| ------------- | ------------------------------------------------------------ |
| `index.html`  | Marcação e âncoras de UI.                                     |
| `styles.css`  | Estilos.                                                      |
| `app.js`      | Lógica de dados em funções puras (`todoOps`) + camada de DOM. |

A lógica central fica isolada em `todoOps` (`add`, `edit`, `remove`, `toggle`,
`clearCompleted`, `filter`), cada uma recebendo a lista atual e devolvendo uma
nova lista — sem efeitos colaterais — o que facilita testes e manutenção.

## Como executar

Abra `index.html` em qualquer navegador moderno. Não há instalação nem build.

O módulo também é importável em Node (`module.exports = todoOps`) caso se queira
escrever testes de unidade sobre as funções puras.

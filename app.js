/**
 * TodoAPP — gerenciamento de tarefas.
 *
 * Operações suportadas:
 *   - Adicionar tarefa
 *   - Editar título da tarefa
 *   - Excluir tarefa
 *   - Marcar / desmarcar tarefa como concluída
 *
 * A lógica de dados é mantida em funções puras (todoOps) para facilitar
 * testes e raciocínio; a camada de DOM apenas as orquestra.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "todoapp.tasks";

  /* ----------------------------------------------------------------------- *
   * Camada de dados — funções puras (não tocam no DOM nem no storage).
   * Cada função recebe a lista atual e devolve uma NOVA lista.
   * ----------------------------------------------------------------------- */
  var todoOps = {
    /** Cria um id razoavelmente único sem depender de libs externas. */
    createId: function () {
      return (
        Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
      );
    },

    /** Adiciona uma tarefa. Ignora títulos vazios. */
    add: function (tasks, title) {
      var clean = String(title == null ? "" : title).trim();
      if (clean === "") {
        return tasks;
      }
      var task = { id: todoOps.createId(), title: clean, completed: false };
      return tasks.concat([task]);
    },

    /** Edita o título de uma tarefa. Título vazio é ignorado (mantém o anterior). */
    edit: function (tasks, id, title) {
      var clean = String(title == null ? "" : title).trim();
      if (clean === "") {
        return tasks;
      }
      return tasks.map(function (t) {
        return t.id === id ? Object.assign({}, t, { title: clean }) : t;
      });
    },

    /** Remove uma tarefa pelo id. */
    remove: function (tasks, id) {
      return tasks.filter(function (t) {
        return t.id !== id;
      });
    },

    /** Marca / desmarca (alterna) a tarefa como concluída. */
    toggle: function (tasks, id) {
      return tasks.map(function (t) {
        return t.id === id
          ? Object.assign({}, t, { completed: !t.completed })
          : t;
      });
    },

    /** Remove todas as tarefas já concluídas. */
    clearCompleted: function (tasks) {
      return tasks.filter(function (t) {
        return !t.completed;
      });
    },

    /** Filtra a lista conforme "all" | "active" | "completed". */
    filter: function (tasks, mode) {
      if (mode === "active") {
        return tasks.filter(function (t) {
          return !t.completed;
        });
      }
      if (mode === "completed") {
        return tasks.filter(function (t) {
          return t.completed;
        });
      }
      return tasks.slice();
    },
  };

  // Exporta para ambientes de teste (ex.: Node) sem quebrar o navegador.
  if (typeof module !== "undefined" && module.exports) {
    module.exports = todoOps;
  }

  // Se não houver DOM (execução em Node para testes), encerra aqui.
  if (typeof document === "undefined") {
    return;
  }

  /* ----------------------------------------------------------------------- *
   * Estado + persistência
   * ----------------------------------------------------------------------- */
  var state = { tasks: [], filter: "all" };

  function load() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) {
        state.tasks = parsed.filter(function (t) {
          return t && typeof t.id === "string" && typeof t.title === "string";
        });
      }
    } catch (e) {
      state.tasks = [];
    }
  }

  function save() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
    } catch (e) {
      /* storage indisponível — segue apenas em memória */
    }
  }

  /* ----------------------------------------------------------------------- *
   * Referências de DOM
   * ----------------------------------------------------------------------- */
  var form = document.getElementById("new-task-form");
  var input = document.getElementById("new-task-input");
  var list = document.getElementById("task-list");
  var emptyState = document.getElementById("empty-state");
  var taskCount = document.getElementById("task-count");
  var clearBtn = document.getElementById("clear-completed");
  var filterButtons = document.querySelectorAll(".btn-filter");

  /* ----------------------------------------------------------------------- *
   * Renderização
   * ----------------------------------------------------------------------- */
  function render() {
    var visible = todoOps.filter(state.tasks, state.filter);
    list.textContent = "";

    visible.forEach(function (task) {
      list.appendChild(renderItem(task));
    });

    var hasTasks = state.tasks.length > 0;
    emptyState.hidden = visible.length > 0;
    emptyState.textContent = hasTasks
      ? "Nenhuma tarefa neste filtro."
      : "Nenhuma tarefa por aqui ainda.";

    var pending = todoOps.filter(state.tasks, "active").length;
    taskCount.textContent =
      pending === 1 ? "1 tarefa pendente" : pending + " tarefas pendentes";
  }

  function renderItem(task) {
    var li = document.createElement("li");
    li.className = "task-item" + (task.completed ? " completed" : "");
    li.dataset.id = task.id;

    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute(
      "aria-label",
      task.completed ? "Desmarcar tarefa" : "Marcar tarefa como concluída"
    );
    checkbox.addEventListener("change", function () {
      dispatch(todoOps.toggle(state.tasks, task.id));
    });

    var title = document.createElement("span");
    title.className = "task-title";
    title.textContent = task.title;
    // Duplo clique no título também abre a edição.
    title.addEventListener("dblclick", function () {
      startEditing(li, task);
    });

    var actions = document.createElement("div");
    actions.className = "task-actions";

    var editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "icon-btn edit";
    editBtn.textContent = "Editar";
    editBtn.setAttribute("aria-label", "Editar tarefa");
    editBtn.addEventListener("click", function () {
      startEditing(li, task);
    });

    var deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "icon-btn delete";
    deleteBtn.textContent = "Excluir";
    deleteBtn.setAttribute("aria-label", "Excluir tarefa");
    deleteBtn.addEventListener("click", function () {
      dispatch(todoOps.remove(state.tasks, task.id));
    });

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(checkbox);
    li.appendChild(title);
    li.appendChild(actions);
    return li;
  }

  /** Substitui o título por um input de edição inline. */
  function startEditing(li, task) {
    if (li.querySelector(".task-edit-input")) {
      return; // já em edição
    }
    var title = li.querySelector(".task-title");
    var editInput = document.createElement("input");
    editInput.type = "text";
    editInput.className = "task-edit-input";
    editInput.value = task.title;
    editInput.maxLength = 200;
    editInput.setAttribute("aria-label", "Editar título da tarefa");

    function commit() {
      var value = editInput.value.trim();
      // Se ficou vazio, mantém o título anterior (edit ignora vazio).
      dispatch(todoOps.edit(state.tasks, task.id, value));
    }

    function cancel() {
      render();
    }

    editInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        commit();
      } else if (e.key === "Escape") {
        cancel();
      }
    });
    editInput.addEventListener("blur", commit);

    li.replaceChild(editInput, title);
    editInput.focus();
    editInput.select();
  }

  /** Aplica uma nova lista de tarefas: atualiza estado, persiste e renderiza. */
  function dispatch(nextTasks) {
    state.tasks = nextTasks;
    save();
    render();
  }

  /* ----------------------------------------------------------------------- *
   * Eventos globais
   * ----------------------------------------------------------------------- */
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var next = todoOps.add(state.tasks, input.value);
    if (next !== state.tasks) {
      input.value = "";
    }
    dispatch(next);
    input.focus();
  });

  clearBtn.addEventListener("click", function () {
    dispatch(todoOps.clearCompleted(state.tasks));
  });

  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      state.filter = btn.dataset.filter;
      filterButtons.forEach(function (b) {
        b.classList.toggle("is-active", b === btn);
      });
      render();
    });
  });

  /* ----------------------------------------------------------------------- *
   * Bootstrap
   * ----------------------------------------------------------------------- */
  load();
  render();
})();

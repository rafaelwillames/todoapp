import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Chave padrão usada para persistir as tarefas no localStorage.
 * @type {string}
 */
export const TASKS_STORAGE_KEY = "todoapp.tasks";

/**
 * Lê as tarefas persistidas no localStorage de forma segura.
 *
 * Retorna o valor inicial informado quando não há nada salvo, quando o
 * ambiente não expõe `window`/`localStorage` (ex.: SSR) ou quando o conteúdo
 * salvo estiver corrompido/não for um array válido.
 *
 * @param {string} key Chave de armazenamento.
 * @param {Array<any>} initialTasks Tarefas usadas quando não há dado válido.
 * @returns {Array<any>} Tarefas carregadas.
 */
function readTasksFromStorage(key, initialTasks) {
  if (typeof window === "undefined" || !window.localStorage) {
    return initialTasks;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (raw == null) {
      return initialTasks;
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : initialTasks;
  } catch (error) {
    // Conteúdo inválido/corrompido: não quebra a aplicação, usa o inicial.
    console.warn(`[useTasks] Falha ao ler tarefas de "${key}":`, error);
    return initialTasks;
  }
}

/**
 * Hook de persistência que carrega as tarefas do localStorage na montagem e
 * as salva automaticamente sempre que a lista muda.
 *
 * O carregamento é feito de forma preguiçosa (lazy initializer) para evitar
 * leituras repetidas do storage, e a gravação acontece em um efeito disparado
 * a cada alteração da lista de tarefas.
 *
 * @param {Array<any>} [initialTasks=[]] Tarefas iniciais caso não haja nada salvo.
 * @param {string} [storageKey=TASKS_STORAGE_KEY] Chave usada no localStorage.
 * @returns {{
 *   tasks: Array<any>,
 *   setTasks: import("react").Dispatch<import("react").SetStateAction<Array<any>>>,
 *   addTask: (task: any) => void,
 *   updateTask: (id: any, changes: object) => void,
 *   removeTask: (id: any) => void,
 *   toggleTask: (id: any) => void,
 *   clearTasks: () => void,
 * }} API de manipulação das tarefas persistidas.
 */
export function useTasks(initialTasks = [], storageKey = TASKS_STORAGE_KEY) {
  const [tasks, setTasks] = useState(() =>
    readTasksFromStorage(storageKey, initialTasks)
  );

  // Evita gravar no storage durante a primeira renderização (logo após o
  // carregamento inicial), preservando o valor já existente sem reescrevê-lo.
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (typeof window === "undefined" || !window.localStorage) {
      return;
    }

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(tasks));
    } catch (error) {
      // Quota excedida ou storage indisponível: não interrompe o app.
      console.warn(`[useTasks] Falha ao salvar tarefas em "${storageKey}":`, error);
    }
  }, [tasks, storageKey]);

  // Mantém a lista sincronizada quando a mesma chave é alterada em outra aba.
  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const handleStorage = (event) => {
      if (event.key !== storageKey) {
        return;
      }
      setTasks(readTasksFromStorage(storageKey, initialTasks));
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
    // `initialTasks` é intencionalmente omitido para não recriar o listener a
    // cada render; ele só é usado como fallback quando o storage está vazio.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  const addTask = useCallback((task) => {
    setTasks((prev) => [...prev, task]);
  }, []);

  const updateTask = useCallback((id, changes) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...changes } : task))
    );
  }, []);

  const removeTask = useCallback((id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const toggleTask = useCallback((id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  }, []);

  const clearTasks = useCallback(() => {
    setTasks([]);
  }, []);

  return {
    tasks,
    setTasks,
    addTask,
    updateTask,
    removeTask,
    toggleTask,
    clearTasks,
  };
}

export default useTasks;

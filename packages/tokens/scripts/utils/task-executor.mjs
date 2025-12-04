/**
 * 작업 실행 엔진
 * 병렬 실행 및 의존성 해결 처리
 *
 * Vite의 빌드 파이프라인과 작업 스케줄링 알고리즘에서 영감을 받음
 */

/**
 * @typedef {Object} BuildTask
 * @property {string} name - 작업 이름
 * @property {() => Promise<void>} fn - 작업 함수
 * @property {string[]} [deps] - 작업 의존성
 * @property {boolean} [parallel] - 병렬 실행 가능 여부
 */

/**
 * 작업 실행 상태
 */
class TaskState {
  constructor() {
    this.completed = new Set();
    this.running = new Set();
    this.failed = new Set();
  }

  isCompleted(taskName) {
    return this.completed.has(taskName);
  }

  isRunning(taskName) {
    return this.running.has(taskName);
  }

  isFailed(taskName) {
    return this.failed.has(taskName);
  }

  markRunning(taskName) {
    this.running.add(taskName);
  }

  markCompleted(taskName) {
    this.running.delete(taskName);
    this.completed.add(taskName);
  }

  markFailed(taskName) {
    this.running.delete(taskName);
    this.failed.add(taskName);
  }

  getRemainingTasks(allTasks) {
    return allTasks.filter(
      (task) =>
        !this.isCompleted(task.name) &&
        !this.isRunning(task.name) &&
        !this.isFailed(task.name),
    );
  }
}

/**
 * 작업 의존성이 충족되었는지 확인
 * @param {BuildTask} task - 확인할 작업
 * @param {TaskState} state - 현재 작업 상태
 * @returns {boolean}
 */
function areDependenciesSatisfied(task, state) {
  if (!task.deps || task.deps.length === 0) {
    return true;
  }
  return task.deps.every((dep) => state.isCompleted(dep));
}

/**
 * 실행 준비가 된 작업 찾기
 * @param {BuildTask[]} tasks - 모든 작업
 * @param {TaskState} state - 현재 작업 상태
 * @returns {BuildTask[]} 준비된 작업들
 */
function findReadyTasks(tasks, state) {
  return tasks.filter(
    (task) =>
      !state.isCompleted(task.name) &&
      !state.isRunning(task.name) &&
      !state.isFailed(task.name) &&
      areDependenciesSatisfied(task, state),
  );
}

/**
 * 순환 의존성 또는 데드락 확인
 * @param {BuildTask[]} tasks - 모든 작업
 * @param {TaskState} state - 현재 작업 상태
 * @throws {Error} 순환 의존성이 감지되면
 */
function checkForDeadlock(tasks, state) {
  const remaining = state.getRemainingTasks(tasks);
  if (remaining.length > 0 && state.running.size === 0) {
    const taskNames = remaining.map((t) => t.name).join(", ");
    throw new Error(
      `순환 의존성 또는 누락된 의존성이 감지되었습니다. ` +
        `남은 작업: ${taskNames}`,
    );
  }
}

/**
 * 단일 작업 실행
 * @param {BuildTask} task - 실행할 작업
 * @param {TaskState} state - 작업 상태
 * @param {Object} logger - 로거 인스턴스
 * @returns {Promise<void>}
 */
async function executeTask(task, state, logger) {
  if (state.isCompleted(task.name)) {
    return;
  }

  state.markRunning(task.name);
  logger.startTask(task.name);

  try {
    await task.fn();
    logger.endTask(task.name, true);
    state.markCompleted(task.name);
  } catch (error) {
    logger.endTask(task.name, false);
    logger.error(`작업 "${task.name}" 실패`, error);
    state.markFailed(task.name);
    throw error;
  }
}

/**
 * 작업들을 병렬로 실행
 * @param {BuildTask[]} tasks - 실행할 작업들
 * @param {TaskState} state - 작업 상태
 * @param {Object} logger - 로거 인스턴스
 * @returns {Promise<void>}
 */
async function executeParallel(tasks, state, logger) {
  if (tasks.length === 0) return;
  await Promise.all(tasks.map((task) => executeTask(task, state, logger)));
}

/**
 * 작업들을 순차적으로 실행
 * @param {BuildTask[]} tasks - 실행할 작업들
 * @param {TaskState} state - 작업 상태
 * @param {Object} logger - 로거 인스턴스
 * @returns {Promise<void>}
 */
async function executeSequential(tasks, state, logger) {
  for (const task of tasks) {
    await executeTask(task, state, logger);
  }
}

/**
 * 의존성 해결을 포함한 빌드 작업 실행
 * @param {BuildTask[]} tasks - 빌드 작업들
 * @param {Object} logger - 로거 인스턴스
 * @returns {Promise<void>}
 */
export async function executeTasks(tasks, logger) {
  const state = new TaskState();
  const parallelTasks = tasks.filter((t) => t.parallel !== false);
  const sequentialTasks = tasks.filter((t) => t.parallel === false);

  while (state.completed.size + state.failed.size < tasks.length) {
    const readyTasks = findReadyTasks(tasks, state);

    if (readyTasks.length === 0) {
      checkForDeadlock(tasks, state);
      // 실행 중인 작업이 완료될 때까지 대기
      await new Promise((resolve) => setTimeout(resolve, 10));
      continue;
    }

    // 병렬 및 순차 준비 작업 분리
    const parallelReady = readyTasks.filter((t) => parallelTasks.includes(t));
    const sequentialReady = readyTasks.filter((t) =>
      sequentialTasks.includes(t),
    );

    // 병렬 작업을 먼저 실행
    if (parallelReady.length > 0) {
      await executeParallel(parallelReady, state, logger);
    }

    // 그 다음 순차 작업 실행
    if (sequentialReady.length > 0) {
      await executeSequential(sequentialReady, state, logger);
    }
  }

  // 실패한 작업이 있으면 에러 발생
  if (state.failed.size > 0) {
    const failedNames = Array.from(state.failed).join(", ");
    throw new Error(`빌드 실패. 실패한 작업: ${failedNames}`);
  }
}

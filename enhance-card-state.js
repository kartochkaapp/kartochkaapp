(function (globalScope, factory) {
  const exportsObject = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = exportsObject;
  }
  globalScope.KARTOCHKA_ENHANCE_CARD_STATE = exportsObject;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const VALID_STATUSES = new Set([
    "idle",
    "file_selected",
    "submitting",
    "processing",
    "success",
    "error",
    "timeout",
  ]);

  const createInitialState = () => {
    return {
      status: "idle",
      source: null,
      resultUrl: "",
      errorMessage: "",
      lastEvent: "",
      isBusy: false,
      canRetry: false,
      requestToken: 0,
      startedAt: 0,
      completedAt: 0,
    };
  };

  const useEnhanceCardState = (options) => {
    const logger = options?.logger;
    let state = createInitialState();
    let mounted = true;
    let requestTokenCounter = 0;
    let activeAbortController = null;
    const listeners = new Set();

    const notify = () => {
      if (!mounted) return;
      listeners.forEach((listener) => {
        try {
          listener(state);
        } catch (error) {
          // Listeners should not break the state store.
        }
      });
    };

    const cleanupSource = (source) => {
      if (!source || typeof source.dispose !== "function") return;
      try {
        source.dispose();
      } catch (error) {
        // Ignore preview cleanup failures.
      }
    };

    const transition = (nextStatus, patch, meta) => {
      if (!mounted) return state;
      if (!VALID_STATUSES.has(nextStatus)) {
        throw new Error("Unknown enhance-card state: " + String(nextStatus));
      }

      const previousStatus = state.status;
      state = {
        ...state,
        ...(patch && typeof patch === "object" ? patch : {}),
        status: nextStatus,
        isBusy: nextStatus === "submitting" || nextStatus === "processing",
        canRetry: nextStatus === "error" || nextStatus === "timeout",
        lastEvent: String(meta?.event || ""),
      };

      logger?.info("state_transition", {
        from: previousStatus,
        to: nextStatus,
        event: meta?.event,
        requestToken: state.requestToken,
      });

      notify();
      return state;
    };

    const abortActiveRequest = (eventName) => {
      if (!activeAbortController) return;
      try {
        activeAbortController.abort();
      } catch (error) {
        // Ignore abort errors.
      }
      activeAbortController = null;
      requestTokenCounter += 1;
      logger?.warn("request_invalidated", {
        event: eventName,
        requestToken: requestTokenCounter,
      });
    };

    return {
      getState() {
        return state;
      },

      subscribe(listener) {
        if (typeof listener !== "function") {
          return () => undefined;
        }

        listeners.add(listener);
        listener(state);
        return () => {
          listeners.delete(listener);
        };
      },

      setSource(source, meta) {
        if (!mounted) return state;
        if (state.source && state.source !== source) {
          cleanupSource(state.source);
        }
        abortActiveRequest(meta?.event || "source_changed");
        return transition(source ? "file_selected" : "idle", {
          source: source || null,
          resultUrl: "",
          errorMessage: "",
          requestToken: requestTokenCounter,
          startedAt: 0,
          completedAt: 0,
        }, { event: meta?.event || (source ? "source_selected" : "source_cleared") });
      },

      beginSubmission(meta) {
        if (!mounted || !state.source || state.isBusy) return null;

        abortActiveRequest(meta?.event || "submit_restart");
        requestTokenCounter += 1;
        activeAbortController = new AbortController();

        transition("submitting", {
          errorMessage: "",
          resultUrl: "",
          requestToken: requestTokenCounter,
          startedAt: Date.now(),
          completedAt: 0,
        }, { event: meta?.event || "submit_started" });

        return {
          source: state.source,
          requestToken: requestTokenCounter,
          controller: activeAbortController,
        };
      },

      markProcessing(requestToken, meta) {
        if (!mounted || requestToken !== state.requestToken || !activeAbortController) return false;
        transition("processing", {}, { event: meta?.event || "request_inflight" });
        return true;
      },

      resolveSuccess(requestToken, payload, meta) {
        if (!mounted || requestToken !== state.requestToken) return false;
        activeAbortController = null;
        transition("success", {
          resultUrl: String(payload?.resultUrl || ""),
          errorMessage: "",
          completedAt: Date.now(),
        }, { event: meta?.event || "request_success" });
        return true;
      },

      resolveFailure(requestToken, errorMessage, meta) {
        if (!mounted || requestToken !== state.requestToken) return false;
        activeAbortController = null;
        const timedOut = Boolean(meta?.timedOut);
        transition(timedOut ? "timeout" : "error", {
          errorMessage: String(errorMessage || ""),
          completedAt: Date.now(),
        }, { event: meta?.event || (timedOut ? "request_timeout" : "request_error") });
        return true;
      },

      isCurrentRequest(requestToken) {
        return mounted && requestToken === state.requestToken;
      },

      getActiveController(requestToken) {
        if (requestToken !== state.requestToken) return null;
        return activeAbortController;
      },

      reset(meta) {
        if (!mounted) return state;
        abortActiveRequest(meta?.event || "reset");
        cleanupSource(state.source);
        state = createInitialState();
        logger?.info("state_transition", {
          from: "any",
          to: "idle",
          event: meta?.event || "reset",
          requestToken: state.requestToken,
        });
        notify();
        return state;
      },

      destroy() {
        if (!mounted) return;
        abortActiveRequest("destroy");
        cleanupSource(state.source);
        listeners.clear();
        mounted = false;
      },
    };
  };

  return {
    VALID_STATUSES,
    createInitialState,
    useEnhanceCardState,
  };
});

// Agents UI Module for Luma
// Visual interface for monitoring and controlling development agents
(() => {
  "use strict";

  const manager = window.LumaAgents?.manager;
  const escapeHtml = (text) => String(text ?? "").replace(/[&<>"']/g, c => ({
    "&": "\u0026", "<": "\u003C", ">": "\u003E", '"': "\u0022", "'": "\u0027"
  })[c]);

  function icon(name, size = 20) {
    return `<svg class="l-icon" aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${window.LUMA_ICONS[name] || window.LUMA_ICONS["circle-dot"]}</svg>`;
  }

  function formatTime(timestamp) {
    if (!timestamp) return "Nunca";
    const date = new Date(timestamp);
    return date.toLocaleString("es", { 
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  }

  function statusBadge(status) {
    const colors = {
      idle: { bg: "var(--gray-10)", color: "var(--gray)", text: "Inactivo" },
      running: { bg: "var(--blue-10)", color: "var(--blue)", text: "Ejecutando" },
      completed: { bg: "var(--green-10)", color: "var(--green)", text: "Completado" },
      error: { bg: "var(--red-10)", color: "var(--red)", text: "Error" }
    };
    const c = colors[status] || colors.idle;
    return `<span class="status-badge" style="background:${c.bg};color:${c.color}">${c.text}</span>`;
  }

  function severityBadge(severity) {
    const colors = {
      error: { bg: "var(--red-10)", color: "var(--red)" },
      warning: { bg: "var(--amber-10)", color: "var(--amber)" },
      info: { bg: "var(--blue-10)", color: "var(--blue)" },
      pass: { bg: "var(--green-10)", color: "var(--green)" }
    };
    const c = colors[severity] || colors.info;
    return `<span class="severity-badge" style="background:${c.bg};color:${c.color}">${severity.toUpperCase()}</span>`;
  }

  function renderAgentCard(agentStatus) {
    const lastRun = formatTime(agentStatus.lastRun);
    const recentSuccess = agentStatus.recentResults.filter(r => r.success).length;
    const recentTotal = agentStatus.recentResults.length;
    
    return `<article class="agent-card" data-agent="${agentStatus.id}">
      <div class="agent-header">
        <div class="agent-info">
          <h3>${icon("bot", 20)} ${escapeHtml(agentStatus.id)}</h3>
          <p class="agent-type">${escapeHtml(agentStatus.type)}</p>
        </div>
        <div class="agent-status">${statusBadge(agentStatus.status)}</div>
      </div>
      <div class="agent-meta">
        <div class="meta-item">
          <span class="meta-label">Última ejecución</span>
          <span class="meta-value">${lastRun}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Éxitos recientes</span>
          <span class="meta-value">${recentSuccess}/${recentTotal}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Estado</span>
          <span class="meta-value">${agentStatus.enabled ? "Habilitado" : "Deshabilitado"}</span>
        </div>
      </div>
      <div class="agent-actions">
        <button type="button" class="agent-btn run-btn" data-action="run" ${agentStatus.status === "running" ? "disabled" : ""}>
          ${icon("play", 14)} Ejecutar
        </button>
        <button type="button" class="agent-btn toggle-btn" data-action="toggle" aria-pressed="${agentStatus.enabled}">
          ${icon(agentStatus.enabled ? "toggle-right" : "toggle-left", 14)} ${agentStatus.enabled ? "Deshabilitar" : "Habilitar"}
        </button>
        <button type="button" class="agent-btn logs-btn" data-action="logs">
          ${icon("terminal", 14)} Ver logs
        </button>
      </div>
      <div class="agent-recent-logs" hidden></div>
    </article>`;
  }

  function renderLogEntry(log) {
    const time = new Date(log.timestamp).toLocaleTimeString("es");
    return `<div class="log-entry log-${log.level}">
      <span class="log-time">${time}</span>
      <span class="log-agent">${escapeHtml(log.agent)}</span>
      ${severityBadge(log.level)}
      <span class="log-message">${escapeHtml(log.message)}</span>
      ${log.data ? `<pre class="log-data">${escapeHtml(JSON.stringify(log.data, null, 2))}</pre>` : ""}
    </div>`;
  }

  function render(root, api) {
    const status = manager.getStatus();
    const logs = manager.getLogs({}).slice(-50);
    
    root.innerHTML = `<section class="agents-panel">
      <header class="agents-header">
        <div>
          <h1>${icon("bot", 24)} Agentes de Desarrollo</h1>
          <p>Monitoreo y control de agentes automáticos para mejora continua de Luma.</p>
        </div>
        <div class="agents-header-actions">
          <button type="button" class="solid-button" id="agents-run-all">
            ${icon("play-circle", 16)} Ejecutar todos
          </button>
          <button type="button" class="outline-button" id="agents-refresh">
            ${icon("refresh-cw", 16)} Actualizar
          </button>
        </div>
      </header>
      
      <div class="agents-summary">
        <div class="summary-card">
          <span class="summary-value">${Object.values(status).filter(s => s.status === "running").length}</span>
          <span class="summary-label">Ejecutando</span>
        </div>
        <div class="summary-card">
          <span class="summary-value">${Object.values(status).filter(s => s.status === "error").length}</span>
          <span class="summary-label">Con errores</span>
        </div>
        <div class="summary-card">
          <span class="summary-value">${Object.values(status).filter(s => s.enabled).length}</span>
          <span class="summary-label">Habilitados</span>
        </div>
        <div class="summary-card">
          <span class="summary-value">${Object.keys(status).length}</span>
          <span class="summary-label">Total agentes</span>
        </div>
      </div>
      
      <div class="agents-tabs" role="tablist">
        <button type="button" class="agent-tab active" data-tab="agents" role="tab" aria-selected="true">
          ${icon("bot", 16)} Agentes
        </button>
        <button type="button" class="agent-tab" data-tab="logs" role="tab" aria-selected="false">
          ${icon("terminal", 16)} Logs del sistema
        </button>
        <button type="button" class="agent-tab" data-tab="schedule" role="tab" aria-selected="false">
          ${icon("clock", 16)} Programación
        </button>
      </div>
      
      <div id="agents-tab-content" class="tab-content">
        <div class="agents-grid" role="tabpanel">
          ${Object.values(status).map(renderAgentCard).join("")}
        </div>
        <div class="logs-panel" role="tabpanel" hidden>
          <div class="logs-toolbar">
            <label>Filtrar por agente
              <select id="logs-filter-agent">
                <option value="">Todos</option>
                ${Object.keys(status).map(id => `<option value="${id}">${id}</option>`).join("")}
              </select>
            </label>
            <label>Nivel
              <select id="logs-filter-level">
                <option value="">Todos</option>
                <option value="error">Error</option>
                <option value="warn">Advertencia</option>
                <option value="info">Info</option>
              </select>
            </label>
            <button type="button" class="outline-button" id="logs-clear">${icon("trash-2", 14)} Limpiar</button>
          </div>
          <div class="logs-container" id="logs-container">
            ${logs.reverse().map(renderLogEntry).join("")}
          </div>
        </div>
        <div class="schedule-panel" role="tabpanel" hidden>
          <h3>Programación de agentes</h3>
          <p>Configura ejecuciones automáticas periódicas para cada agente.</p>
          <div class="schedule-form">
            ${Object.values(status).map(s => `
              <div class="schedule-item">
                <label>
                  <span>${escapeHtml(s.id)}</span>
                  <div class="schedule-controls">
                    <select data-agent="${s.id}" class="schedule-interval">
                      <option value="0" ${!manager.schedules?.has(s.id) ? "selected" : ""}>Desactivado</option>
                      <option value="300000">Cada 5 min</option>
                      <option value="900000">Cada 15 min</option>
                      <option value="3600000">Cada hora</option>
                      <option value="86400000">Diario</option>
                    </select>
                    <button type="button" class="iconbtn schedule-apply" data-agent="${s.id}" aria-label="Aplicar">${icon("check", 14)}</button>
                  </div>
                </label>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    </section>`;

    bindEvents();
  }

  function bindEvents() {
    const root = document.querySelector(".agents-panel");
    if (!root) return;
    
    // Tab switching
    root.querySelectorAll(".agent-tab").forEach(tab => {
      tab.onclick = () => {
        root.querySelectorAll(".agent-tab").forEach(t => {
          t.classList.remove("active");
          t.setAttribute("aria-selected", "false");
        });
        tab.classList.add("active");
        tab.setAttribute("aria-selected", "true");
        
        const tabName = tab.dataset.tab;
        root.querySelectorAll(".tab-content > div").forEach(panel => {
          panel.hidden = !panel.classList.contains(tabName + "-panel") && panel.id !== "agents-tab-content";
        });
        // Special handling for agents tab
        if (tabName === "agents") {
          root.querySelector(".agents-grid").hidden = false;
        } else {
          root.querySelector(".agents-grid").hidden = true;
        }
        if (tabName === "logs") {
          root.querySelector(".logs-panel").hidden = false;
        } else {
          root.querySelector(".logs-panel").hidden = true;
        }
        if (tabName === "schedule") {
          root.querySelector(".schedule-panel").hidden = false;
        } else {
          root.querySelector(".schedule-panel").hidden = true;
        }
      };
    });
    
    // Run all agents
    root.querySelector("#agents-run-all").onclick = async () => {
      const btn = root.querySelector("#agents-run-all");
      btn.disabled = true;
      btn.innerHTML = `${icon("loader", 16)} Ejecutando...`;
      
      try {
        const results = await manager.runAll({});
        refreshAgentCards();
        api.toast(`Ejecutados ${Object.keys(results).length} agentes`);
      } catch (error) {
        api.toast("Error: " + error.message);
      } finally {
        btn.disabled = false;
        btn.innerHTML = `${icon("play-circle", 16)} Ejecutar todos`;
      }
    };
    
    // Refresh
    root.querySelector("#agents-refresh").onclick = () => {
      refreshAgentCards();
      refreshLogs();
    };
    
    // Agent actions
    root.addEventListener("click", async (e) => {
      const btn = e.target.closest(".agent-btn");
      if (!btn) return;
      
      const card = btn.closest(".agent-card");
      const agentId = card.dataset.agent;
      const action = btn.dataset.action;
      
      if (action === "run") {
        btn.disabled = true;
        btn.innerHTML = `${icon("loader", 14)} Ejecutando...`;
        try {
          await manager.runAgent(agentId, {});
          refreshAgentCards();
        } catch (error) {
          api.toast("Error: " + error.message);
        } finally {
          btn.disabled = false;
          btn.innerHTML = `${icon("play", 14)} Ejecutar`;
        }
      } else if (action === "toggle") {
        const agent = manager.agents.get(agentId);
        if (agent) {
          agent.enabled = !agent.enabled;
          btn.setAttribute("aria-pressed", String(agent.enabled));
          btn.innerHTML = `${icon(agent.enabled ? "toggle-right" : "toggle-left", 14)} ${agent.enabled ? "Deshabilitar" : "Habilitar"}`;
          refreshAgentCards();
        }
      } else if (action === "logs") {
        const logsContainer = card.querySelector(".agent-recent-logs");
        const isHidden = logsContainer.hidden;
        logsContainer.hidden = !isHidden;
        if (!isHidden) return;
        
        const logs = manager.getLogs({ agent: agentId }).slice(-20);
        logsContainer.innerHTML = logs.reverse().map(renderLogEntry).join("");
        btn.innerHTML = `${icon("x", 14)} Ocultar logs`;
        btn.dataset.action = "hide-logs";
      } else if (btn.dataset.action === "hide-logs") {
        const logsContainer = card.querySelector(".agent-recent-logs");
        logsContainer.hidden = true;
        btn.innerHTML = `${icon("terminal", 14)} Ver logs`;
        btn.dataset.action = "logs";
      }
    });
    
    // Logs filtering
    const agentFilter = root.querySelector("#logs-filter-agent");
    const levelFilter = root.querySelector("#logs-filter-level");
    const logsContainer = root.querySelector("#logs-container");
    
    function refreshLogs() {
      let logs = manager.getLogs({});
      if (agentFilter.value) logs = logs.filter(l => l.agent === agentFilter.value);
      if (levelFilter.value) logs = logs.filter(l => l.level === levelFilter.value);
      logsContainer.innerHTML = logs.slice(-100).reverse().map(renderLogEntry).join("");
    }
    
    agentFilter.onchange = refreshLogs;
    levelFilter.onchange = refreshLogs;
    
    root.querySelector("#logs-clear").onclick = () => {
      manager.clearLogs();
      refreshLogs();
      api.toast("Logs limpiados");
    };
    
    // Schedule controls
    root.querySelectorAll(".schedule-apply").forEach(btn => {
      btn.onclick = () => {
        const agentId = btn.dataset.agent;
        const select = root.querySelector(`.schedule-interval[data-agent="${agentId}"]`);
        const interval = parseInt(select.value, 10);
        
        if (interval === 0) {
          manager.clearSchedule(agentId);
          api.toast(`Programación desactivada para ${agentId}`);
        } else {
          manager.schedule(agentId, interval, {});
          api.toast(`Programado ${agentId} cada ${formatInterval(interval)}`);
        }
      };
    });
  }

  function formatInterval(ms) {
    if (ms < 60000) return `${ms/1000}s`;
    if (ms < 3600000) return `${ms/60000}min`;
    if (ms < 86400000) return `${ms/3600000}h`;
    return `${ms/86400000}d`;
  }

  function refreshAgentCards() {
    const status = manager.getStatus();
    const grid = document.querySelector(".agents-grid");
    if (grid) {
      grid.innerHTML = Object.values(status).map(renderAgentCard).join("");
    }
    // Update summary
    const summary = document.querySelector(".agents-summary");
    if (summary) {
      summary.innerHTML = `
        <div class="summary-card"><span class="summary-value">${Object.values(status).filter(s => s.status === "running").length}</span><span class="summary-label">Ejecutando</span></div>
        <div class="summary-card"><span class="summary-value">${Object.values(status).filter(s => s.status === "error").length}</span><span class="summary-label">Con errores</span></div>
        <div class="summary-card"><span class="summary-value">${Object.values(status).filter(s => s.enabled).length}</span><span class="summary-label">Habilitados</span></div>
        <div class="summary-card"><span class="summary-value">${Object.keys(status).length}</span><span class="summary-label">Total agentes</span></div>
      `;
    }
  }

  function refreshLogs() {
    const root = document.querySelector(".agents-panel");
    if (!root) return;
    const agentFilter = root.querySelector("#logs-filter-agent");
    const levelFilter = root.querySelector("#logs-filter-level");
    const logsContainer = root.querySelector("#logs-container");
    
    let logs = manager.getLogs({});
    if (agentFilter?.value) logs = logs.filter(l => l.agent === agentFilter.value);
    if (levelFilter?.value) logs = logs.filter(l => l.level === levelFilter.value);
    if (logsContainer) logsContainer.innerHTML = logs.slice(-100).reverse().map(renderLogEntry).join("");
  }

  window.LumaAgentsUI = Object.freeze({
    render,
    refreshAgentCards,
    refreshLogs
  });
})();
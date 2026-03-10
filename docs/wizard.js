// === STATE ===
const state = {
    audience: "",
    problem: "",
    personality: "",
    accessibility: [],
    limits: ""
};

let currentStep = 1;
const totalSteps = 6;

// === DOM ===
const wizardSection = document.getElementById("wizard");
const introSection = document.getElementById("intro");
const startBtn = document.getElementById("start-btn");
const progressFill = document.getElementById("progress-fill");

// === NAVIGATION ===
function showStep(n) {
    currentStep = n;
    document.querySelectorAll(".wizard-step").forEach(s => s.classList.remove("active"));
    const target = document.querySelector(`.wizard-step[data-step="${n}"]`);
    if (target) {
        target.classList.add("active");
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        // Focus first interactive element for accessibility
        const firstBtn = target.querySelector("button, textarea, input");
        if (firstBtn) setTimeout(() => firstBtn.focus(), 300);
    }
    // Update progress
    const pct = Math.min((n / totalSteps) * 100, 100);
    progressFill.style.width = pct + "%";
    updateStepLabel();

    // Build summary on step 6
    if (n === 6) buildSummary();
}

function updateStepLabel() {
    const label = document.getElementById("wizard-step-label");
    const stepNum = Math.min(currentStep, totalSteps);
    label.textContent = t("step_label", { n: stepNum });
}

// === START ===
startBtn.addEventListener("click", () => {
    introSection.classList.add("hidden");
    wizardSection.classList.remove("hidden");
    showStep(1);
});

// === STEP 1: Audience (single select) ===
document.querySelectorAll('.wizard-step[data-step="1"] .option-btn').forEach(btn => {
    btn.addEventListener("click", () => {
        // Deselect others
        btn.closest(".options").querySelectorAll(".option-btn").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        state.audience = btn.dataset.value;
        // Auto-advance after short delay
        setTimeout(() => showStep(2), 400);
    });
});

// === STEP 2: Problem (text) ===
document.querySelectorAll('.wizard-step[data-step="2"] .wizard-next').forEach(btn => {
    btn.addEventListener("click", () => {
        state.problem = document.getElementById("problem-input").value.trim();
        if (state.problem) {
            showStep(3);
        } else {
            document.getElementById("problem-input").focus();
        }
    });
});

// === STEP 3: Personality (single select) ===
document.querySelectorAll('.wizard-step[data-step="3"] .option-btn').forEach(btn => {
    btn.addEventListener("click", () => {
        btn.closest(".options").querySelectorAll(".option-btn").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        state.personality = btn.dataset.value;
        setTimeout(() => showStep(4), 400);
    });
});

// === STEP 4: Accessibility (multi select) ===
document.querySelectorAll('.wizard-step[data-step="4"] .option-btn.toggle').forEach(btn => {
    btn.addEventListener("click", () => {
        const val = btn.dataset.value;
        if (val === "none") {
            // Deselect all others
            btn.closest(".options").querySelectorAll(".option-btn").forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");
            state.accessibility = ["none"];
        } else {
            // Deselect "none" if it was selected
            const noneBtn = btn.closest(".options").querySelector('[data-value="none"]');
            if (noneBtn) noneBtn.classList.remove("selected");
            state.accessibility = state.accessibility.filter(v => v !== "none");

            btn.classList.toggle("selected");
            if (btn.classList.contains("selected")) {
                if (!state.accessibility.includes(val)) state.accessibility.push(val);
            } else {
                state.accessibility = state.accessibility.filter(v => v !== val);
            }
        }
    });
});

document.querySelectorAll('.wizard-step[data-step="4"] .wizard-next').forEach(btn => {
    btn.addEventListener("click", () => {
        if (state.accessibility.length === 0) state.accessibility = ["none"];
        showStep(5);
    });
});

// === STEP 5: Limits (text) ===
document.querySelectorAll('.wizard-step[data-step="5"] .wizard-next').forEach(btn => {
    btn.addEventListener("click", () => {
        state.limits = document.getElementById("limits-input").value.trim();
        showStep(6);
    });
});

// === STEP 6: Summary ===
function buildSummary() {
    const audKey = "aud_" + state.audience;
    const perKey = "per_" + state.personality;
    const accLabels = state.accessibility.map(a => {
        const key = "acc_" + a.replace("-", "_");
        return t(key);
    }).join(", ");

    const html = `
        <p><strong>${t("sum_audience")}:</strong> ${t(audKey)}</p>
        <p><strong>${t("sum_problem")}:</strong> ${state.problem}</p>
        <p><strong>${t("sum_personality")}:</strong> ${t(perKey)}</p>
        <p><strong>${t("sum_accessibility")}:</strong> ${accLabels}</p>
        <p><strong>${t("sum_limits")}:</strong> ${state.limits || "—"}</p>
    `;
    document.getElementById("summary").innerHTML = html;
}

// === GENERATE ===
document.getElementById("generate-btn").addEventListener("click", () => {
    const prompt = generatePrompt();
    document.getElementById("result-prompt").textContent = prompt;
    showStep(7);
});

// === BACK BUTTONS ===
document.querySelectorAll(".wizard-back").forEach(btn => {
    btn.addEventListener("click", () => {
        if (currentStep > 1) showStep(currentStep - 1);
    });
});

// === COPY ===
document.getElementById("copy-btn").addEventListener("click", () => {
    const text = document.getElementById("result-prompt").textContent;
    navigator.clipboard.writeText(text).then(() => {
        const confirm = document.getElementById("copy-confirm");
        confirm.classList.remove("hidden");
        setTimeout(() => confirm.classList.add("hidden"), 3000);
    });
});

// === RESTART ===
document.getElementById("restart-btn").addEventListener("click", () => {
    state.audience = "";
    state.problem = "";
    state.personality = "";
    state.accessibility = [];
    state.limits = "";
    document.querySelectorAll(".option-btn").forEach(b => b.classList.remove("selected"));
    document.getElementById("problem-input").value = "";
    document.getElementById("limits-input").value = "";
    showStep(1);
});

// === PROMPT GENERATOR ===
function generatePrompt() {
    const lang = currentLang;

    const personalityMap = {
        formal: {
            es: "Comunicate de forma formal y profesional. Usa usted en vez de tu.",
            en: "Communicate formally and professionally.",
            pt: "Comunique-se de forma formal e profissional. Use voce no lugar de tu."
        },
        friendly: {
            es: "Comunicate de forma amigable y cercana, como un amigo que sabe mucho.",
            en: "Communicate in a friendly and warm way, like a knowledgeable friend.",
            pt: "Comunique-se de forma amigavel e proxima, como um amigo que manja muito."
        },
        patient: {
            es: "Se extremadamente paciente. Explica todo con calma y detalle. Si algo no queda claro, explicalo de otra forma sin mostrar frustracion.",
            en: "Be extremely patient. Explain everything calmly and in detail. If something isn't clear, explain it another way without showing frustration.",
            pt: "Seja extremamente paciente. Explique tudo com calma e detalhe. Se algo nao ficar claro, explique de outro jeito sem mostrar frustracao."
        },
        direct: {
            es: "Se directo y ve al grano. Respuestas cortas y claras. Sin rodeos.",
            en: "Be direct and to the point. Short, clear answers. No beating around the bush.",
            pt: "Seja direto e va ao ponto. Respostas curtas e claras. Sem enrolacao."
        }
    };

    const accessibilityBlocks = {
        "screen-reader": {
            es: `ACCESIBILIDAD - LECTOR DE PANTALLA:
- No uses tablas. Usa listas numeradas
- No uses emojis ni caracteres decorativos
- No uses negrita o cursiva para enfasis. Usa palabras: "Importante:" o "Nota:"
- Describe todo contenido visual con texto
- Si muestras codigo, anuncia: "A continuacion viene un bloque de codigo de [N] lineas que hace [descripcion]"
- Numera las opciones, cada una en su propia linea
- Di cuantos elementos tiene una lista antes de empezar`,
            en: `ACCESSIBILITY - SCREEN READER:
- Don't use tables. Use numbered lists
- Don't use emojis or decorative characters
- Don't use bold or italics for emphasis. Use words: "Important:" or "Note:"
- Describe all visual content with text
- If showing code, announce: "Below is a code block of [N] lines that does [description]"
- Number options, each on its own line
- Say how many items a list has before starting`,
            pt: `ACESSIBILIDADE - LEITOR DE TELA:
- Nao use tabelas. Use listas numeradas
- Nao use emojis ou caracteres decorativos
- Nao use negrito ou italico pra enfase. Use palavras: "Importante:" ou "Nota:"
- Descreva todo conteudo visual com texto
- Se mostrar codigo, anuncie: "A seguir vem um bloco de codigo de [N] linhas que faz [descricao]"
- Numere as opcoes, cada uma na sua linha
- Diga quantos itens tem uma lista antes de comecar`
        },
        "simple-language": {
            es: `LENGUAJE SIMPLE:
- Oraciones de maximo 15 palabras
- Una idea por oracion
- Usa palabras comunes, evita tecnicismos
- Si usas una palabra tecnica, explicala inmediatamente
- Usa ejemplos concretos del mundo real
- Al final de cada explicacion, resume en una frase`,
            en: `SIMPLE LANGUAGE:
- Sentences of 15 words maximum
- One idea per sentence
- Use common words, avoid jargon
- If you use a technical word, explain it immediately
- Use concrete real-world examples
- At the end of each explanation, summarize in one sentence`,
            pt: `LINGUAGEM SIMPLES:
- Frases de no maximo 15 palavras
- Uma ideia por frase
- Use palavras comuns, evite termos tecnicos
- Se usar uma palavra tecnica, explique na hora
- Use exemplos concretos do dia a dia
- No final de cada explicacao, resuma em uma frase`
        },
        "step-by-step": {
            es: `MODO PASO A PASO:
- Antes de cualquier tarea: explica que vamos a hacer, por que, y cuantos pasos son
- Da UNA sola instruccion por paso
- Espera confirmacion antes de seguir
- Si funciono: "Perfecto. Paso [N] completado"
- Si fallo: "No te preocupes, vamos a intentar otra cosa"
- Resume el progreso: "Ya completamos [N] de [Total] pasos"
- Siempre ofrece la opcion de parar o repetir un paso`,
            en: `STEP BY STEP MODE:
- Before any task: explain what we'll do, why, and how many steps
- Give ONE instruction per step
- Wait for confirmation before continuing
- If it worked: "Perfect. Step [N] completed"
- If it failed: "Don't worry, let's try something else"
- Summarize progress: "We've completed [N] of [Total] steps"
- Always offer the option to stop or repeat a step`,
            pt: `MODO PASSO A PASSO:
- Antes de qualquer tarefa: explique o que vamos fazer, por que, e quantos passos sao
- De UMA instrucao por passo
- Espere confirmacao antes de continuar
- Se funcionou: "Perfeito. Passo [N] completado"
- Se falhou: "Nao se preocupe, vamos tentar outra coisa"
- Resuma o progresso: "Ja completamos [N] de [Total] passos"
- Sempre ofereca a opcao de parar ou repetir um passo`
        },
        "low-overwhelm": {
            es: `MODO ANTI-SOBRECARGA:
- Estructura TODA respuesta asi:
  QUE: [1 oracion]
  POR QUE: [1 oracion]
  COMO: [los pasos]
- Un tema por mensaje
- Respuestas cortas, nunca mas de un parrafo a la vez
- Al final de cada mensaje: "SIGUIENTE: [que viene]" o "ESPERANDO: [que necesito de ti]"
- Si algo puede salir mal, advierte ANTES`,
            en: `ANTI-OVERWHELM MODE:
- Structure EVERY response like this:
  WHAT: [1 sentence]
  WHY: [1 sentence]
  HOW: [the steps]
- One topic per message
- Short responses, never more than one paragraph at a time
- At the end of each message: "NEXT: [what's coming]" or "WAITING: [what I need from you]"
- If something can go wrong, warn BEFORE`,
            pt: `MODO ANTI-SOBRECARGA:
- Estruture TODA resposta assim:
  O QUE: [1 frase]
  POR QUE: [1 frase]
  COMO: [os passos]
- Um assunto por mensagem
- Respostas curtas, nunca mais de um paragrafo por vez
- No final de cada mensagem: "PROXIMO: [o que vem]" ou "ESPERANDO: [o que preciso de voce]"
- Se algo pode dar errado, avise ANTES`
        }
    };

    const basePrompt = {
        es: `Eres un asistente inclusivo y paciente. Tu objetivo es ayudar sin importar el nivel tecnico del usuario.

REGLAS FUNDAMENTALES:
- Nunca asumas que el usuario sabe algo. Si mencionas un concepto tecnico, ofrece explicarlo
- Pregunta antes de actuar. Explica que vas a hacer y pide confirmacion
- Usa oraciones cortas y claras
- Usa analogias del mundo real para explicar cosas complejas
- Si el usuario parece confundido, simplifica. Ofrece: "Quieres que lo explique de otra forma?"
- Nunca hagas sentir que una pregunta es "basica" o "obvia"
- Respeta el ritmo del usuario. No mandes mucha informacion de golpe
- Si el usuario se frustra, reconoce: "Entiendo que puede ser confuso. Vamos juntos"

IDIOMA: Responde en espanol`,
        en: `You are an inclusive and patient assistant. Your goal is to help regardless of the user's technical level.

FUNDAMENTAL RULES:
- Never assume the user knows something. If you mention a technical concept, offer to explain it
- Ask before acting. Explain what you'll do and ask for confirmation
- Use short, clear sentences
- Use real-world analogies to explain complex things
- If the user seems confused, simplify. Offer: "Would you like me to explain it differently?"
- Never make them feel a question is "basic" or "obvious"
- Respect the user's pace. Don't send too much information at once
- If the user gets frustrated, acknowledge: "I understand this can be confusing. Let's work through it together"

LANGUAGE: Respond in English`,
        pt: `Voce e um assistente inclusivo e paciente. Seu objetivo e ajudar independente do nivel tecnico do usuario.

REGRAS FUNDAMENTAIS:
- Nunca assuma que o usuario sabe algo. Se mencionar um conceito tecnico, ofereca explicar
- Pergunte antes de agir. Explique o que vai fazer e peca confirmacao
- Use frases curtas e claras
- Use analogias do dia a dia pra explicar coisas complexas
- Se o usuario parecer confuso, simplifique. Ofereca: "Quer que eu explique de outro jeito?"
- Nunca faca parecer que uma pergunta e "basica" ou "obvia"
- Respeite o ritmo do usuario. Nao mande muita informacao de uma vez
- Se o usuario ficar frustrado, reconheca: "Entendo que pode ser confuso. Vamos juntos"

IDIOMA: Responda em portugues`
    };

    // Build the prompt
    let prompt = basePrompt[lang] + "\n\n";

    // Add purpose
    const purposeLabel = { es: "TU PROPOSITO", en: "YOUR PURPOSE", pt: "SEU PROPOSITO" };
    prompt += `${purposeLabel[lang]}: ${state.problem}\n\n`;

    // Add personality
    prompt += personalityMap[state.personality][lang] + "\n\n";

    // Add accessibility modes
    const activeAccessibility = state.accessibility.filter(a => a !== "none");
    if (activeAccessibility.length > 0) {
        activeAccessibility.forEach(mode => {
            if (accessibilityBlocks[mode]) {
                prompt += accessibilityBlocks[mode][lang] + "\n\n";
            }
        });
    }

    // Add limits
    if (state.limits) {
        const limitsLabel = { es: "LIMITES - NO debes", en: "LIMITS - You must NOT", pt: "LIMITES - Voce NAO deve" };
        prompt += `${limitsLabel[lang]}:\n${state.limits}\n\n`;
    }

    // Add closing
    const closing = {
        es: "Recuerda: tu trabajo es hacer que la tecnologia sea accesible para todos. Se paciente, claro, y amable.",
        en: "Remember: your job is to make technology accessible to everyone. Be patient, clear, and kind.",
        pt: "Lembre-se: seu trabalho e tornar a tecnologia acessivel pra todos. Seja paciente, claro e gentil."
    };
    prompt += closing[lang];

    return prompt;
}

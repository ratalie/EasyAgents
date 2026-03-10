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
            es: "Comunícate de forma formal y profesional. Usa usted en vez de tú.",
            en: "Communicate formally and professionally.",
            pt: "Comunique-se de forma formal e profissional. Use você no lugar de tu."
        },
        friendly: {
            es: "Comunícate de forma amigable y cercana, como un amigo que sabe mucho.",
            en: "Communicate in a friendly and warm way, like a knowledgeable friend.",
            pt: "Comunique-se de forma amigável e próxima, como um amigo que manja muito."
        },
        patient: {
            es: "Sé extremadamente paciente. Explica todo con calma y detalle. Si algo no queda claro, explícalo de otra forma sin mostrar frustración.",
            en: "Be extremely patient. Explain everything calmly and in detail. If something isn't clear, explain it another way without showing frustration.",
            pt: "Seja extremamente paciente. Explique tudo com calma e detalhe. Se algo não ficar claro, explique de outro jeito sem mostrar frustração."
        },
        direct: {
            es: "Sé directo y ve al grano. Respuestas cortas y claras. Sin rodeos.",
            en: "Be direct and to the point. Short, clear answers. No beating around the bush.",
            pt: "Seja direto e vá ao ponto. Respostas curtas e claras. Sem enrolação."
        }
    };

    const accessibilityBlocks = {
        "screen-reader": {
            es: `ACCESIBILIDAD - LECTOR DE PANTALLA:
- No uses tablas. Usa listas numeradas
- No uses emojis ni caracteres decorativos
- No uses negrita o cursiva para énfasis. Usa palabras: "Importante:" o "Nota:"
- Describe todo contenido visual con texto
- Si muestras código, anuncia: "A continuación viene un bloque de código de [N] líneas que hace [descripción]"
- Numera las opciones, cada una en su propia línea
- Di cuántos elementos tiene una lista antes de empezar`,
            en: `ACCESSIBILITY - SCREEN READER:
- Don't use tables. Use numbered lists
- Don't use emojis or decorative characters
- Don't use bold or italics for emphasis. Use words: "Important:" or "Note:"
- Describe all visual content with text
- If showing code, announce: "Below is a code block of [N] lines that does [description]"
- Number options, each on its own line
- Say how many items a list has before starting`,
            pt: `ACESSIBILIDADE - LEITOR DE TELA:
- Não use tabelas. Use listas numeradas
- Não use emojis ou caracteres decorativos
- Não use negrito ou itálico pra ênfase. Use palavras: "Importante:" ou "Nota:"
- Descreva todo conteúdo visual com texto
- Se mostrar código, anuncie: "A seguir vem um bloco de código de [N] linhas que faz [descrição]"
- Numere as opções, cada uma na sua linha
- Diga quantos itens tem uma lista antes de começar`
        },
        "simple-language": {
            es: `LENGUAJE SIMPLE:
- Oraciones de máximo 15 palabras
- Una idea por oración
- Usa palabras comunes, evita tecnicismos
- Si usas una palabra técnica, explícala inmediatamente
- Usa ejemplos concretos del mundo real
- Al final de cada explicación, resume en una frase`,
            en: `SIMPLE LANGUAGE:
- Sentences of 15 words maximum
- One idea per sentence
- Use common words, avoid jargon
- If you use a technical word, explain it immediately
- Use concrete real-world examples
- At the end of each explanation, summarize in one sentence`,
            pt: `LINGUAGEM SIMPLES:
- Frases de no máximo 15 palavras
- Uma ideia por frase
- Use palavras comuns, evite termos técnicos
- Se usar uma palavra técnica, explique na hora
- Use exemplos concretos do dia a dia
- No final de cada explicação, resuma em uma frase`
        },
        "step-by-step": {
            es: `MODO PASO A PASO:
- Antes de cualquier tarea: explica qué vamos a hacer, por qué, y cuántos pasos son
- Da UNA sola instrucción por paso
- Espera confirmación antes de seguir
- Si funcionó: "Perfecto. Paso [N] completado"
- Si falló: "No te preocupes, vamos a intentar otra cosa"
- Resume el progreso: "Ya completamos [N] de [Total] pasos"
- Siempre ofrece la opción de parar o repetir un paso`,
            en: `STEP BY STEP MODE:
- Before any task: explain what we'll do, why, and how many steps
- Give ONE instruction per step
- Wait for confirmation before continuing
- If it worked: "Perfect. Step [N] completed"
- If it failed: "Don't worry, let's try something else"
- Summarize progress: "We've completed [N] of [Total] steps"
- Always offer the option to stop or repeat a step`,
            pt: `MODO PASSO A PASSO:
- Antes de qualquer tarefa: explique o que vamos fazer, por quê, e quantos passos são
- Dê UMA instrução por passo
- Espere confirmação antes de continuar
- Se funcionou: "Perfeito. Passo [N] completado"
- Se falhou: "Não se preocupe, vamos tentar outra coisa"
- Resuma o progresso: "Já completamos [N] de [Total] passos"
- Sempre ofereça a opção de parar ou repetir um passo`
        },
        "low-overwhelm": {
            es: `MODO ANTI-SOBRECARGA:
- Estructura TODA respuesta así:
  QUÉ: [1 oración]
  POR QUÉ: [1 oración]
  CÓMO: [los pasos]
- Un tema por mensaje
- Respuestas cortas, nunca más de un párrafo a la vez
- Al final de cada mensaje: "SIGUIENTE: [qué viene]" o "ESPERANDO: [qué necesito de ti]"
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
  O QUÊ: [1 frase]
  POR QUÊ: [1 frase]
  COMO: [os passos]
- Um assunto por mensagem
- Respostas curtas, nunca mais de um parágrafo por vez
- No final de cada mensagem: "PRÓXIMO: [o que vem]" ou "ESPERANDO: [o que preciso de você]"
- Se algo pode dar errado, avise ANTES`
        }
    };

    const basePrompt = {
        es: `Eres un asistente inclusivo y paciente. Tu objetivo es ayudar sin importar el nivel técnico del usuario.

REGLAS FUNDAMENTALES:
- Nunca asumas que el usuario sabe algo. Si mencionas un concepto técnico, ofrece explicarlo
- Pregunta antes de actuar. Explica qué vas a hacer y pide confirmación
- Usa oraciones cortas y claras
- Usa analogías del mundo real para explicar cosas complejas
- Si el usuario parece confundido, simplifica. Ofrece: "¿Quieres que lo explique de otra forma?"
- Nunca hagas sentir que una pregunta es "básica" o "obvia"
- Respeta el ritmo del usuario. No mandes mucha información de golpe
- Si el usuario se frustra, reconoce: "Entiendo que puede ser confuso. Vamos juntos"

IDIOMA: Responde en español`,
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
        pt: `Você é um assistente inclusivo e paciente. Seu objetivo é ajudar independente do nível técnico do usuário.

REGRAS FUNDAMENTAIS:
- Nunca assuma que o usuário sabe algo. Se mencionar um conceito técnico, ofereça explicar
- Pergunte antes de agir. Explique o que vai fazer e peça confirmação
- Use frases curtas e claras
- Use analogias do dia a dia pra explicar coisas complexas
- Se o usuário parecer confuso, simplifique. Ofereça: "Quer que eu explique de outro jeito?"
- Nunca faça parecer que uma pergunta é "básica" ou "óbvia"
- Respeite o ritmo do usuário. Não mande muita informação de uma vez
- Se o usuário ficar frustrado, reconheça: "Entendo que pode ser confuso. Vamos juntos"

IDIOMA: Responda em português`
    };

    // Build the prompt
    let prompt = basePrompt[lang] + "\n\n";

    // Add purpose
    const purposeLabel = { es: "TU PROPÓSITO", en: "YOUR PURPOSE", pt: "SEU PROPÓSITO" };
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
        const limitsLabel = { es: "LÍMITES - NO debes", en: "LIMITS - You must NOT", pt: "LIMITES - Você NÃO deve" };
        prompt += `${limitsLabel[lang]}:\n${state.limits}\n\n`;
    }

    // Add closing
    const closing = {
        es: "Recuerda: tu trabajo es hacer que la tecnología sea accesible para todos. Sé paciente, claro, y amable.",
        en: "Remember: your job is to make technology accessible to everyone. Be patient, clear, and kind.",
        pt: "Lembre-se: seu trabalho é tornar a tecnologia acessível pra todos. Seja paciente, claro e gentil."
    };
    prompt += closing[lang];

    return prompt;
}

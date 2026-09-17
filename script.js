// 36 números intercalando Ciano (Pares) e Rosa (Ímpares)
const roletaNumeros = [];
for (let i = 1; i <= 36; i++) {
  roletaNumeros.push({
    num: i,
    cor: i % 2 === 0 ? "ciano" : "rosa"
  });
}

const totalFatias = roletaNumeros.length;
const anguloPorFatia = 360 / totalFatias;
let rotacaoAcumulada = 0;

document.addEventListener("DOMContentLoaded", () => {
  const roleta = document.getElementById("roleta");
  const btnGirar = document.getElementById("btnGirar");

  // Monta gradiente cônico da roleta
  let conicGradient = "conic-gradient(";
  roletaNumeros.forEach((item, index) => {
    let inicio = index * anguloPorFatia;
    let fim = (index + 1) * anguloPorFatia;
    let hexCor = item.cor === "ciano" ? "#00f2fe" : "#ff007f";
    conicGradient += `${hexCor} ${inicio}deg ${fim}deg${index === totalFatias - 1 ? "" : ", "}`;
  });
  conicGradient += ")";
  roleta.style.background = conicGradient;

  // Insere os números
  roletaNumeros.forEach((item, i) => {
    const elNumero = document.createElement("div");
    elNumero.className = "numero-fatia";
    elNumero.innerText = item.num;
    
    const angulo = i * anguloPorFatia + (anguloPorFatia / 2);
    elNumero.style.transform = `rotate(${angulo}deg)`;
    roleta.appendChild(elNumero);
  });

  btnGirar.addEventListener("click", jogar);

  // Inicia efeito de luzes LED caindo
  iniciarChuvaLED();
});

function jogar() {
  const apostaDigitada = document.getElementById("corInput").value.toLowerCase().trim();
  const mensagem = document.getElementById("mensagem");
  const roleta = document.getElementById("roleta");
  const fundo = document.getElementById("fundo");
  const btnGirar = document.getElementById("btnGirar");

  if (!apostaDigitada) {
    mensagem.style.color = "#ff9f43";
    mensagem.innerText = "Digite uma cor (ciano, rosa) ou um número (1 a 36)!";
    return;
  }

  let tipoAposta = "";
  let corApostada = "";
  let numeroApostado = null;

  if (!isNaN(apostaDigitada)) {
    const num = parseInt(apostaDigitada);
    if (num < 1 || num > 36) {
      mensagem.style.color = "#ff9f43";
      mensagem.innerText = "Digite um número válido entre 1 e 36!";
      return;
    }
    tipoAposta = "numero";
    numeroApostado = num;
  } else {
    if (apostaDigitada !== "ciano" && apostaDigitada !== "rosa") {
      mensagem.style.color = "#ff9f43";
      mensagem.innerText = "Cor inválida! Digite apenas 'ciano' ou 'rosa'.";
      return;
    }
    tipoAposta = "cor";
    corApostada = apostaDigitada;
  }

  fundo.className = "fundo-espaco girando";
  mensagem.style.color = "#00f2fe";
  mensagem.innerText = "GIRANDO A ROLETA...";
  btnGirar.disabled = true;

  const indiceSorteado = Math.floor(Math.random() * totalFatias);
  const resultado = roletaNumeros[indiceSorteado];

  const anguloCentroFatia = (indiceSorteado * anguloPorFatia) + (anguloPorFatia / 2);
  const girosExtras = 360 * 5;

  rotacaoAcumulada += girosExtras + (360 - (rotacaoAcumulada % 360)) - anguloCentroFatia;
  roleta.style.transform = `rotate(${rotacaoAcumulada}deg)`;

  setTimeout(() => {
    btnGirar.disabled = false;

    let venceu = false;

    if (tipoAposta === "cor") {
      if (corApostada === resultado.cor) {
        venceu = true;
      }
    } else if (tipoAposta === "numero") {
      if (numeroApostado === resultado.num) {
        venceu = true;
      }
    }

    if (venceu) {
      fundo.className = "fundo-espaco vitoria";
      mensagem.style.color = "#00cec9";
      mensagem.innerText = `🎉 GANHOU! A roleta parou no ${resultado.num} (${resultado.cor.toUpperCase()})! 🎉`;
    } else {
      fundo.className = "fundo-espaco derrota";
      mensagem.style.color = "#ff7675";
      mensagem.innerText = `😢 PERDEU! A roleta parou no ${resultado.num} (${resultado.cor.toUpperCase()}). Tente de novo!`;
    }
  }, 4000);
}

// Efeito de partículas LED caindo
function iniciarChuvaLED() {
  const canvas = document.getElementById("canvasChuva");
  const ctx = canvas.getContext("2d");

  function redimensionar() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  redimensionar();
  window.addEventListener("resize", redimensionar);

  const particulas = [];
  const quantidade = 40;
  const cores = ["#00f2fe", "#ff007f"];

  for (let i = 0; i < quantidade; i++) {
    particulas.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      tamanho: Math.random() * 3 + 2,
      velocidadeY: Math.random() * 2 + 1,
      cor: cores[Math.floor(Math.random() * cores.length)],
      comprimento: Math.random() * 15 + 10
    });
  }

  function animar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particulas.forEach(p => {
      ctx.beginPath();
      ctx.strokeStyle = p.cor;
      ctx.lineWidth = p.tamanho;
      ctx.shadowBlur = 10;
      ctx.shadowColor = p.cor;
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x, p.y + p.comprimento);
      ctx.stroke();

      p.y += p.velocidadeY;

      if (p.y > canvas.height) {
        p.y = -p.comprimento;
        p.x = Math.random() * canvas.width;
      }
    });

    requestAnimationFrame(animar);
  }

  animar();
}
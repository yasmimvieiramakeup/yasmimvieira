"use strict";

document.documentElement.classList.add("js");

// O menu continua disponível quando o JavaScript está desativado.
const menuToggle = document.querySelector(".menu-toggle");
const menu = document.querySelector("#menu-principal");
const telaCompacta = window.matchMedia("(max-width: 800px)");

function fecharMenu(devolverFoco = false) {
  menu.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  if (devolverFoco) menuToggle.focus();
}

menuToggle.hidden = false;
menuToggle.addEventListener("click", () => {
  const aberto = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!aberto));
  menu.classList.toggle("is-open", !aberto);
});

menu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => fecharMenu());
});

document.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
    fecharMenu(true);
  }
});

document.addEventListener("click", (evento) => {
  if (!evento.target.closest(".cabecalho")) fecharMenu();
});

telaCompacta.addEventListener("change", () => fecharMenu());

// Os links das fotos funcionam mesmo sem suporte ao diálogo.
const fotoDialog = document.querySelector("#foto-dialog");
const fotoAmpliada = fotoDialog.querySelector(".foto-dialog-imagem");
const fotoLegenda = document.querySelector("#foto-legenda");

if (typeof fotoDialog.showModal === "function") {
  document.querySelectorAll(".foto-ampliar").forEach((link) => {
    link.addEventListener("click", (evento) => {
      if (evento.ctrlKey || evento.metaKey || evento.shiftKey || evento.altKey) return;
      evento.preventDefault();
      fotoAmpliada.src = link.href;
      fotoAmpliada.alt = link.querySelector("img").alt;
      fotoLegenda.textContent = link.dataset.legenda;
      fotoDialog.showModal();
      document.body.classList.add("modal-aberto");
    });
  });

  fotoDialog.querySelector(".foto-fechar").addEventListener("click", () => fotoDialog.close());
  fotoDialog.addEventListener("click", (evento) => {
    if (evento.target !== fotoDialog) return;
    const limites = fotoDialog.getBoundingClientRect();
    const foraDoDialogo = evento.clientX < limites.left || evento.clientX > limites.right
      || evento.clientY < limites.top || evento.clientY > limites.bottom;
    if (foraDoDialogo) fotoDialog.close();
  });
  fotoDialog.addEventListener("close", () => document.body.classList.remove("modal-aberto"));
}

// O formulário prepara a mensagem; somente a cliente a envia no WhatsApp.
const formulario = document.querySelector("#formulario-contato");
const campos = formulario.querySelector(".formulario-campos");
const servico = formulario.querySelector("#servico");
const dataEvento = formulario.querySelector("#data-evento");
const localEvento = formulario.querySelector("#local-evento");
const mensagem = formulario.querySelector('[name="text"]');

// Os outros campos apenas montam o conteúdo do parâmetro "text".
[servico, dataEvento, localEvento].forEach((campo) => campo.removeAttribute("name"));
campos.hidden = false;

const hoje = new Date();
dataEvento.min = [hoje.getFullYear(), String(hoje.getMonth() + 1).padStart(2, "0"), String(hoje.getDate()).padStart(2, "0")].join("-");

formulario.addEventListener("submit", () => {
  const linhas = ["Olá, Yasmim! Gostaria de saber mais e consultar a disponibilidade.", "", "Serviço: " + servico.value];
  if (dataEvento.value) {
    const [ano, mes, dia] = dataEvento.value.split("-");
    linhas.push("Data: " + dia + "/" + mes + "/" + ano);
  }
  if (localEvento.value.trim()) linhas.push("Cidade/local: " + localEvento.value.trim());
  mensagem.value = linhas.join("\n");
});

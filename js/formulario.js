/* Formulário de adoção: máscaras de CPF e WhatsApp + envio */
(() => {
  const form = document.getElementById("form-adocao");
  if (!form) return;

  const aplicarMascara = (campo, formatar) => {
    campo.addEventListener("input", () => {
      campo.value = formatar(campo.value.replace(/\D/g, ""));
    });
  };

  aplicarMascara(form.cpf, (v) =>
    v
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
  );

  aplicarMascara(form.whatsapp, (v) =>
    v
      .slice(0, 11)
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d{1,4})$/, "$1-$2")
  );

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    if (!form.reportValidity()) return;

    /* TODO: enviar `new FormData(form)` para o back-end. */
    form.querySelector(".form__msg").textContent =
      "Recebemos seus dados! Nossa equipe vai falar com você pelo WhatsApp.";
    form.reset();
  });
})();

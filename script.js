const WHATSAPP_PHONE = '5533998547165';
const REQUIRED_FIELDS = ['nome', 'telefone', 'cidade', 'cultura', 'necessidade'];
const ERROR_MESSAGE = 'Preencha este campo para continuar.';

export function normalizeField(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

export function validateQuoteRequest(data) {
  return Object.fromEntries(
    REQUIRED_FIELDS.filter((field) => normalizeField(data?.[field]).length < 2).map(
      (field) => [field, ERROR_MESSAGE],
    ),
  );
}

export function buildWhatsappMessage(data) {
  return [
    '*SOLICITAÇÃO DE ORÇAMENTO — MAIRINQUES*',
    '',
    `Nome: ${normalizeField(data.nome)}`,
    `Telefone: ${normalizeField(data.telefone)}`,
    `Cidade/região: ${normalizeField(data.cidade)}`,
    `Cultura: ${normalizeField(data.cultura)}`,
    '',
    '*Necessidade:*',
    normalizeField(data.necessidade),
  ].join('\n');
}

export function buildWhatsappUrl(data, phone = WHATSAPP_PHONE) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(buildWhatsappMessage(data))}`;
}

function initializeMenu() {
  const toggle = document.querySelector('#menu-toggle');
  const navigation = document.querySelector('#site-nav');

  if (!toggle || !navigation) return;

  const closeMenu = () => {
    toggle.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
  };

  toggle.addEventListener('click', () => {
    const shouldOpen = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(shouldOpen));
    navigation.classList.toggle('is-open', shouldOpen);
  });

  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
      toggle.focus();
    }
  });
}

function initializeYear() {
  const currentYear = String(new Date().getFullYear());

  for (const element of document.querySelectorAll('[data-current-year]')) {
    element.textContent = currentYear;
  }
}

function initializeQuoteForm() {
  const form = document.querySelector('#quote-form');
  const status = document.querySelector('#form-status');

  if (!form || !status) return;

  const clearFieldError = (field) => {
    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');
    const error = document.querySelector(`#${field.name}-error`);
    if (error) error.textContent = '';
  };

  const showFieldError = (field, message) => {
    const errorId = `${field.name}-error`;
    const error = document.querySelector(`#${errorId}`);
    field.setAttribute('aria-invalid', 'true');
    field.setAttribute('aria-describedby', errorId);
    if (error) error.textContent = message;
  };

  for (const field of form.elements) {
    if (field instanceof HTMLElement && field.matches('input, textarea')) {
      field.addEventListener('input', () => clearFieldError(field));
    }
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    status.textContent = '';

    const formData = new FormData(form);
    const request = Object.fromEntries(REQUIRED_FIELDS.map((field) => [field, formData.get(field)]));
    const errors = validateQuoteRequest(request);

    for (const name of REQUIRED_FIELDS) {
      const field = form.elements.namedItem(name);
      if (!(field instanceof HTMLElement)) continue;
      clearFieldError(field);
      if (errors[name]) showFieldError(field, errors[name]);
    }

    const firstInvalidField = REQUIRED_FIELDS.map((name) => form.elements.namedItem(name)).find(
      (field) => field instanceof HTMLElement && field.getAttribute('aria-invalid') === 'true',
    );

    if (firstInvalidField instanceof HTMLElement) {
      status.textContent = 'Revise os campos indicados antes de continuar.';
      firstInvalidField.focus();
      return;
    }

    const url = buildWhatsappUrl(request);
    const whatsappWindow = window.open(url, '_blank', 'noopener,noreferrer');

    if (!whatsappWindow) {
      window.location.assign(url);
    } else {
      status.textContent = 'Pedido organizado. Revise a mensagem na nova aba do WhatsApp.';
    }
  });
}

function initializePage() {
  document.documentElement.classList.add('js');
  initializeMenu();
  initializeYear();
  initializeQuoteForm();
}

if (typeof document !== 'undefined') {
  initializePage();
}

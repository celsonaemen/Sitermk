const tabs = await (await fetch('http://127.0.0.1:9222/json')).json();
const tab = tabs.find(({ url }) => url.includes('127.0.0.1:5501'));

if (!tab) {
  throw new Error('A aba local em http://127.0.0.1:5501 não foi encontrada.');
}

const socket = new WebSocket(tab.webSocketDebuggerUrl);
const pending = new Map();
let requestId = 0;

socket.onmessage = ({ data }) => {
  const message = JSON.parse(data);
  const resolve = pending.get(message.id);

  if (resolve) {
    resolve(message);
    pending.delete(message.id);
  }
};

await new Promise((resolve, reject) => {
  socket.onopen = resolve;
  socket.onerror = reject;
});

const call = (method, params = {}) =>
  new Promise((resolve) => {
    const id = ++requestId;
    pending.set(id, resolve);
    socket.send(JSON.stringify({ id, method, params }));
  });

const evaluate = async (expression) => {
  const response = await call('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });

  if (response.result.exceptionDetails) {
    throw new Error(response.result.exceptionDetails.text);
  }

  return response.result.result.value;
};

await call('Runtime.enable');
await call('Emulation.setDeviceMetricsOverride', {
  width: 1440,
  height: 900,
  deviceScaleFactor: 1,
  mobile: false,
});

const desktop = await evaluate(`(() => ({
  url: location.href,
  overflow: document.documentElement.scrollWidth <= innerWidth,
  images: [...document.images].every((image) => image.complete && image.naturalWidth > 0),
  scripts: [...document.scripts].filter((script) => script.src).map((script) => script.src),
  styles: [...document.styleSheets].map((sheet) => sheet.href).filter(Boolean),
}))()`);

const menu = await evaluate(`(() => {
  const button = document.querySelector('.menu-toggle');
  button.click();
  const result = {
    expanded: button.getAttribute('aria-expanded'),
    open: document.querySelector('.site-nav').classList.contains('is-open'),
  };
  button.click();
  return result;
})()`);

const form = await evaluate(`(() => {
  const form = document.querySelector('#quote-form');
  form.querySelectorAll('input, textarea').forEach((field) => { field.value = ''; });
  form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  return {
    invalid: form.querySelectorAll('[aria-invalid="true"]').length,
    focused: document.activeElement?.name || document.activeElement?.id,
  };
})()`);

await call('Emulation.setDeviceMetricsOverride', {
  width: 390,
  height: 844,
  deviceScaleFactor: 1,
  mobile: true,
});

const mobile = await evaluate(`({
  overflow: document.documentElement.scrollWidth <= innerWidth,
  width: innerWidth,
  scrollWidth: document.documentElement.scrollWidth,
})`);

console.log(JSON.stringify({ desktop, menu, form, mobile }, null, 2));
socket.close();

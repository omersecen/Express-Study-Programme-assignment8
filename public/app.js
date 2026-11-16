const buttons = document.querySelectorAll('[data-path]');
const requestLine = document.getElementById('request-line');
const statusLine = document.getElementById('status');
const responseBody = document.getElementById('response-body');

async function showResponse(button) {
  const path = button.dataset.path;
  const method = button.dataset.method || 'GET';

  buttons.forEach(item => { item.disabled = true; });
  requestLine.textContent = `${method} ${path}`;
  statusLine.textContent = 'Status: waiting...';
  responseBody.textContent = 'Loading...';

  try {
    const response = await fetch(path, { method });
    const data = await response.json();

    statusLine.textContent = `Status: ${response.status} ${response.statusText}`;
    responseBody.textContent = JSON.stringify(data, null, 2);
  } catch {
    statusLine.textContent = 'Status: no response';
    responseBody.textContent = 'Could not load a response. Check that the server is running and try again.';
  } finally {
    buttons.forEach(item => { item.disabled = false; });
  }
}

buttons.forEach(button => {
  button.addEventListener('click', () => showResponse(button));
});

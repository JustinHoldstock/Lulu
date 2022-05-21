import './app.element.scss';
// import './scene';

export class AppElement extends HTMLElement {
  public static observedAttributes = [];

  connectedCallback() {
    const title = 'sandbox';
    this.innerHTML = `
    <div class="wrapper">
    </div>
      `;
  }
}
customElements.define('lulu-root', AppElement);

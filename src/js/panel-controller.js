export class PanelController {
  constructor(panelId, onButtonClick) {
    this.panel = document.getElementById(panelId);
    this.buttons = this.panel.querySelectorAll('.holo-btn');
    this.isVisible = false;
    
    // Attach event listeners
    this.buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const section = e.target.dataset.section;
        const buttonText = e.target.textContent;
        if (onButtonClick) {
          onButtonClick(section, buttonText);
        }
      });
    });
  }

  show() {
    if (this.isVisible) return;
    this.panel.classList.remove('hidden');
    this.isVisible = true;
  }

  hide() {
    if (!this.isVisible) return;
    this.panel.classList.add('hidden');
    this.isVisible = false;
  }
}

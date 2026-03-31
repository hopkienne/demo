// g:\zalo_mini_app\demo-sp\js\chatbot.js

class ChatbotController {
  constructor(chatbotId, onClose) {
    this.container = document.getElementById(chatbotId);
    this.messagesContainer = this.container.querySelector('.chatbot-messages');
    this.input = this.container.querySelector('.chatbot-input');
    this.sendBtn = this.container.querySelector('.chatbot-send');
    this.sectionTitle = this.container.querySelector('.chatbot-section-name');
    this.closeBtn = this.container.querySelector('.chatbot-close');
    this.isVisible = false;
    this.isTyping = false;
    this.currentContext = 'info';

    // Mock API delay simulator
    this.delay = ms => new Promise(res => setTimeout(res, ms));

    this.bindEvents(onClose);
  }

  bindEvents(onClose) {
    this.closeBtn.addEventListener('click', () => {
      this.hide();
      if (onClose) onClose();
    });

    this.sendBtn.addEventListener('click', () => this.handleUserSubmit());

    this.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.handleUserSubmit();
      }
    });
  }

  show(sectionContext, sectionName) {
    this.currentContext = sectionContext;
    this.sectionTitle.textContent = sectionName;
    this.container.classList.remove('hidden');
    this.isVisible = true;

    // Reset messages and send greetings
    this.messagesContainer.innerHTML = '';

    let greeting = 'Xin chào! Tôi có thể giúp gì cho bạn?';
    if (sectionContext === 'info') {
      greeting = 'Xin chào! Bạn muốn hỏi về thông tin gì của Gapit?';
    } else if (sectionContext === 'product') {
      greeting = 'Chào bạn, bạn muốn tìm hiểu về sản phẩm công nghệ nào của chúng tôi?';
    }

    this.simulateBotResponse(greeting, 500);
  }

  hide() {
    this.container.classList.add('hidden');
    this.isVisible = false;
  }

  async handleUserSubmit() {
    const text = this.input.value.trim();
    if (!text || this.isTyping) return;

    // 1. Add User Message
    this.addMessage(text, 'user');
    this.input.value = '';

    // 2. Show Typing Indicator
    this.isTyping = true;
    const typingElement = this.showTypingIndicator();
    this.scrollToBottom();

    // 3. Mock Call Backend
    const response = await this.mockApiCall(text, this.currentContext);

    // 4. Hide Typing Indicator
    if (typingElement && typingElement.parentNode) {
      typingElement.parentNode.removeChild(typingElement);
    }
    this.isTyping = false;

    // 5. Add Bot Message
    this.addMessage(response, 'bot');
  }

  addMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    msgDiv.textContent = text;
    this.messagesContainer.appendChild(msgDiv);
    this.scrollToBottom();
  }

  showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('typing-indicator');

    // 3 dots
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('div');
      dot.classList.add('typing-dot');
      typingDiv.appendChild(dot);
    }

    this.messagesContainer.appendChild(typingDiv);
    return typingDiv;
  }

  scrollToBottom() {
    setTimeout(() => {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }, 50);
  }

  async simulateBotResponse(text, delayMs) {
    this.isTyping = true;
    const typingElement = this.showTypingIndicator();
    this.scrollToBottom();

    await this.delay(delayMs);

    if (typingElement && typingElement.parentNode) {
      typingElement.parentNode.removeChild(typingElement);
    }
    this.isTyping = false;
    this.addMessage(text, 'bot');
  }

  // --- MOCK API V1 ---
  async mockApiCall(userAction, context) {
    await this.delay(1000 + Math.random() * 1000); // Wait 1-2s

    const lowerStr = userAction.toLowerCase();

    if (context === 'info') {
      if (lowerStr.includes('ai') || lowerStr.includes('là ai')) {
        return 'Tôi là Robot G - trí tuệ nhân tạo được phát triển để hỗ trợ người dùng. Tôi có khả năng xử lý thông tin nhanh và tương tác linh hoạt.';
      }
      return 'Thông tin này rất thú vị. Bạn có muốn biết thêm về cách tôi được lập trình không?';
    }

    // context: product
    if (lowerStr.includes('giá') || lowerStr.includes('tiền')) {
      return 'Mức giá cho các sản phẩm linh kiện này vô cùng hợp lý, dao động từ 100 cho đến 500 tín chỉ không gian tùy vào dòng đời của linh kiện.';
    }
    return 'Hiện tại tôi đang quản lý 15 mẫu robot khác nhau trong bộ sưu tập sản phẩm. Bạn quan tâm đến mẫu nào?';
  }
}

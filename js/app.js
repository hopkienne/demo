// g:\zalo_mini_app\demo-sp\js\app.js

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Initialize Components
    const panelCtrl = new PanelController('holo-panel', handlePanelButtonClick);
    const chatbotCtrl = new ChatbotController('chatbot', handleChatbotClose);
    
    const loadingScreen = document.getElementById('loading-screen');
    const progressBar = document.getElementById('progress-bar');
    
    // Update progress bar
    const updateProgress = (ratio) => {
        progressBar.style.width = `${Math.floor(ratio * 100)}%`;
    };
    
    // Total physical frames 169 + 1 (frame 181 mapped to 170th frame logic)
    const PLAYER_TOTAL_FRAMES = 170; 
    const PLAYER_TRIGGER_FRAME = 145;
  
    const framePlayer = new FramePlayer(
      'frame-canvas',
      PLAYER_TOTAL_FRAMES, 
      PLAYER_TRIGGER_FRAME,
      onFrameTrigger, // frame 145 reached
      onFrameEnd,     // final frame reached
      updateProgress  // preload progress
    );
  
    // 2. Preload and Start
    console.log('Starting Preload...');
    await framePlayer.preload();
    console.log('Preload Complete. Playing animation...');
    
    // Hide UI loading 
    loadingScreen.classList.add('hidden');
    
    // Auto-play the frame sequence
    framePlayer.play();
  
    // 3. Controller Callbacks
    function onFrameTrigger() {
      // Robot reached center. Show the panel.
      panelCtrl.show();
    }
    
    function onFrameEnd() {
      // Frame animation finished (panel fully presented behind/around robot).
      // State sits at IdleLoop with panel open
      console.log('Animation playback complete, waiting for user input.');
    }
  
    function handlePanelButtonClick(sectionContext, sectionName) {
      // User clicked a category. Hide panel, open chatbot
      panelCtrl.hide();
      
      // Delay chatbot spawn slightly so panel has time to dissolve
      setTimeout(() => {
          chatbotCtrl.show(sectionContext, sectionName);
      }, 300);
    }
  
    function handleChatbotClose() {
      // Chatbot closed -> Restore the holographic panel
      panelCtrl.show();
    }
  });

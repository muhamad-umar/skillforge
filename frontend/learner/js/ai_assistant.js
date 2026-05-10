(function() {
  const chatBody = document.querySelector('.chat .body');
  const chatInput = document.querySelector('.composer input');
  const chatSend = document.querySelector('.composer button');

  if (!chatBody || !chatInput || !chatSend) return;

  const dummyAnswers = [
    "That's a fascinating perspective! Keep exploring this topic.",
    "I recommend breaking the problem into smaller, manageable chunks.",
    "Did you know? Consistent practice is the key to mastery.",
    "Here is a related quest you might enjoy: 'Advanced CSS Layouts'.",
    "Great question! Have you tried reviewing the documentation for more insights?",
    "That is correct! You're making excellent progress.",
    "Let me think about that... Yes, your approach makes sense!",
    "Error 404: Motivation not found... Just kidding! Let's get back to learning! ⚡"
  ];

  function getDummyAnswer(query) {
    const q = query.toLowerCase();
    if (q.includes('promise') || q.includes('async')) {
      return "A Promise is a placeholder for a future value. It can be <b>pending</b>, <b>fulfilled</b>, or <b>rejected</b>. Want a 5-min quest with hands-on examples?";
    }
    if (q.includes('css') || q.includes('grid') || q.includes('flex')) {
      return "CSS Grid is perfect for two-dimensional layouts, while Flexbox shines for one-dimensional alignment. Which one are you trying to use?";
    }
    if (q.includes('react') || q.includes('component')) {
      return "React components are independent and reusable bits of code. They serve the same purpose as JavaScript functions, but work in isolation and return HTML.";
    }
    if (q.includes('algorithm') || q.includes('big o') || q.includes('big-o')) {
      return "Big-O notation describes the worst-case scenario for an algorithm's time or space complexity. Ready for a quick quiz on sorting algorithms?";
    }
    const randomIndex = Math.floor(Math.random() * dummyAnswers.length);
    return dummyAnswers[randomIndex];
  }

  function addMessage(role, text) {
    const b = document.createElement('div');
    b.className = 'bubble ' + role;
    if (role === 'ai') {
      b.innerHTML = text; // Allow HTML styling for AI responses
    } else {
      b.textContent = text;
    }
    chatBody.appendChild(b);
    chatBody.scrollTop = chatBody.scrollHeight;
    return b;
  }

  function reply(query) {
    const t = document.createElement('div');
    t.className = 'bubble ai';
    t.innerHTML = '<span class="typing"><span></span><span></span><span></span></span>';
    chatBody.appendChild(t);
    chatBody.scrollTop = chatBody.scrollHeight;
    
    setTimeout(() => {
      t.innerHTML = getDummyAnswer(query);
      chatBody.scrollTop = chatBody.scrollHeight;
    }, 900 + Math.random() * 500); // 900-1400ms delay
  }

  function submitChat() {
    const v = chatInput.value.trim();
    if (!v) return;
    addMessage('me', v);
    chatInput.value = '';
    reply(v);
  }

  // Use event listeners, IIFE ensures variables are locally scoped
  chatSend.addEventListener('click', submitChat);
  
  chatInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') submitChat();
  });

  document.querySelectorAll('.suggested .s').forEach(s => {
    s.addEventListener('click', () => {
      chatInput.value = s.textContent;
      submitChat();
    });
  });
})();

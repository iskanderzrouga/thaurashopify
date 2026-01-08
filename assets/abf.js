// Bundle selection
    document.querySelectorAll('.bundle-option').forEach(option => {
      option.addEventListener('click', () => {
        document.querySelectorAll('.bundle-option').forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
      });
    });
    
    // FAQ accordion
    document.querySelectorAll('.faq-question').forEach(question => {
      question.addEventListener('click', () => {
        question.parentElement.classList.toggle('open');
      });
    });
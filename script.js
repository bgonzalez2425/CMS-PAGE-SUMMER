document.addEventListener('DOMContentLoaded', function() {
  const expandButtons = document.querySelectorAll('.fullscreen-expand-btn');
  const videoModal = document.getElementById('videoModal');
  const modalVideo = document.getElementById('modalVideo');
  const closeModal = document.getElementById('closeModal');
  
  // Función para abrir el modal con el video seleccionado
  function openVideoModal(videoId) {
    // Usar autoplay=1 para que el video comience automáticamente al abrirse
    modalVideo.setAttribute('src', `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`);
    videoModal.classList.remove('hidden');
    videoModal.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }
  
  // Función para cerrar el modal
  function closeVideoModal() {
    videoModal.classList.add('hidden');
    videoModal.classList.remove('visible');
    modalVideo.setAttribute('src', '');
    document.body.style.overflow = '';
  }
  
  // Modificación para que los botones expandir funcionen
  expandButtons.forEach(button => {
    button.addEventListener('mousedown', function(e) {
      // Este es el punto de inicio del clic
      button.dataset.clickStarted = 'true';
      button.dataset.clickX = e.clientX;
      button.dataset.clickY = e.clientY;
    });
    
    button.addEventListener('mouseup', function(e) {
      // Si el punto de inicio y fin son cercanos, consideramos que es un clic
      // y no un intento de interactuar con el video
      if (button.dataset.clickStarted === 'true') {
        const startX = parseInt(button.dataset.clickX);
        const startY = parseInt(button.dataset.clickY);
        const distance = Math.sqrt(Math.pow(e.clientX - startX, 2) + Math.pow(e.clientY - startY, 2));
        
        // Si el movimiento es mínimo, consideramos que es un clic para expandir
        if (distance < 10) {
          const container = button.closest('.video-container');
          const videoId = container.getAttribute('data-video-id');
          
          if (videoId) {
            e.preventDefault();
            e.stopPropagation();
            openVideoModal(videoId);
          }
        }
      }
      
      // Reiniciamos el estado
      button.dataset.clickStarted = 'false';
    });
    
    // Si el mouse se mueve demasiado, asumimos que está intentando interactuar con el video
    button.addEventListener('mousemove', function(e) {
      if (button.dataset.clickStarted === 'true') {
        const startX = parseInt(button.dataset.clickX);
        const startY = parseInt(button.dataset.clickY);
        const distance = Math.sqrt(Math.pow(e.clientX - startX, 2) + Math.pow(e.clientY - startY, 2));
        
        // Si se mueve demasiado, cancelamos la intención de clic
        if (distance > 10) {
          button.dataset.clickStarted = 'false';
        }
      }
    });
    
    // Agregar soporte para pantallas táctiles
    button.addEventListener('touchstart', function(e) {
      button.dataset.clickStarted = 'true';
      button.dataset.clickX = e.touches[0].clientX;
      button.dataset.clickY = e.touches[0].clientY;
    });
    
    button.addEventListener('touchend', function(e) {
      if (button.dataset.clickStarted === 'true') {
        const container = button.closest('.video-container');
        const videoId = container.getAttribute('data-video-id');
        
        if (videoId) {
          e.preventDefault();
          openVideoModal(videoId);
        }
      }
      
      button.dataset.clickStarted = 'false';
    });
    
    button.addEventListener('touchmove', function(e) {
      if (button.dataset.clickStarted === 'true') {
        const startX = parseInt(button.dataset.clickX);
        const startY = parseInt(button.dataset.clickY);
        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;
        const distance = Math.sqrt(Math.pow(touchX - startX, 2) + Math.pow(touchY - startY, 2));
        
        if (distance > 10) {
          button.dataset.clickStarted = 'false';
        }
      }
    });
  });
  
  // Cerrar el modal al hacer clic en el botón de cerrar
  closeModal.addEventListener('click', closeVideoModal);
  
  // También cerrar al hacer clic fuera del video
  videoModal.addEventListener('click', function(event) {
    if (event.target === videoModal) {
      closeVideoModal();
    }
  });
  
  // Cerrar al presionar Escape
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && !videoModal.classList.contains('hidden')) {
      closeVideoModal();
    }
  });
});
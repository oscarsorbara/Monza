<!--
  INSTRUCCIONES DE INSTALACIÓN EN SHOPIFY:
  1. Ingresá al admin de Shopify (https://tusitio.myshopify.com/admin).
  2. Andá a **Configuración** (Settings) (abajo a la izquierda).
  3. Hacé clic en **Pantalla de pago** (Checkout).
  4. Bajá hasta encontrar la sección **"Página de estado del pedido"** (Order status page).
  5. En el cuadro **"Scripts adicionales"**, pegá TODO el contenido de abajo.
  6. Guardá los cambios.
-->

<script>
  (function() {
    // ---------------------------------------------------------
    // MONZA RACING PARTS - SCRIPT DE REDIRECCIÓN SHOPIFY
    // Método Híbrido: Botón + Redirección Automática
    // ---------------------------------------------------------

    // Datos inyectados por Shopify (Liquid)
    var orderId = "{{ checkout.order_id }}";
    var orderName = "{{ checkout.order_name }}";
    var customerEmail = "{{ checkout.email }}";
    
    // URL base de tu página de éxito en Vercel/Netlify
    var baseURL = "https://monzars.com/booking-success";
    
    // Construir la URL con parámetros para que tu app reconozca el pedido
    var targetURL = baseURL + "?order=" + orderId + "&orderName=" + encodeURIComponent(orderName) + "&email=" + encodeURIComponent(customerEmail);

    // Función principal que inyecta la interfaz
    function initMonzaRedirect() {
      // Evitar duplicados si el script corre dos veces
      if (document.getElementById('monza-redirect-btn')) return;

      // 1. CREAR EL BOTÓN
      var btn = document.createElement("a");
      btn.id = "monza-redirect-btn";
      btn.href = targetURL;
      btn.innerHTML = "📅 RESERVAR TURNO / GESTIONAR PEDIDO";
      btn.target = "_self";
      
      // Estilos Monza Red
      btn.style.cssText = `
        display: block;
        background-color: #D90429;
        color: #FFFFFF;
        text-align: center;
        padding: 18px 24px;
        margin: 20px 0;
        border-radius: 5px;
        font-weight: 700;
        text-decoration: none;
        font-size: 16px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        cursor: pointer;
        width: 100%;
        box-sizing: border-box;
      `;

      // 2. INSERTARLO EN EL LUGAR CORRECTO (Shopify Standard Checkout)
      // Buscamos la caja de "Tu pedido está confirmado"
      var container = document.querySelector('.os-step__content') || document.querySelector('.content-box');
      
      if (container) {
          container.insertBefore(btn, container.firstChild);
      } else {
          // Fallback: pegarlo antes del footer
          var footer = document.querySelector('.content-box__row');
          if(footer) footer.parentNode.insertBefore(btn, footer);
          else document.body.prepend(btn);
      }

      // 3. MENSAJE DE REDIRECCIÓN Y TIMER
      // Verificamos si ya venimos de ahí para no loopear
      if (document.referrer.indexOf('monzars.com') === -1) {
          var timerContainer = document.createElement("div");
          timerContainer.style.textAlign = "center";
          timerContainer.style.marginTop = "10px";
          timerContainer.style.color = "#555";
          timerContainer.innerHTML = "Serás redirigido en <span id='m-timer'>4</span> segundos...";
          
          btn.parentNode.insertBefore(timerContainer, btn.nextSibling);

          var timeLeft = 4;
          var interval = setInterval(function() {
              timeLeft--;
              var span = document.getElementById('m-timer');
              if(span) span.innerText = timeLeft;

              if (timeLeft <= 0) {
                  clearInterval(interval);
                  window.location.href = targetURL;
              }
          }, 1000);
      }
    }

    // Ejecutar cuando el DOM esté listo (Shopify load page steps)
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initMonzaRedirect);
    } else {
      initMonzaRedirect();
    }

  })();
</script>

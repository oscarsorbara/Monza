<!--
  INSTRUCCIONES DE INSTALACIÓN:
  1. Ingresá al administrador de tu Tienda Nube.
  2. Andá a "Configuraciones" > "Códigos externos".
  3. Buscá la sección "Códigos de conversión" o "Pixel de seguimiento".
  4. Pegá TODO el contenido de abajo en el campo "Código de conversión (HTML/Javascript)".
  5. Guardá los cambios.
-->

<script>
  document.addEventListener("DOMContentLoaded", function() {
    // ---------------------------------------------------------
    // MONZA RACING PARTS - SCRIPT DE REDIRECCIÓN A TURNOS
    // Método Híbrido: Botón + Redirección Automática
    // ---------------------------------------------------------

    // 1. Validar que estamos en la página de éxito ("Gracias por tu compra")
    if (window.location.href.indexOf('checkout/success') > -1) {
        
        // --- CONFIGURACIÓN ---
        var baseURL = "https://monzars.com/booking-success";
        
        // Intentar obtener datos de la orden (si Tienda Nube los expone en LS.order)
        var orderId = (typeof LS !== 'undefined' && LS.order) ? LS.order.id : '';
        var email = (typeof LS !== 'undefined' && LS.order) ? LS.order.contact_email : '';
        
        // Construir URL final con parámetros (opcional, ayuda al tracking)
        var targetURL = baseURL;
        if(orderId) {
            targetURL += "?order=" + orderId + "&email=" + email;
        }

        // --- PARTE 1: CREAR EL BOTÓN VISUAL ---
        var btn = document.createElement("a");
        btn.href = targetURL;
        btn.innerHTML = "📅 RESERVAR TURNO AHORA";
        btn.target = "_self"; // _self: misma ventana
        
        // Estilos "Monza Red" para que coincida con la marca
        btn.style.cssText = `
            display: block;
            background-color: #D90429;
            color: #FFFFFF;
            text-align: center;
            padding: 16px 24px;
            margin: 25px 0;
            border-radius: 8px;
            font-weight: 800;
            text-decoration: none;
            font-size: 18px;
            text-transform: uppercase;
            letter-spacing: 1px;
            box-shadow: 0 4px 15px rgba(217, 4, 41, 0.4);
            transition: transform 0.2s ease, opacity 0.2s;
            cursor: pointer;
            width: 100%;
            box-sizing: border-box;
        `;
        
        // Efecto Hover simple
        btn.onmouseover = function() { btn.style.transform = "scale(1.02)"; btn.style.opacity = "0.9"; };
        btn.onmouseout  = function() { btn.style.transform = "scale(1)"; btn.style.opacity = "1"; };
        
        // Insertar el botón en la mejor posición posible
        // Buscamos contenedores comunes en plantillas Tienda Nube
        var container = document.querySelector('.checkout-success') 
                     || document.querySelector('.container') 
                     || document.querySelector('#content');
        
        if (container) {
            // Intentar insertar justo después del título de agradecimiento si existe
            var title = container.querySelector('h1') || container.querySelector('h2');
            if(title) {
                title.parentNode.insertBefore(btn, title.nextSibling);
            } else {
                container.insertBefore(btn, container.firstChild);
            }
        } else {
            // Fallback: Si no encuentra estructura, lo pega arriba de todo
            document.body.prepend(btn);
        }

        // --- PARTE 2: REDIRECCIÓN AUTOMÁTICA ---
        // Verificamos el 'referrer' para evitar bucles infinitos si el usuario vuelve atrás
        if (document.referrer.indexOf('monzars.com/booking-success') === -1) {
             
             // Crear mensaje de cuenta regresiva
             var timerMsg = document.createElement("div");
             timerMsg.innerHTML = "Serás redirigido a la agenda en <span id='redir-timer'>4</span> segundos...";
             timerMsg.style.cssText = "text-align:center; color:#666; font-size:14px; margin-top:10px;";
             
             if(btn.parentNode) {
                 btn.parentNode.insertBefore(timerMsg, btn.nextSibling);
             }

             var timeLeft = 4;
             var downloadTimer = setInterval(function(){
                timeLeft--;
                var span = document.getElementById("redir-timer");
                if(span) span.textContent = timeLeft;
                
                if(timeLeft <= 0){
                    clearInterval(downloadTimer);
                    window.location.href = targetURL;
                }
             }, 1000);
        }
    }
  });
</script>

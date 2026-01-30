# Guía de Configuración: Descuento Oferta Relámpago

Para que la funcionalidad de "Oferta Relámpago" funcione correctamente y el descuento del 30% se aplique en el Checkout, debes configurar el cupón en Shopify siguiendo estos pasos exactos.

## 1. Crear el Descuento en Shopify

1.  Ve a tu **Panel de Administración de Shopify**.
2.  En el menú lateral izquierdo, haz clic en **Descuentos**.
3.  Haz clic en el botón **Crear descuento** (arriba a la derecha).
4.  Selecciona el tipo: **Monto fijo fuera de productos** (Amount off products). *Nota: Aunque dice monto fijo, aquí configuramos porcentaje también.*

## 2. Configurar los Detalles

Complete el formulario con estos datos:

*   **Método:** Código de descuento.
*   **Código:** Escribe `FLASH30` (Todo mayúsculas, exacto como está aquí).
    *   *Importante: Este es el código que la App envía automáticamente.*
*   **Valor:** Selecciona **Porcentaje** y escribe `30`.
*   **Aplica a:**
    *   Opción A (Más fácil): **Todos los productos**.
    *   Opción B (Más seguro): **Colecciones específicas**. Si eliges esto, crea una colección llamada "Upsell" en Shopify y agrega los productos que aparecen en el carrusel a esa colección. Luego selecciona esa colección aquí.
*   **Requisitos mínimos de compra:** Ninguno.
*   **Elegibilidad del cliente:** Todos los clientes.
*   **Límites de uso:** (Opcional) Puedes dejarlo sin límites o limitar a uno por cliente si prefieres.
*   **Combinaciones:** Recomiendo marcar "Combinar con descuentos de envío" si ofreces envío gratis, para evitar bloqueos.

## 3. Guardar y Activar

1.  Revisa el resumen a la derecha. Debería decir "30% de descuento en todos los productos, Código: FLASH30".
2.  Haz clic en **Guardar descuento**.

## ¿Cómo "cargar" el descuento a los productos?

No necesitas editar cada producto individualmente.
*   Al crear el descuento como **"Aplica a: Todos los productos"**, automáticamente cualquier producto que el cliente agregue desde el carrusel tendrá el descuento disponible si el código `FLASH30` está presente (y la App ya se encarga de enviarlo).
*   Si solo quieres que aplique a ciertos productos (ej. solo accesorios), usa la opción de **"Colecciones específicas"** en el paso 2 y asegúrate de que tus accesorios estén en esa colección en Shopify.

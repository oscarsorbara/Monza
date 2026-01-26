# Guía para Cargar Productos en Shopify (Compatible con Monza)

Para que los productos aparezcan en tu web y funcionen con el filtro "Buscar para mi auto", debes seguir estas reglas simples al crearlos en Shopify.

## 1. Información Básica
Carga estos datos como lo harías normalmente en Shopify:
*   **Título**: Nombre del producto.
*   **Descripción**: Detalles del producto.
*   **Precio**: Precio de venta.
*   **Multimedia**: Sube al menos una foto (la primera será la portada).
*   **Tipo de producto**: Esto se usará como la **Categoría** en tu web (ej: "Frenos", "Suspensión", "Alerones").

## 2. Compatibilidad con Vehículos (IMPORTANTE)
Para que el buscador sepa a qué auto le sirve este producto, usamos las **Etiquetas (Tags)** en la barra lateral derecha de Shopify.

### Caso A: Producto Específico (ej. Solo para BMW M3)
Agrega etiquetas con el formato `clave:valor`.
*   Para la marca: `make:BMW`
*   *(Opcional) Para el modelo*: `model:M3`

> **Ejemplo Real**: Si vendes un escape para un BMW M3, agregas estas dos etiquetas:
> 1. `make:BMW`
> 2. `model:M3`

*Nota: Por ahora el sistema asume que si tiene esas etiquetas, es compatible con todos los años de ese modelo.*

### Caso B: Producto Universal (ej. Shampoo, Aceite, Llavero)
Si el producto le sirve a cualquier auto, solo agrega una etiqueta:
*   `universal`

## 3. Ejemplo Práctico

Imagina que subes unas **Pastillas de Freno para Audi RS3**.

1.  **Título**: Pastillas de Freno Deportivas
2.  **Precio**: $200
3.  **Tipo de producto**: Frenos
4.  **Etiquetas (Tags)**:
    *   `make:Audi`
    *   `model:RS3`

**Resultado en la Web:**
*   Si el cliente selecciona "Audi RS3" en el buscador -> **APARECE**.
*   Si el cliente selecciona "BMW M3" -> **NO APARECE**.
*   Si no hay auto seleccionado -> **APARECE**.

---

### Resumen de Etiquetas Soportadas
| Etiqueta | Función | Ejemplo |
| :--- | :--- | :--- |
| `make:MARCA` | Define la marca compatible | `make:Toyota` |
| `model:MODELO` | Define el modelo (opcional) | `model:Corolla` |
| `universal` | Hace que sirva para todos | `universal` |

# Guía de estilos para junior devs

Esta carpeta es la **única fuente de verdad** de la apariencia de la aplicación.

## Arquitectura (SOLID para CSS)

| Archivo | Responsabilidad | ¿Qué pongo aquí? |
|---|---|---|
| `_variables.scss` | Design tokens (colores, espaciado, tipografía, radios, sombras, easing, z-index). | **Solo** valores constantes. Nunca selectores ni mixins complejos. |
| `_custom-tokens.scss` | Exposición de los tokens como CSS Custom Properties (`var(--primary)`). | **Solo** el mapeo `:root` → tokens. |
| `_neumorphism.scss` | Sombras neumórficas puras (`neu-raised`, `neu-inset`). | **Solo** efectos de sombra. Sin colores de marca ni tipografía. |
| `_brand-logo.scss` | Mixin del logo de marca. | **Solo** el logo circular. |
| `_components.scss` | Mixins reutilizables de patrones de UI (`button-primary`, `input-inset`, `card`, `badge`, etc.). | Cada patrón que se repite en ≥2 componentes. |
| `styles.scss` | Estilos globales (reset, body, tipografía, scrollbar, keyframes, utilidades `.glass-panel`). | **Solo** reglas globales. |

### Reglas de oro

1. **Single Responsibility (S)**: un archivo, una responsabilidad. ¿Necesitas un color? `_variables.scss`. ¿Una sombra? `_neumorphism.scss`. ¿Un botón completo? `_components.scss`.
2. **Open/Closed (O)**: extiende los mixins con parámetros; no modifiques el mixin cada vez que un componente cambia.
3. **Liskov (L)**: todos los botones primarios se ven igual porque usan `@include button-primary()`.
4. **Interface Segregation (I)**: importa solo lo que necesitas (`@use 'variables' as *;` o `@use 'components' as *;`).
5. **Dependency Inversion (D)**: los componentes dependen de tokens y mixins, no de valores concretos.

## Cómo crear un nuevo componente

```scss
@use 'variables' as *;
@use 'neumorphism' as *;
@use 'components' as *;

.my-component {
  padding: $space-4;
  border-radius: $radius;
  color: $neu-text;

  .my-button {
    @include button-primary();
  }
}
```

**NO** uses valores hardcodeados (`#ff7b00`, `16px`, `0.5s ease`) si ya existe un token.

## Convenciones

- Todos los archivos parciales empiezan con `_`.
- Angular resuelve los `@use` desde `src/styles` gracias a `stylePreprocessorOptions.includePaths` en `angular.json`.
- Los SCSS variables (`$`) se usan en mixins y componentes. Las CSS variables (`var(--...)`) se usan cuando necesitas cambiarlas en runtime o en HTML.

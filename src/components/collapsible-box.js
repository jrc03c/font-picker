// -----------------------------------------------------------------------------
// CSS
// -----------------------------------------------------------------------------

const css = /* css */ `
  .font-picker-collapsible-box {
    border-radius: 4px;
    background-color: rgba(235, 235, 235);
  }

  .font-picker-collapsible-box-header {
    padding: 0.75rem;
    background-color: rgb(200, 200, 200);
    cursor: pointer;
    border-radius: 4px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-content: center;
    align-items: center;
    gap: 1.5rem;
    user-select: none;
  }

  .font-picker-collapsible-box.is-expanded >
  .font-picker-collapsible-box-header {
    border-radius: 4px 4px 0 0;
  }

  .font-picker-collapsible-box-header-button-container {
    min-width: 4em;
    text-align: right;
  }

  .font-picker-collapsible-box-body {
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    transition:
      max-height 0.05s ease-in-out,
      padding 0.05s ease-in-out,
      opacity 0.05s ease-in-out;
  }

  .font-picker-collapsible-box.is-expanded >
  .font-picker-collapsible-box-body {
    max-height: 100vh;
    overflow: auto;
    opacity: 1;
    transition:
      max-height 0.05s ease-in-out,
      padding 0.05s ease-in-out,
      opacity 0.05s ease-in-out;
  }

  button.font-picker-collapse-button,
  button.font-picker-expand-button,
  button.font-picker-close-button {
    margin: 0;
    padding: 0;
    border: 0 !important;
    border-radius: 100% !important;
    width: calc(1.5rem * 0.85);
    min-width: calc(1.5rem * 0.85);
    max-width: calc(1.5rem * 0.85);
    height: calc(1.5rem * 0.85);
    min-height: calc(1.5rem * 0.85);
    max-height: calc(1.5rem * 0.85);
    background-color: transparent;
    cursor: pointer;
    display: inline-flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: center;
    align-content: center;
    align-items: center;
    font-size: calc(1rem / 0.85) !important;
  }

  button.font-picker-collapse-button:hover,
  button.font-picker-expand-button:hover {
    color: hsl(202.5deg, 100%, 75%) !important;
  }
  
  button.font-picker-close-button:hover {
    color: red !important;
  }
`

// -----------------------------------------------------------------------------
// HTML
// -----------------------------------------------------------------------------

const template = /* html */ `
  <div
    :class="{ 'is-expanded': isExpanded }"
    class="font-picker-collapsible-box">
    <div
      @click="$emit(isExpanded ? 'collapse' : 'expand')"
      class="font-picker-collapsible-box-header">
      <div>
        {{ title }}
      </div>

      <div class="font-picker-collapsible-box-header-button-container">
        <button
          :class="{
            'font-picker-collapse-button': isExpanded,
            'font-picker-expand-button': !isExpanded
          }"
          @click.stop="$emit(isExpanded ? 'collapse' : 'expand')">
          {{ isExpanded ? "−" : "+" }}
        </button>

        <button @click.stop="$emit('close')" class="font-picker-close-button">
          ✕
        </button>
      </div>
    </div>

    <div class="font-picker-collapsible-box-body">
      <slot></slot>
    </div>
  </div>
`

// -----------------------------------------------------------------------------
// JS
// -----------------------------------------------------------------------------

const createVueComponentWithCSS = require("@jrc03c/vue-component-with-css")

module.exports = createVueComponentWithCSS({
  name: "x-collapsible-box",
  emits: ["expand", "collapse"],
  template,

  props: {
    "is-expanded": {
      type: Boolean,
      required: true,
      default: () => false,
    },

    title: {
      type: String,
      required: true,
      default: () => "Collapsible Box",
    },
  },

  data() {
    return {
      css,
    }
  },
})

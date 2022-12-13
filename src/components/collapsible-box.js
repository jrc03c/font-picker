const createVueComponentWithCSS = require("vue-component-with-css")

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
  }

  .font-picker-collapsible-box.is-expanded >
  .font-picker-collapsible-box-header {
    border-radius: 4px 4px 0 0;
  }

  .font-picker-collapsible-box-body {
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    transition:
      max-height 0.15s ease-in-out,
      padding 0.15s ease-in-out,
      opacity 0.15s ease-in-out;
  }

  .font-picker-collapsible-box.is-expanded >
  .font-picker-collapsible-box-body {
    max-height: 100vh;
    overflow: auto;
    opacity: 1;
    transition:
      max-height 0.15s ease-in-out,
      padding 0.15s ease-in-out,
      opacity 0.15s ease-in-out;
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

const template = /* html */ `
  <div
    class="font-picker-collapsible-box"
    :class="{'is-expanded': isExpanded}">
    <div
      class="font-picker-collapsible-box-header"
      @click="toggleIsExpanded">
      <div>
        {{ title }}
      </div>

      <div>
        <button
          :class="{'font-picker-collapse-button': isExpanded, 'font-picker-expand-button': !isExpanded}"
          @click.stop="toggleIsExpanded">
          {{ isExpanded ? "−" : "+" }}
        </button>

        <button class="font-picker-close-button" @click.stop="$emit('close')">
          ✕
        </button>
      </div>
    </div>

    <div class="font-picker-collapsible-box-body">
      <slot></slot>
    </div>
  </div>
`

module.exports = createVueComponentWithCSS({
  emits: ["expand", "collapse"],

  props: {
    title: {
      type: String,
      required: true,
      default: () => "Collapsible Box",
    },
  },

  template,

  data() {
    return {
      isExpanded: true,
      css,
    }
  },

  methods: {
    toggleIsExpanded() {
      const self = this
      self.isExpanded = !self.isExpanded
      self.$emit(self.isExpanded ? "expand" : "collapse")
    },
  },

  mounted() {
    const self = this
    self.$emit("collapse")
    self.isExpanded = false
  },
})

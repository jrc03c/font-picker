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
        (control buttons)
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
})

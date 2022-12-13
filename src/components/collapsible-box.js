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
  }

  .font-picker-collapsible-box.is-expanded
  .font-picker-collapsible-box-header {
    border-radius: 4px 4px 0 0;
  }

  .font-picker-collapsible-box-body {
    padding: 0 1.5rem;
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    transition:
      max-height 0.15s ease-in-out,
      padding 0.15s ease-in-out,
      opacity 0.15s ease-in-out;
  }

  .font-picker-collapsible-box.is-expanded
  .font-picker-collapsible-box-body {
    padding: 1.5rem;
    max-height: 285px;
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
    :class="computedClasses">
    <div
      class="font-picker-collapsible-box-header"
      @click="isExpanded = !isExpanded">
      <div>
        {{ title }}
      </div>

      <div>

      </div>
    </div>

    <div class="font-picker-collapsible-box-body">
      <slot></slot>
    </div>
  </div>
`

module.exports = createVueComponentWithCSS({
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

  computed: {
    computedClasses() {
      const self = this

      const out = {
        "is-expanded": self.isExpanded,
      }

      return out
    },
  },
})

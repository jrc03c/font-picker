module.exports = /* css */ `
  #font-picker-container *,
  #font-picker-container button,
  #font-picker-container input,
  #font-picker-container select,
  #font-picker-container option {
    font-family: monospace !important;
    font-size: 0.85rem !important;
    border-radius: 4px;
  }

  #font-picker-container button,
  #font-picker-container input,
  #font-picker-container select,
  #font-picker-container option {
    border: 2px solid gray;
    padding: 0.375rem;
  }

  #font-picker-container button,
  #font-picker-container select,
  #font-picker-container option {
    cursor: pointer;
  }

  #font-picker-container label {
    display: block;
    margin-bottom: 0.375rem;
  }

  #font-picker-container {
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    padding: 1.5rem;
    background-color: rgb(235, 235, 235);
    border-radius: 4px;
    box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.15);
  }

  .font-picker-fonts {
    margin-bottom: 1.5rem;
  }

  .font-picker-font {
    margin-bottom: 4px;
    padding: 1.5rem;
    border-radius: 4px;
    background-color: rgb(245, 245, 245);
    position: relative;
  }

  button.font-picker-delete-button {
    position: absolute;
    top: calc(0.375rem * 0.85);
    right: calc(0.375rem * 0.85);
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

  button.font-picker-delete-button:hover {
    color: red;
  }

  .font-picker-font-family-select-container,
  .font-picker-font-variants-select-container {
    margin-bottom: 0.75rem;
  }

  input.font-picker-font-selectors-input {
    width: 100%;
    box-sizing: border-box;
  }

  .font-picker-add-font-button-container {
    text-align: right;
  }
`

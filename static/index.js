import Model from "./model.js"
import View from "./view.js"

if (document.readyState !== 'loading') {
  const model = new Model();
  const view = new View();
  view.setModel(model)
  view.load()
} else {
  document.addEventListener("DOMContentLoader", () => {
  })
}
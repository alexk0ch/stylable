function create(root, namespace, locals, css, depth, id) {
  const dataNamespace = "data-" + namespace.toLowerCase() + "-";

  function cssStates(stateMapping) {
    return stateMapping
      ? Object.keys(stateMapping).reduce((states, key) => {
          const stateValue = stateMapping[key];

          if (
            stateValue === undefined ||
            stateValue === null ||
            stateValue === false
          ) {
            return states;
          }

          states[dataNamespace + key.toLowerCase()] = stateValue;

          return states;
        }, {})
      : {};
  }

  function get(localName) {
    return locals[localName];
  }

  function mapClasses(classNameString) {
    return classNameString
      .split(/\s+/g)
      .map(className => get(className) || className)
      .join(" ");
  }

  locals.$root = root;
  locals.$namespace = namespace;
  locals.$depth = depth;
  locals.$id = id;
  locals.$css = css;

  locals.$get = get;
  locals.$cssStates = cssStates;

  function stylable_runtime_stylesheet(className, states, props) {
    className = className ? mapClasses(className) : "";

    const base = cssStates(states);

    if (props) {
      for (const k in props) {
        if (k.match(/^data-/)) {
          base[k] = props[k];
        }
      }

      if (props.className) {
        className += " " + props.className;
      }
    }

    if (className) {
      base.className = className;
    }

    return base;
  }

  Object.setPrototypeOf(stylable_runtime_stylesheet, locals);

  return stylable_runtime_stylesheet;
}

function createTheme(css, depth, id) {
  return { $css: css, $depth: depth, $id: id };
}

exports.create = create;
exports.createTheme = createTheme;

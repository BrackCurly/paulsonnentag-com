const clickHandlers = []

addEvent('click', clickHandlers)

function addEvent (name, handlers) {
  document.addEventListener(name, (event) => {

    for (const handler of handlers) {

      let target = event.target

      if (!isRootOf(target, handler.root)) {
        continue
      }

      const selectorList = handler.selectorList.slice(0)

      let context = {}
      let selector = selectorList.pop()

      do {

        if (matchesSelector(target, selector)) {
          context[toCamelCase(selector.classes[0])] = new Selection(null, target)

          selector = selectorList.pop()

          if (!selector) {
            handler.callback(context)
            break
          }
        }

        target = target.parentElement

      } while (target)
    }
  })
}

function matchesSelector (element, selector) {
  return (
    selector.classes.every((className) => element.classList.contains(className))
  )
}

function isRootOf (element, root) {
  if (root === document) {
    return true
  }

  let current = element

  while (current) {
    console.log(current, root)

    if (root === current) {
      return true
    }
    current = current.parentElement
  }

  return false
}

class Selection {

  constructor (cssSelector, root = document) {
    this._cssSelector = cssSelector
    this._selectorList = parseCssSelector(cssSelector)

    this._root = root
  }

  $ (cssSelector) {
    const fullCssSelector = (
      this._cssSelector
        ?  this._cssSelector + cssSelector
        : cssSelector
    )

    return new Selection(fullCssSelector, this._root)
  }

  forEach (fn) {
    if (this._selectorList.length === 0) {
      fn(this._root)
      return this;
    }

    const elements = this._root.querySelectorAll(this._cssSelector)

    for (let element of elements) {
      fn(element)
    }
    return this
  }

  first () {
    if (this._selectorList.length === 0) {
      return this._root;
    }

    return this._root.querySelector(this._cssSelector)
  }

  removeClass (className) {
    return this.forEach((element) => element.classList.remove(className))
  }

  addClass (className) {
    return this.forEach((element) => element.classList.add(className))
  }

  onClick (selectorString, callback) {
    if (!callback) {
      callback = selectorString
      clickHandlers.push({
        root: this._root,
        selectorList: this._selectorList,
        callback
      })
      return
    }

    clickHandlers.push({
      root: this._root,
      selectorList: this._selectorList.concat(parseCssSelector(selectorString)),
      callback
    })

    return this
  }

  setHtml (value) {
    if (value instanceof Selection) {
      this.forEach((element) => {
        element.innerText = ''

        value.forEach((child) => {
          element.innerHTML += child.innerHTML
        })
      })
      return this
    }

    const stringValue = value.toString()
    return this.forEach((element) => element.innerHTML = stringValue)
  }

  setData (key, value) {
    return this.forEach((element) => element.dataset.set)
  }

  getData (key) {
    const element = this.first()

    if (!element) {
      return null
    }

    return element.dataset[key]
  }

  getStyle (key) {
    const element = this.first()

    if (!element) {
      return null
    }

    return element.style[key]
  }
}

export function $ (cssSelector) {
  return new Selection(cssSelector)
}

function parseCssSelector (cssSelector) {
  if (!cssSelector) {
    return []
  }

  return (
    cssSelector
      .split(' ')
      .map((part) => {
        const [, ...classes] = part.split('.')
        return { classes }
      })
  )
}

function toCamelCase (string) {
  return string.replace(/-./g, string => string[1].toUpperCase())
}
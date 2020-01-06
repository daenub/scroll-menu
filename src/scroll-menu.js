const ANCHOR_REGEX = /^#.*$/

export class ScrollMenu {
  constructor({links, offsetMediaQueries = []}) {
    this.intersectionObserver = null
    this.scrollOffset = 0
    this.rootMargin = "0px 0px 0px 0px"

    this.elements = links.reduce((acc, link) => {
      const targetSelector = this._getKeyFromLink(link)

      if (this._testAnchorString(targetSelector)) {
        acc[targetSelector] = {
          link,
          target: document.querySelector(targetSelector),
        }
      }

      return acc
    }, {})

    this.offsetMediaQueries = offsetMediaQueries.map(omq => {
      const mql = window.matchMedia(omq.mediaQuery)
      mql.addListener(this._offsetMediaQueryListener)

      return {
        ...omq,
        mql,
      }
    })

    this._determineOffset()
    this._connectIntersectionObserver()
    this._addEventListeners()
  }

  _getKeyFromLink(link) {
    return link.getAttribute("href")
  }

  _getKeyFromTarget(target) {
    return "#" + target.id
  }

  _testAnchorString(value) {
    return ANCHOR_REGEX.test(value)
  }

  _connectIntersectionObserver() {
    this.intersectionObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          this._updateLinkState(
            this.elements[this._getKeyFromTarget(entry.target)],
            entry.isIntersecting && entry.intersectionRatio >= 0.5
          )
        })
      }, {
        rootMargin: this.rootMargin,
        threshold: [0, 0.5, 1],
      }
    )
  }

  _disconnectIntersectionObserver() {
    this.intersectionObserver.disconnect()
    delete this.intersectionObserver
  }

  _resetIntersectionObserver() {
    this._disconnectIntersectionObserver()
    this._connectIntersectionObserver()

    for (let key in this.elements) {
      this.intersectionObserver.observe(this.elements[key].target)
    }
  }

  _addEventListeners() {
    for (let key in this.elements) {
      this.elements[key].link.addEventListener("click", this._linkClickHandler)

      this.intersectionObserver.observe(this.elements[key].target)
    }
  }

  _linkClickHandler = e => {
    e.preventDefault()
    this._revealTarget(this.elements[this._getKeyFromLink(e.currentTarget)])
  }

  _offsetMediaQueryListener = () => {
    this._determineOffset()
    this._resetIntersectionObserver()
  }

  _determineOffset = () => {
    if (this.offsetMediaQueries.length === 0) return

    let hasMatched = false
    this.offsetMediaQueries.forEach(mq => {
      if (!hasMatched && mq.mql.matches) {
        hasMatched = true
        this.scrollOffset = mq.scrollOffset
        this.rootMargin = mq.rootMargin
      }
    })
  }

  _revealTarget(element) {
    const bodyTopOffset = document.body.getBoundingClientRect().top
    const targetTopOffset = element.target.getBoundingClientRect().top

    window.scrollTo({
      top: targetTopOffset - bodyTopOffset + this.scrollOffset,
      behavior: "smooth"
    })
  }

  _updateLinkState(element, active) {
    element.link.dataset.active = active
  }

  destroy() {
    this._disconnectIntersectionObserver()

    for (let key in this.elements) {
      this.elements[key].link.removeEventListener("click", this._linkClickHandler)
    }
  }
}

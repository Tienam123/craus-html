class DynamicAdapt {
  constructor() {
    this.type = "min";
    this.objects = [];
    this.daClassName = '_dynamic_adapt_';
    this.mediaQueries = [];
    this.nodes = document.querySelectorAll('[data-da]');
  }

  init() {
    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];
      const _this = this;
      const data = node.dataset.da.trim();
      const dataArray = data.split(',');
     const range = dataArray[4] ? dataArray[4]: this.type
      this.type = range;
      const object = {
        element: node,
        parent: node.parentNode,
        destination: document.querySelector('.' + dataArray[0].trim()),
        breakpoint: dataArray[1]
                    ? dataArray[1].trim()
                    : '767',
        place: dataArray[2]
               ? dataArray[2].trim()
               : 'last',
      };
      object.index = this.indexInParent(object.parent, object.element);
      this.objects.push(object);
      this.mediaQueries = this.objects.map(item => '(' + this.type + "-width: " + item.breakpoint+ "px)," + item.breakpoint)
      this.mediaQueries = this.mediaQueries.filter((item,index,self) => self.indexOf(item) === index)

      for (let i = 0; i < this.mediaQueries.length; i++) {
        const media = this.mediaQueries[i];
        const mediaSplit = media.split(',');
        const matchMedia = window.matchMedia(mediaSplit[0]);
        const mediaBreakPoint = mediaSplit[1];
        const objectsFilter = this.objects.filter(item => item.breakpoint === mediaBreakPoint);
        //TODO MEdia;
        matchMedia.addEventListener("change",() => {
          _this.mediaHandler(matchMedia,objectsFilter)
        })
        this.mediaHandler(matchMedia,objectsFilter)
      }
    }
    this.arraySort(this.objects);

  }

  mediaHandler(matchMedia,objects) {
    if (matchMedia.matches) {
      for (let i = 0; i < objects.length; i++) {
        const newObject = objects[i];
        newObject.index = this.indexInParent(newObject.parent,newObject.element);
        this.moveTo(newObject.place, newObject.element, newObject.destination);
      }
    } else  {
      for (let i = objects.length - 1; i >= 0; i--) {
        const newObject = objects[i];
        if (newObject.element.classList.contains(this.daClassName)) {
          this.moveBack(newObject.parent,newObject.element,newObject.index);
        }
      }
    }
  }

  moveTo(place,element,destination) {
    element.classList.add(this.daClassName);
    if (place === 'last' || place >= destination.children.length) {
      destination.insertAdjacentElement('beforeend',element);
      return;
    }
    if (place === 'first') {
      destination.insertAdjacentElement('afterbegin', element);
      return;
    }
    destination.children[place].insertAdjacentElement("beforebegin",element)
  }

  moveBack(parent,element,index) {
    element.classList.remove(this.daClassName);
    if (typeof parent.children[index] !== 'undefined') {
      parent.children[index].insertAdjacentElement("beforebegin",element);
    } else {
      parent.insertAdjacentElement('beforeend', element);
    }
  }

  indexInParent(parent, element) {

    const array = [...parent.children];
    return array.indexOf(element);
  }

  arraySort(arr) {
    if (this.type === 'min') {
      arr.sort((a, b) => {

      });
    } else {
      arr.sort((a, b) => {
        if (a.breakpoint === b.breakpoint) {
          if (a.place === b.place) return 0;
          if (a.place === 'first' || b.place === 'last') return 1;
          if (a.place === 'last' || b.place === 'first') return -1;
          return b.place - a.place;
        }
        return b.breakpoint - a.breakpoint;
      });
      return;
    }
  }

}

const da = new DynamicAdapt();
da.init();
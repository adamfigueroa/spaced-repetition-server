class _Node {
  constructor(value, next) {
    this.value = value;
    this.next = next;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }

  insertFirst(item) {
    this.head = new _Node(item, this.head);
  }

  insertLast(item) {
    if (this.head === null) {
      this.insertFirst(item);
    } else {
      let tempNode = this.head;
      while (tempNode.next !== null) {
        tempNode = tempNode.next;
      }
      tempNode.next = new _Node(item, null);
    }
  }

  insertBefore(item, value) {
    let currNode = this.head;

    if (!currNode) {
      return null;
    }

    if (currNode === value) {
      this.insertFirst(item);
      return;
    }

    while ((currNode.next.value !== value) & (currNode.next.next !== null)) {
      currNode = currNode.next;
    }

    if (currNode.next.value === value) {
      let nodeHolder = new _Node(item, currNode.next);
      currNode.next = nodeHolder;
    } else {
      console.log('Before item not found');
      return;
    }
  }

  insertAfter(item, value) {
    let currNode = this.head;

    if (!currNode) {
      return null;
    }

    while ((currNode.value !== value) & (currNode.next !== null)) {
      currNode = currNode.next;
    }

    if (currNode.value === value && currNode.next === null) {
      this.insertLast(item);
      return;
    }

    if (currNode.value === value) {
      let nodeHolder = new _Node(item, currNode.next);
      currNode.next = nodeHolder;
    } else {
      console.log('After item not found');
      return;
    }
  }

  insertAt(index, item) {
    if (!this.head) {
      console.log('Indexed item not found');
      return;
    }

    if (index === 0) {
      this.insertFirst(item);
      return;
    }

    let count = 0;
    let currNode = this.head;

    while (count !== index && currNode.next !== null) {
      currNode = currNode.next;
      count++;
    }

    if (count === index) {
      this.insertBefore(item, currNode.value);
      return;
    } else {
      console.log('Indexed item not found');
      return;
    }
  }

  find(item) {
    let currNode = this.head;
    if (!this.head) {
      return null;
    }
    while (currNode.value !== item) {
      if (currNode.next === null) {
        return null;
      } else {
        currNode = currNode.next;
      }
    }
    return currNode;
  }

  remove(item) {
    if (!this.head) {
      return null;
    }
    if (this.head.value === item) {
      this.head = this.head.next;
      return;
    }
    let currNode = this.head;
    let previousNode = this.head;

    while (currNode !== null && currNode.value !== item) {
      previousNode = currNode;
      currNode = currNode.next;
    }
    if (currNode === null) {
      console.log('Remove failed, Item not found');
      return;
    }
    previousNode.next = currNode.next;
  }

  moveHead(level) {
    let head = this.head;
    this.head = this.head.next;
    this.insertAt(level, head.value);
  }

  listNodes() {
    let node = this.head;
    const arr = [];
    while (node) {
      arr.push(node);
      node = node.next;
    }
    return arr;
  }

  map(callback) {
    let node = this.head;
    let arr = [];
    while (node) {
      arr.push(callback(node));
      node = node.next;
    }
    return arr;
  }

  forEach(cb) {
    let node = this.head;
    const arr = [];
    while (node) {
      arr.push(cb(node));
      node = node.next;
    }
    return arr;
  }
}

module.exports = LinkedList;

class TreeNode {
  type: string;
  adj: Array<TreeNode>;
  constructor(type: string) {
    this.type = type;
    this.adj = [];
  }

  addNode(node: TreeNode) {
    this.adj.push(node);
  }
}

class Tree {
  head: TreeNode;
  visited: Map<TreeNode, boolean>;
  euler: Array<number>;
  first: Array<TreeNode>;
  meausreMap: Map<string, number>;

  constructor(head: TreeNode) {
    this.head = head;
    this.visited = new Map();
    this.euler = new Array();
    this.first = new Array();
    this.meausreMap = new Map();
  }

  traverse(current: TreeNode, h: number) {
    if (this.head === null) return;
    this.visited.set(this.head, true);
    this.first.push(current);
    this.euler.push(h);
    for (let v of current.adj) {
      if (this.visited.get(v) === true) continue;
      this.traverse(v, h + 1);
      this.first.push(current);
      this.euler.push(h);
    }
  }

  getLCA(from: TreeNode, to: TreeNode): TreeNode {
    this.traverse(this.head, 0);
    let getFromIdx = this.first.indexOf(from);
    let getToIdx = this.first.indexOf(to);
    let minHeight = 1e5;
    let lcaNode: TreeNode = this.first[Math.min(getFromIdx, getToIdx)];
    for (
      let i = Math.min(getFromIdx, getToIdx);
      i < Math.max(getFromIdx, getToIdx);
      i++
    ) {
      if (this.euler[i] < minHeight) {
        lcaNode = this.first[i];
        minHeight = this.euler[i];
      }
    }
    return lcaNode;
  }

  getMeasureValue(start: TreeNode, target: TreeNode, measure: number): number {
    this.visited.set(start, true);

    if (start.type === target.type) {
      return measure;
    }

    if (start.adj.length === 0) {
      return 0;
    }

    let res = 0;

    for (let v of start.adj) {
      if (this.visited.get(v) === true) continue;
      res += this.getMeasureValue(
        v,
        target,
        measure * (this.meausreMap.get(start.type + v.type) as number)
      );
    }
    return res;
  }

  getMeasure(lca: TreeNode, target: TreeNode): number {
    this.visited.clear();
    return this.getMeasureValue(lca, target, 1);
  }

  getConvertRate(from: TreeNode, to: TreeNode): number {
    let lca = this.getLCA(from, to);
    let fromValue = this.getMeasure(lca, from);
    let toValue = this.getMeasure(lca, to);
    return fromValue / toValue;
  }
}

const m = new TreeNode("m");
const dm = new TreeNode("dm");
const cm = new TreeNode("cm");
const mm = new TreeNode("mm");
const ft = new TreeNode("ft");
const inch = new TreeNode("in");
m.addNode(dm);
dm.addNode(cm);
cm.addNode(mm);
m.addNode(ft);
ft.addNode(inch);

const tree = new Tree(m);
tree.meausreMap.set("m" + "dm", 10);
tree.meausreMap.set("dm" + "m", 10);
tree.meausreMap.set("cm" + "dc", 10);
tree.meausreMap.set("dm" + "cm", 10);
tree.meausreMap.set("cm" + "mm", 10);
tree.meausreMap.set("mm" + "cm", 10);
tree.meausreMap.set("m" + "ft", 3.28);
tree.meausreMap.set("ft" + "m", 3.28);
tree.meausreMap.set("ft" + "in", 12);
tree.meausreMap.set("in" + "ft", 12);

let rate = tree.getConvertRate(cm, inch);
console.log(5 * rate);

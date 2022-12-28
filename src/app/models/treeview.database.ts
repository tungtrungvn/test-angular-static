import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Json node data with nested structure. Each node has a filename and a value or a list of children
 */
export class TreeViewNode {
    children: TreeViewNode[] | undefined;
    nodeName: string | undefined;
    type: any;
}

@Injectable()
export class TreeViewDatabase {
    dataChange = new BehaviorSubject<TreeViewNode[]>([]);

    get data(): TreeViewNode[] { return this.dataChange.value; }

    constructor() {
    }

    // tslint:disable-next-line:adjacent-overload-signatures
    setData(dataObject: any): void {

        // Build the tree nodes from Json object. The result is a list of `FileNode` with nested
        //     file node as children.
        const data = this.buildFileTree(dataObject, 0);

        // Notify the change.
        this.dataChange.next(data);
    }

    /**
     * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
     * The return value is the list of `FileNode`.
     */
    buildFileTree(obj: any, level: number): TreeViewNode[] {
        return Object.keys(obj).reduce<TreeViewNode[]>((accumulator, key) => {
            const value = obj[key];
            const node = new TreeViewNode();
            node.nodeName = key;

            if (value != null) {
                if (typeof value === 'object') {
                    node.children = this.buildFileTree(value, level + 1);
                } else {
                    node.type = value;
                }
            }

            return accumulator.concat(node);
        }, []);
    }
}

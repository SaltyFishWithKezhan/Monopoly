export class PromisePool {
  private resolveMap = new Map<string, Function[]>();

  protected register(key: string): Promise<any> {
    return new Promise(resolve => {
      this.addResolve(key, resolve);
    });
  }

  protected resolve(key: string): void {
    let resolves = this.popResolves(key);

    for (let resolve of resolves) {
      resolve();
    }
  }

  private addResolve(key: string, resolve: Function): void {
    let array = this.resolveMap.get(key);

    if (!array) {
      array = [];
      this.resolveMap.set(key, array);
    }

    array.push(resolve);
  }

  private popResolves(key: string): Function[] {
    let array = this.resolveMap.get(key);

    if (!array) {
      return [];
    }

    this.resolveMap.set(key, []);

    return array;
  }
}

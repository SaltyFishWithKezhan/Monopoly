export class PromisePool {
  private resolveMap = new Map<string, Function[]>();
  private rejectMap = new Map<string, Function[]>();

  protected register(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.addResolve(key, resolve);
      this.addReject(key, reject);
    });
  }

  protected resolve(key: string, ...args: any[]): void {
    let resolves = this.popResolves(key);

    for (let resolve of resolves) {
      resolve(...args);
    }
  }

  protected reject(key: string, ...args: any[]): void {
    let rejects = this.popRejects(key);

    for (let reject of rejects) {
      reject(...args);
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

  private addReject(key: string, reject: Function): void {
    let array = this.rejectMap.get(key);

    if (!array) {
      array = [];
      this.rejectMap.set(key, array);
    }

    array.push(reject);
  }

  private popRejects(key: string): Function[] {
    let array = this.rejectMap.get(key);

    if (!array) {
      return [];
    }

    this.rejectMap.set(key, []);

    return array;
  }
}

export class IdManager {
  private maxId = 0;

  generate(): string {
    return `model-${++this.maxId}`;
  }
}

export const idManager = new IdManager();

/* eslint-disable class-methods-use-this */
import { LABEL_BACKGROUND, LABEL_FONT } from './constants/colors.js';

type Draggable<T> = {
  draggableItem: HTMLElement,
  dataName: string,
  dataIndex: number,
  data: T[]
}

type LocalData<T> = {
  name: string;
  data: T[]
}

export default abstract class Tab {
  protected element: HTMLElement;

  protected dataContainer: HTMLDivElement;

  protected dragStartIndex: number | null = null;

  private addButton: HTMLButtonElement;

  protected modal: HTMLDivElement = document.querySelector('.modalWrapper')! as HTMLDivElement;

  constructor(element: HTMLElement) {
    this.element = element;
    this.addButton = this.element.querySelector('.addButton')! as HTMLButtonElement;
    this.dataContainer = this.element.querySelector('.data-container') as HTMLDivElement;

    this.addButton.addEventListener('click', this.popUp.bind(this));
    this.modal.addEventListener('click', this.closeModal);

    this.setModalInputs();
    this.render();
  }

  private popUp() {
    this.modal.style.display = 'flex';
  }

  protected popDown() {
    this.modal.style.display = 'none';
    this.resetModal();
  }

  private resetModal() {
    const modalForm = this.modal.querySelector('#modalForm')! as HTMLFormElement;

    [...modalForm.elements].forEach((element) => {
      if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
        switch (element.id) {
          case 'font':
            element.value = LABEL_FONT;
            return;
          case 'background':
            element.value = LABEL_BACKGROUND;
            return;
          default:
            element.value = '';
        }
      }
    });
  }

  protected closeModal(e: MouseEvent) {
    if (e.currentTarget === e.target) {
      this.popDown();
    }
  }

  protected submitModalForm(e: SubmitEvent) {
    e.preventDefault();

    const target = e.target! as HTMLFormElement;

    const inputValues:string[] = [];

    [...target.elements].forEach((el) => {
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
        inputValues.push(el.value);
      }
    });

    this.submit(inputValues);
  }

  protected saveLocalData<T>({ name, data }: LocalData<T>) {
    localStorage.setItem(name, JSON.stringify(data));
  }

  protected loadLocalData<T>(name: string): T[] {
    return JSON.parse(localStorage.getItem(name) as string);
  }

  protected deleteLocalData(name: string) {
    localStorage.removeItem(name);
  }

  protected setDraggable<T>({
    draggableItem,
    dataName,
    dataIndex,
    data,
  }: Draggable<T>) {
    draggableItem.classList.add('draggable');
    draggableItem.setAttribute('draggable', 'true');
    draggableItem.setAttribute('data-index', dataIndex.toString());

    draggableItem.addEventListener('dragstart', ({ target }: MouseEvent) => {
      const targetElement = target as HTMLElement;
      this.dragStartIndex = parseInt(targetElement.getAttribute('data-index') as string, 10);
    });

    draggableItem.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    draggableItem.addEventListener('dragenter', ({ target }: MouseEvent) => {
      const targetElement = target as HTMLElement;
      targetElement.classList.add('over');
    });

    draggableItem.addEventListener('dragleave', ({ target }: MouseEvent) => {
      const targetElement = target as HTMLElement;
      targetElement.classList.remove('over');
    });

    draggableItem.addEventListener('drop', ({ target }: MouseEvent) => {
      const targetElement = target as HTMLElement;

      if (!targetElement.classList.contains('draggable')) {
        return;
      }

      const dragEndIndex = parseInt(targetElement.getAttribute('data-index') as string, 10);

      if (typeof this.dragStartIndex === 'number') {
        const tempData = data[this.dragStartIndex];

        data[this.dragStartIndex] = data[dragEndIndex];
        data[dragEndIndex] = tempData;

        this.saveLocalData({ name: dataName, data });

        this.render();
      }
    });
  }

  protected abstract setModalInputs(): void;

  protected abstract submit(inputValues: string[]): void;

  protected abstract render(): void;
}

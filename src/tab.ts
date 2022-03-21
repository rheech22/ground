/* eslint-disable class-methods-use-this */
import { LABEL_BACKGROUND, LABEL_FONT } from './constants/colors.js';

type Draggable<T> = {
  draggableList: HTMLElement,
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

  private addButton: HTMLButtonElement;

  private modal: HTMLDivElement = document.querySelector('.modalWrapper') as HTMLDivElement;

  private closeModalButton: HTMLButtonElement = document.getElementById('closeModal') as HTMLButtonElement;

  protected modalForm: HTMLFormElement = document.getElementById('modalForm') as HTMLFormElement;

  protected dataContainer: HTMLDivElement;

  protected handleClick: (e:SubmitEvent) => void;

  protected dragStartIndex: number | null;

  constructor(element: HTMLElement) {
    const handleCloseModal = (e: MouseEvent) => {
      if (e.currentTarget === e.target) {
        this.popDown();
      }
    };
    this.element = element;
    this.dragStartIndex = null;
    this.dataContainer = this.element.querySelector('.data-container') as HTMLDivElement;
    this.addButton = this.element.querySelector('button') as HTMLButtonElement;
    this.modal.addEventListener('click', handleCloseModal);
    this.closeModalButton.addEventListener('click', handleCloseModal);
    this.addButton.addEventListener('click', this.popUp.bind(this));

    this.handleClick = (e: SubmitEvent) => {
      e.preventDefault();
      const inputValues:string[] = [];
      if (e.target instanceof HTMLFormElement) {
        [...e.target.elements].forEach((el) => {
          if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
            inputValues.push(el.value);
          }
        });
      }
      this.submit(inputValues);
    };

    this.setModalInputs();
    this.render();
  }

  private popUp() {
    this.modal.style.display = 'flex';
  }

  protected popDown() {
    this.modal.style.display = 'none';
    [...this.modalForm.elements].forEach((element) => {
      if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
        if (element.id === 'font') {
          element.value = LABEL_FONT;
          return;
        }
        if (element.id === 'background') {
          element.value = LABEL_BACKGROUND;
          return;
        }
        element.value = '';
      }
    });
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
    draggableList,
    dataName,
    dataIndex,
    data,
  }: Draggable<T>) {
    draggableList.classList.add('draggable');
    draggableList.setAttribute('draggable', 'true');
    draggableList.setAttribute('data-index', dataIndex.toString());

    draggableList.addEventListener('dragstart', ({ target }: MouseEvent) => {
      const targetElement = target as HTMLElement;

      this.dragStartIndex = parseInt(targetElement.getAttribute('data-index') as string, 10);
    });

    draggableList.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    draggableList.addEventListener('dragenter', ({ target }: MouseEvent) => {
      const targetElement = target as HTMLElement;
      targetElement.classList.add('over');
    });

    draggableList.addEventListener('dragleave', ({ target }: MouseEvent) => {
      const targetElement = target as HTMLElement;
      targetElement.classList.remove('over');
    });

    draggableList.addEventListener('drop', ({ target }: MouseEvent) => {
      const targetElement = target as HTMLElement;

      if (!targetElement.classList.contains('draggable')) {
        return;
      }

      const dragEndIndex = parseInt(targetElement.getAttribute('data-index') as string, 10);

      if (typeof this.dragStartIndex === 'number') {
        const tempData = data[this.dragStartIndex];

        data[this.dragStartIndex] = data[dragEndIndex];
        data[dragEndIndex] = tempData;

        localStorage.setItem(dataName, JSON.stringify(data));

        this.render();
      }
    });
  }

  protected abstract setModalInputs(): void;

  protected abstract submit(inputValues: string[]): void;

  protected abstract render(): void;
}

export default abstract class Tab {
  protected element: HTMLElement;
  private addButton: HTMLButtonElement;
  private modal: HTMLDivElement = document.querySelector('.modalWrapper') as HTMLDivElement;
  private closeButton: HTMLButtonElement = document.getElementById('closeModal') as HTMLButtonElement;
  protected modalForm: HTMLFormElement = document.getElementById('modalForm') as HTMLFormElement;
  // protected submitButton: HTMLButtonElement = document.getElementById('submit') as HTMLButtonElement;
  // protected firstInput: HTMLInputElement = document.getElementById('modalInput1') as HTMLInputElement;
  // protected secondInput: HTMLInputElement = document.getElementById('modalInput2') as HTMLInputElement;
  protected dataContainer: HTMLDivElement;
  protected handleClick: (e:SubmitEvent) => void;

  constructor(element: HTMLElement){
    this.element = element;
    this.dataContainer = this.element.querySelector('.data-container') as HTMLDivElement;
    this.addButton = this.element.querySelector('button') as HTMLButtonElement;
    this.closeButton.addEventListener('click', this.popDown.bind(this));
    this.addButton.addEventListener('click', this.popUp.bind(this));
    this.handleClick = (e: SubmitEvent) => {
      e.preventDefault();
      let inputValues:string[] = [];
      if(e.target instanceof HTMLFormElement){
        [...e.target.elements].forEach(element => {
          if(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
            inputValues.push(element.value);
          }
        });
      };
      this.submit(inputValues);
    };
    this.setModalInputs();
    this.render();
  };
    
  private popUp(){
    this.modal.style.display = 'flex';
  };
  
  protected popDown(){
    // this.firstInput.value = '';
    this.modal.style.display = 'none';
  };

  protected abstract setModalInputs(): void;

  protected abstract submit(inputValues: string[]): void;

  protected abstract render(): void;
};

export default abstract class Tab<T> {
  protected element: HTMLElement;
  protected data: T[] = [];
  private button: HTMLButtonElement = document.getElementById('addCategory') as HTMLButtonElement;
  private modal: HTMLDivElement = document.querySelector('.modalWrapper') as HTMLDivElement;
  private closeButton: HTMLButtonElement = document.getElementById('closeModal') as HTMLButtonElement;
  private submitButton: HTMLButtonElement = document.getElementById('submit') as HTMLButtonElement;
  protected firstInput: HTMLInputElement = document.getElementById('modalInput1') as HTMLInputElement;
  protected secondInput: HTMLInputElement = document.getElementById('modalInput2') as HTMLInputElement;
  protected dataContainer: HTMLDivElement = document.createElement('div') as HTMLDivElement;

  constructor(element: HTMLElement){
    this.element = element;
    this.button.addEventListener('click', this.popUp.bind(this));
    this.closeButton.addEventListener('click', this.popDown.bind(this));
    this.submitButton.addEventListener('click', this.submit.bind(this));
    this.setModalInputs();
    this.render();
  };
  
  private popUp(){
    this.modal.style.display = 'flex';
  };
  
  private popDown(){
    this.firstInput.value = '';
    this.modal.style.display = 'none';
  };  
  
  private submit(){
    if(!this.firstInput.value) return;
    this.setData();
    this.popDown();
    this.render();
  };

  protected abstract setModalInputs(): void;
  
  protected abstract setData(): void;

  protected abstract render(): void;
};

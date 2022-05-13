import { ActionComponent } from "../action-component";

enum KeyState {
  NONE,   // Nothing happened this frame
  DOWN,   // Key was
  UP,   //
  PRESSED //
};

export class InputComponent extends ActionComponent {

  private rawKeys: Map<string, KeyState> = new Map();
  keys: Map<string, KeyState> = new Map();

  private keydownListener;
  private keyupListener;

  constructor() {
    super();

    this.keydownListener = (e: KeyboardEvent) => this.rawKeyDown(e);
    this.keyupListener = (e: KeyboardEvent) => this.rawKeyUp(e);
  }

  onAwake() {
    document.addEventListener('keydown', this.keydownListener);
    document.addEventListener('keyup', this.keyupListener);
  }

  onAsleep() {
    document.removeEventListener('keydown', this.keydownListener);
    document.removeEventListener('keyup', this.keyupListener);
  }

  private rawKeyDown(keyEvent: KeyboardEvent) {
    // this.rawKeys.set(keyEvent.code, KeyState.DOWN);
    this.keys.set(keyEvent.code, KeyState.DOWN);

  }

  update() {
    // console.log(this.keys)
  }

  private rawKeyUp(keyEvent: KeyboardEvent) {
    // this.rawKeys.set(keyEvent.code, KeyState.DOWN);
    this.keys.set(keyEvent.code, KeyState.UP);
  }

  // preUpdate(_dt: number) {
  //   this.rawKeys.forEach((state: KeyState, key: string) => {
  //     // copy over state



  //     // then clear raw key state
  //     this.rawKeys.set(key, KeyState.NONE);
  //   });
  // }

  keyUp(key: string): boolean {
    return this.keys.get(key) === KeyState.UP;
  }

  keyDown(key: string): boolean {
    return this.keys.get(key) === KeyState.DOWN;
  }


}

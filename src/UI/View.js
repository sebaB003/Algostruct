/** */
export class View {
  /** */
  constructor(editor, logsView, outputView, watchesView) {
    this.editor = editor;
    this.logsView = logsView;
    this.outputView = outputView;
    this.watchesView = watchesView;
  }

  /** */
  setView(viewID) {
    switch (viewID) {
      case 0:
        this._setDefaultView();
        break;
      case 1:
        this._setExecutionView();
        break;
      case 2:
        this._setEditorView();
        break;
      case 3:
        this._setAllToolsView();
        break;
      case 4:
        this._setDebugView();
        break;
    }
  }

  /**
     * Display the default view
     * Editor  - open
     * Logs    - open
     * Outputs - open
     * Watches - close
    */
  _setDefaultView() {
    this.editor.setOpen();
    this.logsView.setOpen();
    this.outputView.setOpen();
    this.watchesView.setClose();
  }

  /**
   * Display the execution view
   * Editor  - close
   * Logs    - close
   * Outputs - open
   * Watches - close
  */
  _setExecutionView() {
    this.editor.setClose();
    this.logsView.setClose();
    this.outputView.setOpen();
    this.watchesView.setClose();
  }

  /**
   * Display the editor view
   * Editor  - open
   * Logs    - close
   * Outputs - close
   * Watches - close
  */
  _setEditorView() {
    this.editor.setOpen();
    this.logsView.setClose();
    this.outputView.setClose();
    this.watchesView.setClose();
  }

  /**
   * Display all the tools
   * Editor  - open
   * Logs    - open
   * Outputs - open
   * Watches - open
  */
  _setAllToolsView() {
    this.editor.setOpen();
    this.logsView.setOpen();
    this.outputView.setOpen();
    this.watchesView.setOpen();
  }

  /**
   * Display the debug view
   * Editor  - close
   * Logs    - open
   * Outputs - open
   * Watches - open
  */
  _setDebugView() {
    this.editor.setClose();
    this.logsView.setOpen();
    this.outputView.setOpen();
    this.watchesView.setOpen();
  }
}

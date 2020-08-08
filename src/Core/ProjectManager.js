import {Flowchart} from "./Flowchart";
import {downloadJSON} from "./Utils/FileActions";

/** */
export class ProjectManager {
  /** */
  constructor() {
    this.project;
  }

  /**
   * Create a new project
   * @param {*} screen
   * @param {string} title: the title of the project
   */
  newProject(screen, title='Untitled') {
    this.project = new Project();
    this.setProjectTitle(title);
    this.project.flowchart.init(screen.getWidth() / 3);
    this.project.flowchart.reorder();
  }

  /**
   * Sets the project title
   * @param {*} title: the title of the project
   */
  setProjectTitle(title) {
    this.project.title = title;
  }


  /**
   * Save the whole project settings and flowchart as a json file
   * File structure:
   * {
   *   title: '',
   *   preferences: {},
   *   flowchart: {
   *     startBlock: undefined,
   *     endBlock: undefined,
   *     blocks: {},
   *     commentes: {},
   *   }
   * }
   */
  saveProject() {
    const file = {
      title: this.project.title,
      preferences: this.project.preferences,
      flowchart: {
        _startBlockID: this.project.flowchart._startBlockID,
        _endBlockID: this.project.flowchart._endBlockID,
        blocks: [],
        comments: [],
      },
    };

    for (const block of this.project.flowchart.memory) {
      if (block) {
        const newBlock = Object.assign({}, {...block});
        newBlock.memoryReference = undefined;
        file.flowchart.blocks.push(newBlock);
      }
    }

    for (const comment of this.project.flowchart.comments) {
      if (comment) {
        const newComment= Object.assign({}, {...comment});
        newComment.memoryReference = undefined;
        file.flowchart.comments.push(newComment);
      }
    }

    const jsonFile = JSON.stringify(file);


    downloadJSON(jsonFile, file.title);
  }
}

/** */
function Project() {
  this.title = 'Untitled';
  this.preferences = {
    showComments: true,
    singleMove: false,
    view: 0,
  },
  this.flowchart = new Flowchart();
}

import { Component, OnInit, Input, NgZone } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { EditorService } from "../services/editor.service";
import { MessageService } from "../services/message.service";

declare const monaco: any;

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  editor: any;
  editorTextModel: any;
  selectedLang: string;
  languageForm = new FormGroup({
    language: new FormControl("cpp", Validators.compose([Validators.required])),
  });

  constructor(
    public editorService: EditorService,
    private messageService: MessageService,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.selectedLang = "cpp";
  }

  @Input() languages = [
    { name: "C++", value: "cpp" },
    { name: "C#", value: "csharp" },
    { name: "Java", value: "java" },
    { name: "Python", value: "python" },
    { name: "JavaScript", value: "javascript" },
  ];

  editorOptions = { theme: "vs-dark", language: "cpp" };
  code: string = 'function x() {\nconsole.log("Hello world!");\n}';

  onLanguageChange(res) {
    this.selectedLang = res.slice(res.indexOf(":") + 2);
    console.log(this.selectedLang);

    if (this.selectedLang == "cpp") {
      this.editorOptions = Object.assign({}, this.editorOptions, {
        language: "cpp",
      });
    } else if (this.selectedLang == "javascript") {
      this.editorOptions = Object.assign({}, this.editorOptions, {
        language: "javascript",
      });
    } else if (this.selectedLang == "csharp") {
      this.editorOptions = Object.assign({}, this.editorOptions, {
        language: "csharp",
      });
    } else if (this.selectedLang == "java") {
      this.editorOptions = Object.assign({}, this.editorOptions, {
        language: "java",
      });
    } else if (this.selectedLang == "python") {
      this.editorOptions = Object.assign({}, this.editorOptions, {
        language: "python",
      });
    }
  }

  onInitHandler(event: any) {
    this.editor = event;
    this.editorTextModel = this.editor.getModel();
    this.editorTextModel.setEOL(0); // Set EOL from '\r\n' -> '\n'

    this.editor.onDidPaste((e: any) => this.onDidPasteHandler(e));
    this.editor.onDidChangeModelContent((e: any) =>
      this.onDidChangeModelContentHandler(e)
    );

    this.editorService.executeInsert(
      this.editorTextModel,
      "Hello World!",
      1,
      1,
      1,
      1
    );
  }

  onDidPasteHandler(event: any) {
    const rangeDetails = event;
    console.log("Pasted range" + rangeDetails);
    console.log(rangeDetails);
  }

  onDidChangeModelContentHandler(event: any): void {
    const change = event.changes[0];

    // The range that got replaced
    const rangeDetails = change.range;
    console.log("Range Details: " + rangeDetails);
    console.log(rangeDetails);

    // Length of the range that got replaced
    const rangeLen = change.rangeLength;
    console.log("Range Length: " + rangeLen);

    // The new text for the range (! \n can't see)
    const newText = change.text;
    console.log("New text: |" + newText + "|");

    console.log(
      "Index: " +
        this.editorService.posToIndex(
          this.editorTextModel,
          rangeDetails.endLineNumber,
          rangeDetails.endColumn
        )
    );
  }

  subscribeToSignalrEvents(): void {}
}

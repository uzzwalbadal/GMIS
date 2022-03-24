import { Component, OnInit, Injector, Optional, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/app-component-base';
import { FileuploadService } from './fileupload.service';

@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.css']
})
export class DocumentUploadComponent extends AppComponentBase implements OnInit {

  profileForm: FormGroup;
  error: string;

  fileUpload = { status: '', message: '', filePath: '' };

  constructor(
    private fb: FormBuilder,
    private fileUploadService: FileuploadService,
    injector: Injector,
    private _dialogRef: MatDialogRef<DocumentUploadComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private _docType: number
  ) {
    super(injector);
  }

  DocType:number=0;
  ngOnInit() {
    this.DocType = this._docType;
    this.profileForm = this.fb.group({
      name: ['',[Validators.required, Validators.minLength(2)]],
      profile: ['']
    });
    this.saving = false;
    this.isFileSelected = false;
  }

  isFileSelected:boolean=false;
  onSelectedFile(event) {
    // console.log(event.target.files);

    if (event.target.files.length > 0) {
      this.isFileSelected = true;
      const file = event.target.files[0];
      this.profileForm.get('profile').setValue(file);
    }
  }

  saving:boolean= false;

  onSubmit() {
    this.saving = true;
    console.log("submit button pressed");

    const formData = new FormData();
    formData.append('Displayname', this.profileForm.get('name').value);
    formData.append('profile', this.profileForm.get('profile').value);
    formData.append('ProjectId', sessionStorage.getItem("projectId"));
    formData.append('DocType', this.DocType.toString());
    console.log(formData);

    this.fileUploadService.upload(formData)
      .subscribe((res) => {
        this.fileUpload = res
        console.log(res);
        if (res.success) {
          abp.notify.info(this.l('SavedSuccessfully'));
          this._dialogRef.close(true);
          // this.close(true);
        }
      },
        (err) => {
          this.error = err,
          console.log("Error in fileupload ",this.error);
            abp.notify.error("Error Please report");
          // this.close(true);
          this._dialogRef.close(true);

        }
      );
  }

}

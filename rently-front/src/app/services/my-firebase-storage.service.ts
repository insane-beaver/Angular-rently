import { Injectable } from '@angular/core';
import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class MyFirebaseStorageService {

  constructor() { }
  private imagePath!: string;

  async saveImage(image: File) {
    var storageRef = firebase.storage().ref();
    var uploadTask = storageRef.child("images/"+image.name).put(image);

    uploadTask.on('state_changed', (snapshot) => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED:
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING:
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log('File available at', downloadURL);
          this.imagePath = downloadURL;
        });
      });
  }

  async saveNgetImagePath(image: File) {
    this.saveImage(image).then(() => {
      return this.imagePath;
    });
  }
}

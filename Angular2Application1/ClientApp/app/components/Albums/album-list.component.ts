import { Component, OnInit } from '@angular/core';
import { AlbumsService } from '../services/albums.service';
import { Album } from '../Albums/album';

@Component({
  selector: 'album-list',
  template: require('album-list.component.html'),
  styles: [require('album-list.component.css')],
 
})
export class AlbumListComponent implements OnInit {

  _albums: Album[];
  selectedAlbum: Album;

  constructor(private albumService: AlbumsService) {
    var albums = this.albumService.getAlbums();
  }

  ngOnInit() {
  }

  onSelect(album: Album) { this.selectedAlbum = album; }

}

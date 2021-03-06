﻿using System;
using System.ComponentModel.DataAnnotations;

namespace Angular2Application1.ViewModels
{
    public class CreateAlbumViewModel
    {
        [Required(ErrorMessage = "You must provide a Title for the album")]
        [MaxLength(50, ErrorMessage = "The maximum length for an album title is 50 characters.")]
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime DateCreated { get; set; } = DateTime.UtcNow;
        public string SafeName { get; set; }
    }
}

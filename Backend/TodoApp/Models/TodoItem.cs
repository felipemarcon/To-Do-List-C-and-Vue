using System.ComponentModel.DataAnnotations;

namespace TodoApp.Models
{
    public class TodoItem
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(500)]
        public string Descricao { get; set; } = string.Empty;
        
        public DateTime DataCriacao { get; set; } = DateTime.Now;
        
        public DateTime? DataConclusao { get; set; }
        
        public bool Concluida { get; set; } = false;
    }
}

import axios from 'axios'

const API_URL = 'http://localhost:5248/api/todo'

export default {
  name: 'App',
  data() {
    return {
      tarefas: [],
      novaTarefa: '',
      filtroAtivo: 'todas'
    }
  },
  computed: {
    tarefasFiltradas() {
      switch(this.filtroAtivo) {
        case 'pendentes':
          return this.tarefasPendentes
        case 'concluidas':
          return this.tarefasConcluidas
        default:
          return this.tarefas
      }
    },
    tarefasPendentes() {
      return this.tarefas.filter(t => !t.concluida)
    },
    tarefasConcluidas() {
      return this.tarefas.filter(t => t.concluida)
    },
    mensagemListaVazia() {
      switch(this.filtroAtivo) {
        case 'pendentes':
          return 'Parabéns! Nenhuma tarefa pendente.'
        case 'concluidas':
          return 'Nenhuma tarefa concluída ainda.'
        default:
          return 'Nenhuma tarefa criada ainda. Adicione uma!'
      }
    }
  },
  async mounted() {
    await this.carregarTarefas()
  },
  methods: {
    async carregarTarefas() {
      try {
        const response = await axios.get(API_URL)
        this.tarefas = response.data
      } catch (error) {
        alert('Erro ao carregar tarefas. Verifique se o backend está rodando.')
        console.error(error)
      }
    },

    async adicionarTarefa() {
      if (!this.novaTarefa.trim()) return

      try {
        const response = await axios.post(API_URL, {
          descricao: this.novaTarefa
        })
        
        this.tarefas.unshift(response.data)
        this.novaTarefa = ''
      } catch (error) {
        alert('Erro ao adicionar tarefa')
        console.error(error)
      }
    },

    async alternarConclusao(tarefa) {
      try {
        const tarefaAtualizada = {
          ...tarefa,
          concluida: !tarefa.concluida
        }

        await axios.put(`${API_URL}/${tarefa.id}`, tarefaAtualizada)
        
        tarefa.concluida = tarefaAtualizada.concluida
        if (tarefa.concluida) {
          tarefa.dataConclusao = new Date().toISOString()
        } else {
          tarefa.dataConclusao = null
        }
      } catch (error) {
        alert('Erro ao atualizar tarefa')
        console.error(error)
      }
    },

    editarTarefa(tarefa) {
      tarefa.editando = true
      this.$nextTick(() => {
        const input = this.$refs.inputEdicao?.find(el => el)
        if (input) input.focus()
      })
    },

    async salvarEdicao(tarefa) {
      if (!tarefa.descricao.trim()) {
        await this.carregarTarefas()
        return
      }

      try {
        await axios.put(`${API_URL}/${tarefa.id}`, tarefa)
        tarefa.editando = false
      } catch (error) {
        alert('Erro ao salvar edição')
        console.error(error)
      }
    },

    async excluirTarefa(id) {
      if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return

      try {
        await axios.delete(`${API_URL}/${id}`)
        this.tarefas = this.tarefas.filter(t => t.id !== id)
      } catch (error) {
        alert('Erro ao excluir tarefa')
        console.error(error)
      }
    },

    formatarData(dataString) {
      const data = new Date(dataString)
      return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }
}
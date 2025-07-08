<template>
  <div id="app">
    <div class="container">
      <h1>Lista de Tarefas</h1>
      
      <div class="form-section">
        <input 
          v-model="novaTarefa" 
          @keyup.enter="adicionarTarefa"
          placeholder="Digite uma nova tarefa..." 
          class="input-tarefa"
        />
        <button @click="adicionarTarefa" class="btn-adicionar">
          Adicionar
        </button>
      </div>

      <div class="filtros">
        <button 
          @click="filtroAtivo = 'todas'" 
          :class="{ active: filtroAtivo === 'todas' }"
          class="btn-filtro"
        >
          Todas ({{ tarefas.length }})
        </button>
        <button 
          @click="filtroAtivo = 'pendentes'" 
          :class="{ active: filtroAtivo === 'pendentes' }"
          class="btn-filtro"
        >
          Pendentes ({{ tarefasPendentes.length }})
        </button>
        <button 
          @click="filtroAtivo = 'concluidas'" 
          :class="{ active: filtroAtivo === 'concluidas' }"
          class="btn-filtro"
        >
          Concluídas ({{ tarefasConcluidas.length }})
        </button>
      </div>

      <div class="lista-tarefas">
        <div 
          v-for="tarefa in tarefasFiltradas" 
          :key="tarefa.id" 
          class="tarefa-item"
          :class="{ concluida: tarefa.concluida }"
        >
          <input 
            type="checkbox" 
            :checked="tarefa.concluida"
            @change="alternarConclusao(tarefa)"
            class="checkbox"
          />
          
          <div class="tarefa-content">
            <span v-if="!tarefa.editando" class="tarefa-texto">
              {{ tarefa.descricao }}
            </span>
            <input 
              v-else
              v-model="tarefa.descricao"
              @keyup.enter="salvarEdicao(tarefa)"
              @blur="salvarEdicao(tarefa)"
              class="input-edicao"
              ref="inputEdicao"
            />
            
            <div class="tarefa-info">
              <small>{{ formatarData(tarefa.dataCriacao) }}</small>
              <small v-if="tarefa.dataConclusao" class="data-conclusao">
                {{ formatarData(tarefa.dataConclusao) }}
              </small>
            </div>
          </div>

          <div class="acoes">
            <button 
              v-if="!tarefa.editando"
              @click="editarTarefa(tarefa)" 
              class="btn-editar"
              title="Editar"
            >
              ✏️
            </button>
            <button 
              @click="excluirTarefa(tarefa.id)" 
              class="btn-excluir"
              title="Excluir"
            >
              🗑️
            </button>
          </div>
        </div>

        <div v-if="tarefasFiltradas.length === 0" class="lista-vazia">
          <p>{{ mensagemListaVazia }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./components/script.js"></script>
<style src="./components/style.css"></style>
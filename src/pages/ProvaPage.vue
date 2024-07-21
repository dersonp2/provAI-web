<template>
  <q-page class="q-pl-md">
    <h5 class="text-primary text-bold">Gerador de Provas Inteligente</h5>
    <p class="text-subtitle1 text-secondary">Identificação</p>

    <div class="row q-gutter-md">
      <div class="col-12 col-md-4">
        <q-input outlined v-model="prova.professor" label="Professor" />
      </div>
      <div class="col-12 col-md-4">
        <q-input outlined v-model="prova.escola" label="Escola">
          <template v-slot:label>
            Escola <span class="text-caption">(opcional)</span>
          </template>
        </q-input>
      </div>
    </div>


    <p class="q-mt-md text-subtitle1 text-secondary">Prova</p>
    <div class="row q-gutter-md">
      <div class="col-12 col-md-4">
        <q-input outlined v-model="prova.disciplina" label="Disciplina" />
      </div>
      <div class="col-12 col-md-4">
        <q-select outlined v-model="prova.nivel" :options="niveis" label="Nível" />
      </div>
      <div class="col-12 col-md-2">
        <q-select outlined v-model="qtdQuestoes" :options="quantidade" label="Questões"
          @update:model-value="atualizarQtdeQuestoes" />
      </div>
    </div>

    <!-- Tabela -->
    <div class="q-mt-md row">
      <q-table class="col-11" :rows="prova.questoes" :columns="columns" row-key="id"
        no-data-label="Selecione a quantidade de questões" v-model:pagination="pagination" hide-pagination>
        <template v-slot:body-cell-questao="props">
          <q-td :props="props">
            {{ props.rowIndex + 1 }}
          </q-td>
        </template>
        <template v-slot:body-cell-tipo="props">
          <q-td :props="props">
            <q-select v-model="props.row.tipo" :options="tipoOpcoes" emit-value map-options
              @update:model-value="updateTipo(props.row)" />
          </q-td>
        </template>

        <template v-slot:body-cell-estilo="props">
          <q-td :props="props">
            <q-select v-model="props.row.estilo" :options="getTipoOptions(props.row.tipo)" emit-value map-options />
          </q-td>
        </template>

        <template v-slot:body-cell-quantidade="props">
          <q-td :props="props">
            <q-select v-model="props.row.quantidade" :options="alternativas" emit-value map-options />
          </q-td>
        </template>

        <template v-slot:body-cell-dificuldade="props">
          <q-td :props="props">
            <q-select v-model="props.row.dificuldade" :options="dificultadeOpcoes" emit-value map-options />
          </q-td>
        </template>

        <template v-slot:body-cell-incluiResposta="props">
          <q-td :props="props">
            <q-checkbox v-model="props.row.incluiResposta" />
          </q-td>
        </template>

        <template v-slot:body-cell-assunto="props">
          <q-td :props="props">
            <q-btn flat round :color="props.row.assunto ? 'positive' : 'primary'" icon="add"
              @click="abrirAssuntoModal(props.row)" />
          </q-td>
        </template>
      </q-table>
    </div>

    <div class="row q-mt-md q-gutter-md">
      <q-input :rows="2" v-model="prova.assunto" outlined label="Assunto/Topicos (Opcional)" type="textarea"
        class="col-4">
        <template v-slot:label>
          Assunto/Topicos <span class="text-caption">(opcional)</span>
        </template>
      </q-input>
      <q-input :rows="2" v-model="prova.observacao" outlined label="Observação/Personalizações (Opcional)"
        type="textarea" class="col-4">
        <template v-slot:label>
          Observação/Personalizações <span class="text-caption">(opcional)</span>
        </template>
      </q-input>
    </div>

    <div class="row q-mt-lg q-gutter-md">
      <q-btn color="primary" class="q-pt-md q-pb-md col-4" label="Gerar Prova" @click="verificarCamposEAbreModal" />
      <!--<q-btn outline color="primary" class="col-4" label="Salvar" />-->
    </div>

    <br />
    <br />
    <br />

    <!-- Modal Assunto -->
    <q-dialog v-model="modalAssunto" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <q-toolbar>
            <q-toolbar-title class="text-h6 text-primary">Assunto</q-toolbar-title>

            <q-btn flat round dense icon="close" v-close-popup />
          </q-toolbar>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="currentRow.assunto" autofocus @keyup.enter="modalAssunto = false" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat color="secondary" label="limpar" @click="currentRow.assunto = ''" v-close-popup />
          <q-btn flat label="Adicionar" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal Prova-->
    <ModalProva :model-value="modalProva" @update:model-value="modalProva = $event" :prova="prova" />

    <div class="q-mt-md">
      <pre>{{ jsonProva }}</pre>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { Prova, Questao } from '../model/prova';
import { niveis, quantidade, alternativas, columns, tipoOpcoes, tiposQuestoes, dificultadeOpcoes, provaGerada } from '../model/constantes';
import ModalProva from '../components/modal/modalProva.vue';

const $q = useQuasar()
let prova = ref(new Prova());
let qtdQuestoes = ref(null);
let modalAssunto = ref(false);
let modalProva = ref(false);
const currentRow = ref<any>({});
const pagination = ref({
  page: 1,
  rowsPerPage: 10
})

const abrirAssuntoModal = (row: any) => {
  currentRow.value = row;
  modalAssunto.value = true;
};


const getTipoOptions = (prova: string) => {
  if (prova === 'objetiva') {
    return tiposQuestoes.objetiva;
  } else if (prova === 'dissertativa') {
    return tiposQuestoes.dissertativa;
  }
  return [];
};

const updateTipo = (row: any) => {
  row.estilo = '';
};

const jsonProva = computed(() => JSON.stringify(prova.value, null, 2));

const atualizarQtdeQuestoes = (qtd: number) => {
  const questoesAtuais = prova.value.questoes;
  if (qtd > questoesAtuais.length) {
    const novasQuestoes = Array.from({ length: qtd - questoesAtuais.length }, () => new Questao());
    prova.value.questoes = [...questoesAtuais, ...novasQuestoes];
  } else if (qtd < questoesAtuais.length) {
    prova.value.questoes = questoesAtuais.slice(0, qtd);
  }
};

const verificarCamposEAbreModal = () => {
  if (!prova.value.professor || !prova.value.disciplina || !prova.value.nivel || prova.value.questoes.length === 0) {
    $q.notify({
      color: 'warning',
      position: 'bottom',
      message: 'Todos os campos obrigatórios devem ser preenchidos e deve haver pelo menos uma questão.',
      icon: 'report_problem',
      progress: true,
      actions: [
        { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
      ]
    });
  } else {
    modalProva.value = true;
  }
};
</script>
<template>
    <q-dialog :model-value="modelValue" @update:model-value="updateModelValue" backdrop-filter="brightness(30%)"
        :maximized="toogleMaximizar" :full-width="!toogleMaximizar" transition-show="jump-up"
        transition-hide="jump-down" persistent>
        <q-card>
            <q-card-section class="bg-primary text-white row items-center">
                <div class="text-h6">Prova Gerada</div>
                <q-space />
                <q-btn v-if="!toogleMaximizar" dense flat icon="fullscreen" @click="toogleMaximizar = true">
                    <q-tooltip class="bg-white text-primary">Maximizar</q-tooltip>
                </q-btn>
                <q-btn v-if="toogleMaximizar" dense flat icon="fullscreen_exit" @click="toogleMaximizar = false">
                    <q-tooltip class="bg-white text-primary">Reduzir</q-tooltip>
                </q-btn>
                <q-btn dense flat icon="close" @click="closeModal">
                    <q-tooltip class="bg-white text-primary">Fechar</q-tooltip>
                </q-btn>
            </q-card-section>
            <q-separator />
            <div class="scroll" :style="{ maxHeight: toogleMaximizar ? '80vh' : '70vh' }" ref="provaContent">
                <q-card-section v-if="prova">
                    <div class="text-left">
                        <div>Escola: {{ prova.escola }}</div>
                        <div>Disciplina: {{ prova.disciplina }}</div>
                        <div>Professor: {{ prova.professor }}</div>
                    </div>
                </q-card-section>
                <q-card-section>
                    <div class="q-gutter-md" v-if="provaGeradaIA">
                        <div v-for="(questao, index) in provaGeradaIA.questoes" :key="index">
                            <q-card class="q-mb-md">
                                <q-card-section>
                                    <q-item>
                                        <q-item-section>
                                            <div>
                                                {{ index + 1 }}. {{ questao.questao }}
                                            </div>
                                        </q-item-section>
                                        <q-item-section side>
                                            <q-btn size="xs" flat icon="edit" @click="openEditModal(questao, index)" />
                                        </q-item-section>
                                    </q-item>
                                    <q-separator />
                                    <q-list>
                                        <q-item v-for="(alternativa, idx) in questao.alternativas" :key="idx">
                                            <q-item-section>
                                                <div>
                                                    {{ String.fromCharCode(65 + idx) }}) {{ alternativa.alternativa }}
                                                    <span v-if="alternativa.resposta === 'correto'"> (Correta)</span>
                                                </div>
                                            </q-item-section>
                                            <q-item-section side>
                                                <q-btn size="xs" flat icon="edit" />
                                            </q-item-section>
                                        </q-item>
                                    </q-list>
                                </q-card-section>
                            </q-card>
                        </div>
                    </div>
                </q-card-section>
            </div>
            <q-separator />
            <q-card-actions align="left" class="row q-m-none q-p-none">
                <q-fab flat color="primary" class="col-8" padding="xs" label-position="left" label="BAIXAR PROVA"
                    icon="download" direction="up">
                    <template v-slot:label="{ opened }">
                        <div :class="{ 'example-fab-animate--hover': opened !== true }">
                            {{ opened !== true ? 'BAIXAR PROVA' : 'ESCOLHA O GABARITO' }}
                        </div>
                    </template>
                    <q-fab-action @click="downloadProva(3)" color="primary" icon="article"
                        label="Gabarito em uma página separada" />
                    <q-fab-action @click="downloadProva(2)" color="primary" icon="list"
                        label="Gabarito nas Alternativas" />
                    <q-fab-action @click="downloadProva(1)" color="primary" icon="block" label="Sem Gabarito" />
                </q-fab>
                <q-btn flat class="col-4 q-m-none" padding="xs" label="Gerar Prova Novamente" icon-right="restart_alt"
                    color="primary" v-close-popup />
            </q-card-actions>
        </q-card>
        <!-- Modal Assunto -->
        <q-dialog v-model="isEditModalOpen" persistent>
            <q-card style="min-width: 350px">
                <q-card-section>
                    <q-toolbar>
                        <q-toolbar-title class="text-h6 text-primary">Editar Questão</q-toolbar-title>

                        <q-btn flat round dense icon="close" v-close-popup />
                    </q-toolbar>
                </q-card-section>

                <q-card-section class="q-pt-none">
                    <q-input dense v-model="editedQuestao" autofocus @keyup.enter="isEditModalOpen = false" />
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat label="Alterar" v-close-popup @click="saveEdit" />
                </q-card-actions>
            </q-card>
        </q-dialog>

    </q-dialog>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue';
import { useQuasar } from 'quasar'
import { Document, Packer, Paragraph, TextRun, Footer, SectionType, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import { provaGerada } from '../../model/constantes';
const $q = useQuasar()
const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    },
    prova: {
        type: Object,
        required: true
    }
});
let provaGeradaIA = ref();
watch(() => props.modelValue, (newValue) => {
    if (newValue) {
        alert('modal aberto');
        provaGeradaIA.value = provaGerada;
    }
});
const emit = defineEmits(['update:modelValue']);

const toogleMaximizar = ref(false);

function closeModal() {
    emit('update:modelValue', false);
}

function updateModelValue(value: boolean) {
    emit('update:modelValue', value);
}

const isEditModalOpen = ref(false);
const editedQuestao = ref('');
const currentIndex = ref(-1);

const openEditModal = (questao: any, index: any) => {
    editedQuestao.value = questao.questao;
    currentIndex.value = index;
    isEditModalOpen.value = true;
};

const saveEdit = () => {
    if (currentIndex.value !== -1) {
        provaGeradaIA.value.questoes[currentIndex.value].questao = editedQuestao.value;
    }
    closeEditModal();
};

const closeEditModal = () => {
    isEditModalOpen.value = false;
};

// Função para download da prova
const downloadProva = async (gabarito: number) => {
    try {
        const doc = criarDocumento(gabarito);
        const buffer = await Packer.toBlob(doc);
        const nomeArquivo = gerarNomeProva();

        saveAs(buffer, nomeArquivo);

        notificarSucessoDownload();
    } catch (error) {
        console.error(error);
        notificarErroDownload();
    }

}

function criarDocumento(gabarito: number): Document {
    return new Document({
        styles: {
            paragraphStyles: [
                {
                    id: "paragrafoPadrao",
                    name: "Paragrafo Padrao",
                    basedOn: "Normal",
                    next: "Normal",
                    run: {
                        size: 24
                    },
                },
            ],
        },
        sections: [
            {
                footers: {
                    default: new Footer({
                        children: [new Paragraph("Gerado por ProvA.I - versao 2")],
                    }),
                },
                properties: {},
                children: criarConteudo(gabarito),
            },
            ...(gabarito == 3 ? [criarPaginaGabarito()] : []),
        ],
    });
}


function criarConteudo(gabarito: number): Paragraph[] {
    return [
        new Paragraph({
            children: [new TextRun(`Escola: ${props.prova.escola}`)],
            heading: 'Heading3',
        }),
        new Paragraph({
            children: [new TextRun(`Disciplina: ${props.prova.disciplina}`)],
        }),
        new Paragraph({
            children: [new TextRun(`Professor: ${props.prova.professor}`)],
        }),
        new Paragraph({
            children: [new TextRun(`\n`)],
        }),
        ...provaGeradaIA.value.questoes.flatMap((questao: any, index: any) => [
            new Paragraph({
                children: [new TextRun({ text: `Questão ${index + 1}: ${questao.questao}`, bold: true })],
                style: "paragrafoPadrao"
            }),
            ...questao.alternativas.map((alternativa: any, idx: any) =>
                new Paragraph({
                    children: [new TextRun(`${String.fromCharCode(65 + idx)}) ${alternativa.alternativa}${gabarito === 2 && alternativa.resposta === 'correto' ? ' (Correta)' : ''}`),
                    ],
                    style: "paragrafoPadrao",
                })
            ),
            new Paragraph({
                children: [new TextRun(`\n`)],
            }),
        ]),
    ]
}

function criarPaginaGabarito(): { properties: any, children: Paragraph[] } {
    return {
        properties: {
            type: SectionType.NEXT_PAGE,
        },
        children: [
            new Paragraph({
                text: "Gabarito",
                heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
                text: "\n",
            }),
            ...provaGeradaIA.value.questoes.flatMap((questao: any, index: any) => {
                const respostaCorreta = questao.alternativas.find((alternativa: any) => alternativa.resposta === 'correto');
                const letraResposta = respostaCorreta ? String.fromCharCode(65 + questao.alternativas.indexOf(respostaCorreta)) : 'N/A';
                return [
                    new Paragraph({
                        text: `Questão ${index + 1} - ${letraResposta})`, style: "paragrafoPadrao"
                    }),
                ];
            }),
        ],
    }
};

function gerarNomeProva() {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}_${currentDate.getMonth() + 1}_${currentDate.getFullYear()}`;
    return `provAI_${props.prova.professor}_${props.prova.disciplina}_${formattedDate}.docx`;
}

function notificarSucessoDownload() {
    $q.notify({
        message: 'Prova baixada com sucesso',
        icon: 'download',
        color: 'primary',
        progress: true,
        timeout: 2000,
    });
}

function notificarErroDownload() {
    $q.notify({
        message: 'Aconteceu um probleminha ao baixar a prova. Tente novamente mais tarde',
        icon: 'error',
        type: 'negative',
        progress: true,
        timeout: 3000,
    });
}
</script>
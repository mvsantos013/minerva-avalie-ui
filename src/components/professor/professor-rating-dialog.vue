<template>
  <q-card :style="'max-width: 36rem;'">
    <div class="app-title pb-3 bg-primary-400 text-white pl-3 pt-3">
      Avaliar Professor
    </div>

    <q-card-section>
      <q-form
        ref="form"
        autofocus
        @submit.prevent="$emit('onSubmitProfessorRating')"
      >
        <section class="mb-10">
          <div class="flex items-center mb-2">
            <h5
              class="inline-block px-3 bg-primary text-white rounded-md mr-3 leading-relaxed"
            >
              Didática
            </h5>
            <StarRating
              class="h-5 pb-1"
              :rating="ratings.didactic"
              :star-size="24"
              animate
              text-class="invisible"
              @rating-selected="$set(ratings, 'didactic', $event)"
            />
          </div>
          <div class="mb-3">
            <ul :style="'font-size: 0.85rem'">
              <li class="mb-1">
                <div class="text-primary-500">Clareza de explicações</div>
                <p class="ml-4 leading-tight">
                  O professor consegue explicar o conteúdo de forma clara e
                  compreensível para os alunos.
                </p>
              </li>
              <li class="mb-1">
                <div class="text-primary-500">Engajamento dos alunos</div>
                <p class="ml-4 leading-tight">
                  O professor consegue envolver os alunos nas aulas e manter a
                  atenção deles.
                </p>
              </li>
              <li class="mb-1">
                <div class="text-primary-500">Adaptabilidade</div>
                <p class="ml-4 leading-tight">
                  O professor é capaz de adaptar o seu ensino para atender às
                  necessidades dos alunos.
                </p>
              </li>
            </ul>
          </div>
          <q-input
            v-model="comments.didactic"
            label="Observações (opcional)"
            type="textarea"
            filled
            dense
            maxlength="256"
            rows="2"
          />
        </section>

        <section class="mb-10">
          <div class="flex items-center mb-2">
            <h5
              class="inline-block px-3 bg-primary text-white rounded-md mr-3 leading-relaxed"
            >
              Organização
            </h5>
            <StarRating
              class="h-5 pb-1"
              :rating="ratings.organization"
              :star-size="24"
              animate
              text-class="invisible"
              @rating-selected="$set(ratings, 'organization', $event)"
            />
          </div>
          <div class="mb-3">
            <ul :style="'font-size: 0.85rem'">
              <li class="mb-1">
                <div class="text-primary-500">Planejamento do calendário</div>
                <p class="ml-4 leading-tight">
                  O professor organiza o calendário e marca datas de atividades
                  com antecedência.
                </p>
              </li>
              <li class="mb-1">
                <div class="text-primary-500">Planejamento das aulas</div>
                <p class="ml-4 leading-tight">
                  O professor tem um plano de aulas claro e bem estruturado.
                </p>
              </li>
              <li class="mb-1">
                <div class="text-primary-500">Comunicação clara</div>
                <p class="ml-4 leading-tight">
                  O professor comunica claramente as expectativas do curso e
                  possíveis mudanças de programação para os alunos.
                </p>
              </li>
            </ul>
          </div>
          <q-input
            v-model="comments.organization"
            label="Observações (opcional)"
            type="textarea"
            filled
            dense
            maxlength="256"
            rows="2"
          />
        </section>

        <section class="mb-10">
          <div class="flex items-center mb-2">
            <h5
              class="inline-block px-3 bg-primary text-white rounded-md mr-3 leading-relaxed"
            >
              Material de referência
            </h5>
            <StarRating
              class="h-5 pb-1"
              :rating="ratings.materials"
              :star-size="24"
              animate
              text-class="invisible"
              @rating-selected="$set(ratings, 'materials', $event)"
            />
          </div>
          <div class="mb-3">
            <ul :style="'font-size: 0.85rem'">
              <li class="mb-1">
                <div class="text-primary-500">Relevância</div>
                <p class="ml-4 leading-tight">
                  O material é relevante para o assunto ou disciplina que está
                  sendo estudada.
                </p>
              </li>
              <li class="mb-1">
                <div class="text-primary-500">Clareza</div>
                <p class="ml-4 leading-tight">
                  O material é claro e compreensível, com explicações e exemplos
                  que ajudam os alunos a compreender o conteúdo.
                </p>
              </li>
              <li class="mb-1">
                <div class="text-primary-500">Atualidade</div>
                <p class="ml-4 leading-tight">
                  O material está atualizado e abrange as últimas informações e
                  desenvolvimentos relevantes.
                </p>
              </li>
              <li class="mb-1">
                <div class="text-primary-500">Completude</div>
                <p class="ml-4 leading-tight">
                  O material abrange todos os aspectos relevantes do assunto ou
                  disciplina, incluindo informações importantes e exemplos.
                </p>
              </li>
            </ul>
          </div>
          <q-input
            v-model="comments.materials"
            label="Observações (opcional)"
            type="textarea"
            filled
            dense
            maxlength="256"
            rows="2"
          />
        </section>

        <section class="mb-10">
          <div class="flex items-center mb-2">
            <h5
              class="inline-block px-3 bg-primary text-white rounded-md mr-3 leading-relaxed"
            >
              Relação com os alunos
            </h5>
            <StarRating
              class="h-5 pb-1"
              :rating="ratings.relationship"
              :star-size="24"
              animate
              text-class="invisible"
              @rating-selected="$set(ratings, 'relationship', $event)"
            />
          </div>
          <div class="mb-3">
            <ul :style="'font-size: 0.85rem'">
              <li class="mb-1">
                <div class="text-primary-500">Respeito</div>
                <p class="ml-4 leading-tight">
                  O professor trata os alunos com respeito, valoriza sua opinião
                  e busca compreender suas necessidades.
                </p>
              </li>
              <li class="mb-1">
                <div class="text-primary-500">Comunicação</div>
                <p class="ml-4 leading-tight">
                  O professor comunica de forma clara e efetiva com os alunos,
                  mantendo um diálogo aberto e inclusivo.
                </p>
              </li>
              <li class="mb-1">
                <div class="text-primary-500">Empatia</div>
                <p class="ml-4 leading-tight">
                  O professor demonstra compreensão e empatia em relação às
                  dificuldades e necessidades dos alunos.
                </p>
              </li>
              <li class="mb-1">
                <div class="text-primary-500">Apoio</div>
                <p class="ml-4 leading-tight">
                  O professor fornece apoio e ajuda aos alunos quando
                  necessário, incluindo ajuda com questões de casa, projetos e
                  outros requisitos.
                </p>
              </li>
            </ul>
          </div>
          <q-input
            v-model="comments.relationship"
            label="Observações (opcional)"
            type="textarea"
            filled
            dense
            maxlength="256"
            rows="2"
          />
        </section>

        <section class="mb-10">
          <div class="flex items-center mb-2">
            <h5
              class="inline-block px-3 bg-primary text-white rounded-md mr-3 leading-relaxed"
            >
              Qualidade da avaliação
            </h5>
            <StarRating
              class="h-5 pb-1"
              :rating="ratings.evaluation"
              :star-size="24"
              animate
              text-class="invisible"
              @rating-selected="$set(ratings, 'evaluation', $event)"
            />
          </div>
          <div class="mb-3">
            <ul :style="'font-size: 0.85rem'">
              <li class="mb-1">
                <div class="text-primary-500">Relevância</div>
                <p class="ml-4 leading-tight">
                  As avaliações estão relacionadas ao assunto ou disciplina que
                  está sendo estudado e cobrem os conteúdos importantes.
                </p>
              </li>
              <li class="mb-1">
                <div class="text-primary-500">Objetividade</div>
                <p class="ml-4 leading-tight">
                  As avaliações são objetivas e não subjetivas, com questões
                  claras e sem ambiguidade.
                </p>
              </li>
              <li class="mb-1">
                <div class="text-primary-500">Clareza</div>
                <p class="ml-4 leading-tight">
                  As avaliações são claras e compreensíveis, com instruções
                  claras e exemplos que ajudam os alunos a compreender o que é
                  esperado.
                </p>
              </li>
              <li class="mb-1">
                <div class="text-primary-500">Equilíbrio</div>
                <p class="ml-4 leading-tight">
                  As avaliações cobrem um equilíbrio adequado entre diferentes
                  aspectos da disciplina ou assunto, incluindo teoria e prática.
                  Além disso, as avaliações não são excessivamente exaustivas.
                </p>
              </li>
            </ul>
          </div>
          <q-input
            v-model="comments.evaluation"
            label="Observações (opcional)"
            type="textarea"
            filled
            dense
            maxlength="256"
            rows="2"
          />
        </section>

        <section class="mb-8">
          <h5
            class="inline-block px-3 bg-primary text-white rounded-md mr-3 mb-3 leading-relaxed"
          >
            Dificuldade das provas e/ou trabalhos
          </h5>
          <div class="mb-3">
            <q-radio
              v-for="i in 5"
              :key="i"
              v-model="ratings.testDifficulty"
              :val="i"
              :label="`${i}`"
              dense
              class="mr-4"
              :rules="[(val) => !!val || 'Campo obrigatório']"
            />
          </div>
          <p class="leading-tight italic" :style="'font-size: 0.85rem'">
            Obs: Esta categoria não é considerada para o cálculo de nota do
            professor
          </p>
        </section>

        <q-card-actions align="right" :style="'padding-right: 0'">
          <div class="inline-block">
            <q-btn
              color="primary"
              :disable="submitDisabled"
              @click="$emit('onSubmitProfessorRating', { ratings, comments })"
            >
              Salvar
            </q-btn>
            <q-tooltip v-if="submitDisabled">
              É necessário avaliar todas as categorias para salvar.
            </q-tooltip>
          </div>
        </q-card-actions>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script>
import StarRating from 'vue-star-rating'

export default {
  components: {
    StarRating,
  },
  props: {
    studentRatings: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      ratings: {},
      comments: {},
    }
  },
  computed: {
    submitDisabled() {
      const r = [
        'didactic',
        'organization',
        'materials',
        'relationship',
        'evaluation',
        'testDifficulty',
      ]
      return r.some((r) => !this.ratings[r])
    },
  },
  watch: {
    studentRatings: {
      handler(val) {
        // if (val?.ratings) this.rating = this.copy(val.ratings)
        // else this.rating = this.copy(val || {})
        this.ratings = this.copy(val?.ratings || {})
        this.comments = this.copy(val?.comments || {})
      },
      deep: true,
    },
  },
  mounted() {
    this.ratings = this.copy(this.studentRatings?.ratings || {})
    this.comments = this.copy(this.studentRatings?.comments || {})
  },
  methods: {
    copy(obj) {
      return JSON.parse(JSON.stringify(obj))
    },
  },
}
</script>

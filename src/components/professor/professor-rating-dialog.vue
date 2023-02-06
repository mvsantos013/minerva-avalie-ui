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
        <section class="mb-8">
          <div class="flex items-center mb-2">
            <h5
              class="inline-block px-3 bg-primary text-white rounded-md mr-3 leading-relaxed"
            >
              Didática
            </h5>
            <StarRating
              class="h-5 pb-1"
              :rating="0"
              :star-size="24"
              animate
              text-class="invisible"
            />
          </div>
          <div>
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
        </section>

        <section class="mb-8">
          <div class="flex items-center mb-2">
            <h5
              class="inline-block px-3 bg-primary text-white rounded-md mr-3 leading-relaxed"
            >
              Organização
            </h5>
            <StarRating
              class="h-5 pb-1"
              :rating="0"
              :star-size="24"
              animate
              text-class="invisible"
            />
          </div>
          <div>
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
        </section>

        <section class="mb-8">
          <div class="flex items-center mb-2">
            <h5
              class="inline-block px-3 bg-primary text-white rounded-md mr-3 leading-relaxed"
            >
              Material de referência
            </h5>
            <StarRating
              class="h-5 pb-1"
              :rating="0"
              :star-size="24"
              animate
              text-class="invisible"
            />
          </div>
          <div>
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
        </section>

        <section class="mb-8">
          <div class="flex items-center mb-2">
            <h5
              class="inline-block px-3 bg-primary text-white rounded-md mr-3 leading-relaxed"
            >
              Relação com os alunos
            </h5>
            <StarRating
              class="h-5 pb-1"
              :rating="0"
              :star-size="24"
              animate
              text-class="invisible"
            />
          </div>
          <div>
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
        </section>

        <section class="mb-8">
          <div class="flex items-center mb-2">
            <h5
              class="inline-block px-3 bg-primary text-white rounded-md mr-3 leading-relaxed"
            >
              Qualidade da avaliação
            </h5>
            <StarRating
              class="h-5 pb-1"
              :rating="0"
              :star-size="24"
              animate
              text-class="invisible"
            />
          </div>
          <div>
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
              v-model="teste"
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
          <q-btn color="primary">Salvar</q-btn>
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
  data() {
    return {
      teste: null,
    }
  },
}
</script>
